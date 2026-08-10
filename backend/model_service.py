import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, List, Optional, Tuple
from backend.database import get_model_by_name, get_models_metadata

GENRE_MAP = {
    'Action': 1, 'Adventure': 2, 'Animation': 3, 'Children': 4, 'Comedy': 5,
    'Crime': 6, 'Documentary': 7, 'Drama': 8, 'Fantasy': 9, 'Film-Noir': 10,
    'Horror': 11, 'IMAX': 12, 'Musical': 13, 'Mystery': 14, 'Romance': 15,
    'Sci-Fi': 16, 'Thriller': 17, 'War': 18, 'Western': 19
}

MODEL_CACHE: Dict[str, Dict[str, Any]] = {}

def get_loaded_model_bundle(model_name: str) -> Dict[str, Any]:
    if model_name in MODEL_CACHE:
        return MODEL_CACHE[model_name]

    # Fetch model metadata ONLY from SQLite
    meta = get_model_by_name(model_name)
    if not meta:
        all_models = get_models_metadata()
        if not all_models:
            raise RuntimeError("No model metadata found in SQLite database!")
        meta = get_model_by_name(all_models[0]["name"])
        if not meta:
            raise RuntimeError("Failed to retrieve model metadata from SQLite database.")

    file_path = meta["file_path"]
    if not os.path.exists(file_path):
        alt_path = os.path.join(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'ModelResult')), f"model_{meta['name'].replace(' ', '_').replace('(', '').replace(')', '').replace('/', '_')}.joblib")
        if os.path.exists(alt_path):
            file_path = alt_path
        elif os.path.exists(os.path.join(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'ModelResult')), 'best_model.joblib')):
            file_path = os.path.join(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'ModelResult')), 'best_model.joblib')
        else:
            raise FileNotFoundError(f"Model file for '{model_name}' not found at: {file_path}")

    bundle = joblib.load(file_path)
    bundle['db_meta'] = meta
    MODEL_CACHE[model_name] = bundle
    return bundle

def construct_feature_matrix(
    movies_list: List[Dict[str, Any]],
    user_avg_rating: float,
    user_rating_count: float,
    feature_cols: List[str]
) -> np.ndarray:
    n_samples = len(movies_list)
    matrix = np.zeros((n_samples, len(feature_cols)), dtype=np.float32)

    for i, m in enumerate(movies_list):
        year_val = m.get("year")
        if year_val is None or pd.isna(year_val):
            year_val = 1995.0
        else:
            year_val = float(year_val)

        genres_list = m.get("genres", [])
        if isinstance(genres_list, str):
            genres_list = [g.strip() for g in genres_list.split('|') if g.strip()]

        genre_ids_set = {GENRE_MAP[g] for g in genres_list if g in GENRE_MAP}

        avg_movie_rating = float(m.get("avg_movie_rating", 3.5))
        rating_count = float(m.get("rating_count", 10.0))

        row_dict = {
            "year": year_val,
            "avg_movie_rating": avg_movie_rating,
            "rating_count": rating_count,
            "avg_user_rating": float(user_avg_rating),
            "user_rating_count": float(user_rating_count)
        }

        for genre_name, gid in GENRE_MAP.items():
            row_dict[f"genre_{gid}"] = 1.0 if gid in genre_ids_set else 0.0

        for j, col in enumerate(feature_cols):
            matrix[i, j] = row_dict.get(col, 0.0)

    return matrix

def predict_single_movie(
    model_name: str,
    movie_dict: Dict[str, Any],
    user_avg_rating: float = 3.5,
    user_rating_count: float = 20.0
) -> Dict[str, Any]:
    bundle = get_loaded_model_bundle(model_name)
    model = bundle['model']
    scaler = bundle.get('scaler')
    feature_cols = bundle['feature_cols']

    X = construct_feature_matrix([movie_dict], user_avg_rating, user_rating_count, feature_cols)

    if scaler is not None:
        X_scaled = scaler.transform(X)
    else:
        X_scaled = X

    prob = None
    if hasattr(model, "predict_proba"):
        try:
            prob_arr = model.predict_proba(X_scaled)[:, 1]
            prob = float(prob_arr[0])
            pred = int(prob >= 0.5)
        except Exception:
            pred = int(model.predict(X_scaled)[0])
    else:
        pred = int(model.predict(X_scaled)[0])

    liked_label = "Beğenebilir" if pred == 1 else "Beğenmeyebilir"
    confidence = round(prob * 100, 2) if prob is not None else (100.0 if pred == 1 else 0.0)

    return {
        "model_name": bundle.get("name", model_name),
        "liked_prediction": pred,
        "liked_label": liked_label,
        "probability": round(prob, 4) if prob is not None else None,
        "confidence_score": confidence,
        "movie_info": movie_dict
    }

def recommend_top_movies(
    model_name: str,
    candidate_movies: List[Dict[str, Any]],
    user_avg_rating: float = 3.5,
    user_rating_count: float = 20.0,
    top_n: int = 12
) -> Dict[str, Any]:
    if not candidate_movies:
        return {
            "model_name": model_name,
            "total_candidates_analyzed": 0,
            "recommendations": []
        }

    bundle = get_loaded_model_bundle(model_name)
    model = bundle['model']
    scaler = bundle.get('scaler')
    feature_cols = bundle['feature_cols']

    X = construct_feature_matrix(candidate_movies, user_avg_rating, user_rating_count, feature_cols)

    if scaler is not None:
        X_scaled = scaler.transform(X)
    else:
        X_scaled = X

    has_proba = hasattr(model, "predict_proba")
    if has_proba:
        try:
            probas = model.predict_proba(X_scaled)[:, 1]
            preds = (probas >= 0.5).astype(int)
        except Exception:
            preds = model.predict(X_scaled)
            probas = preds.astype(float)
    else:
        preds = model.predict(X_scaled)
        probas = preds.astype(float)

    scored_items = []
    for i, m in enumerate(candidate_movies):
        score = float(probas[i])
        pred = int(preds[i])
        scored_items.append({
            "movie_id": m["movie_id"],
            "title": m["title"],
            "year": m["year"],
            "genres": m["genres"],
            "avg_movie_rating": m["avg_movie_rating"],
            "rating_count": m["rating_count"],
            "recommendation_score": round(score, 4),
            "prediction": pred,
            "imdb_id": m.get("imdb_id"),
            "tmdb_id": m.get("tmdb_id")
        })

    scored_items.sort(key=lambda x: (x["recommendation_score"], x["avg_movie_rating"], x["rating_count"]), reverse=True)
    top_recommendations = scored_items[:top_n]

    return {
        "model_name": bundle.get("name", model_name),
        "total_candidates_analyzed": len(candidate_movies),
        "recommendations": top_recommendations
    }
