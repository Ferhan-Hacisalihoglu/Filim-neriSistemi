import os
import sys
import math
import json
import re
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor
from typing import Optional, List, Dict, Any

_poster_executor = ThreadPoolExecutor(max_workers=10)

# Ensure project root & backend are in sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware

from backend.database import (
    DB_PATH,
    get_movies,
    get_movie_by_id,
    get_genres,
    get_models_metadata,
    get_model_by_name,
    get_stats,
    get_candidate_movies_for_recommendation
)
from backend.init_db import init_database
from backend.schemas import (
    MovieResponse,
    MovieListResponse,
    GenreResponse,
    ModelMetadataResponse,
    StatsResponse,
    PredictionRequest,
    PredictionResponse,
    RecommendationRequest,
    RecommendationResponse
)
from backend.model_service import predict_single_movie, recommend_top_movies

app = FastAPI(
    title="Film Öneri Sistemi & Makine Öğrenmesi Backend API",
    description="SQLite veritabanı destekli, eğitilmiş ML modelleri (Logistic Regression, Random Forest, Decision Tree vb.) ile film filtreleme ve kişiselleştirilmiş film öneri API'si.",
    version="1.0.0"
)

# Enable CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    """Ensure SQLite database exists and is populated on startup."""
    if not os.path.exists(DB_PATH):
        print(f"Database file not found at {DB_PATH}. Initializing database...")
        init_database()
    else:
        print(f"SQLite Database verified at {DB_PATH}")

@app.get("/", tags=["Health & Root"])
def root():
    return {
        "status": "online",
        "message": "Film Öneri Sistemi Backend API Hizmeti Çalışıyor",
        "docs_url": "/docs",
        "database": "SQLite",
        "endpoints": [
            "/api/movies",
            "/api/movies/{id}",
            "/api/genres",
            "/api/models",
            "/api/stats",
            "/api/predict",
            "/api/recommend"
        ]
    }

@app.get("/api/movies", response_model=MovieListResponse, tags=["Filmler"])
def list_movies(
    title: Optional[str] = Query(None, description="Film başlığında arama"),
    genre: Optional[str] = Query(None, description="Film türüne göre filtrele (ör: Action, Comedy)"),
    year_min: Optional[int] = Query(None, ge=1800, le=2100, description="Minimum yapım yılı"),
    year_max: Optional[int] = Query(None, ge=1800, le=2100, description="Maksimum yapım yılı"),
    rating_min: Optional[float] = Query(None, ge=0.0, le=5.0, description="Minimum ortalama puan"),
    rating_max: Optional[float] = Query(None, ge=0.0, le=5.0, description="Maksimum ortalama puan"),
    min_rating_count: Optional[float] = Query(None, ge=0.0, description="Minimum toplam oy sayısı"),
    sort_by: str = Query("avg_movie_rating", regex="^(avg_movie_rating|rating_count|year|title|movie_id)$", description="Sıralama kriteri"),
    order: str = Query("desc", regex="^(asc|desc)$", description="Sıralama yönü (asc/desc)"),
    page: int = Query(1, ge=1, description="Sayfa numarası"),
    page_size: int = Query(20, ge=1, le=100, description="Sayfa başı film sayısı")
):
    """
    Sadece SQLite veritabanı üzerinden filmleri filtreler, sıralar ve sayfalandırır.
    """
    movies_data, total_count = get_movies(
        title=title,
        genre=genre,
        year_min=year_min,
        year_max=year_max,
        rating_min=rating_min,
        rating_max=rating_max,
        min_rating_count=min_rating_count,
        sort_by=sort_by,
        order=order,
        page=page,
        page_size=page_size
    )

    total_pages = math.ceil(total_count / page_size) if total_count > 0 else 0

    return MovieListResponse(
        total=total_count,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
        movies=[MovieResponse(**m) for m in movies_data]
    )

@app.get("/api/movies/{movie_id}", response_model=MovieResponse, tags=["Filmler"])
def get_movie_detail(movie_id: int):
    """
    SQLite veritabanından ID'ye göre tekil film detayını getirir.
    """
    movie = get_movie_by_id(movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail=f"ID={movie_id} olan film veritabanında bulunamadı.")
    return MovieResponse(**movie)

@app.get("/api/genres", response_model=List[GenreResponse], tags=["Türler"])
def list_genres():
    """
    SQLite veritabanındaki tüm film türlerinin listesini getirir.
    """
    genres = get_genres()
    return [GenreResponse(**g) for g in genres]

@app.get("/api/models", response_model=List[ModelMetadataResponse], tags=["ML Modelleri"])
def list_models():
    """
    SQLite veritabanına kayıtlı eğitilmiş tüm ML modellerini (Accuracy, AUC, CV vb.) listeler.
    """
    models = get_models_metadata()
    return [ModelMetadataResponse(**m) for m in models]

@app.get("/api/stats", response_model=StatsResponse, tags=["İstatistikler"])
def get_dataset_stats():
    """
    SQLite veritabanından genel film, tür, yıl ve model istatistiklerini getirir.
    """
    stats_data = get_stats()
    return StatsResponse(**stats_data)

@app.post("/api/predict", response_model=PredictionResponse, tags=["Tahmin & Öneri"])
def predict_movie_likelihood(req: PredictionRequest):
    """
    Seçilen ML modelini (ör: Logistic Regression, Random Forest, Decision Tree vb.) kullanarak
    bir filmin veya özel özelliklerin kullanıcı tarafından beğenilme olasılığını tahmin eder.
    """
    movie_dict = None
    if req.movie_id is not None:
        movie_dict = get_movie_by_id(req.movie_id)
        if not movie_dict:
            raise HTTPException(status_code=404, detail=f"ID={req.movie_id} olan film SQLite'ta bulunamadı.")

    if movie_dict is None:
        # Construct movie dictionary from custom attributes
        movie_dict = {
            "movie_id": 0,
            "title": "Özel Film Girişi",
            "year": req.custom_year if req.custom_year is not None else 2020,
            "genres": req.custom_genres if req.custom_genres is not None else ["Drama"],
            "avg_movie_rating": req.custom_avg_movie_rating if req.custom_avg_movie_rating is not None else 3.5,
            "rating_count": req.custom_rating_count if req.custom_rating_count is not None else 50.0
        }

    try:
        res = predict_single_movie(
            model_name=req.model_name,
            movie_dict=movie_dict,
            user_avg_rating=req.user_avg_rating,
            user_rating_count=req.user_rating_count
        )
        return PredictionResponse(**res)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model tahmini sırasında hata oluştu: {str(e)}")

@app.post("/api/recommend", response_model=RecommendationResponse, tags=["Tahmin & Öneri"])
def recommend_movies_post(req: RecommendationRequest):
    """
    SQLite veritabanındaki filmler arasından kullanıcının seçtiği filtre ve ML modeline göre
    en çok tavsiye edilen top N filmi getirir.
    """
    candidates = get_candidate_movies_for_recommendation(
        genre=req.genre,
        min_year=req.min_year,
        max_year=req.max_year,
        min_rating=req.min_rating,
        min_rating_count=req.min_rating_count,
        limit=500
    )

    try:
        rec_data = recommend_top_movies(
            model_name=req.model_name,
            candidate_movies=candidates,
            user_avg_rating=req.user_avg_rating,
            user_rating_count=req.user_rating_count,
            top_n=req.top_n
        )
        return RecommendationResponse(**rec_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Öneri oluşturulurken hata oluştu: {str(e)}")

@app.get("/api/recommend", response_model=RecommendationResponse, tags=["Tahmin & Öneri"])
def recommend_movies_get(
    model_name: str = Query("Logistic Regression", description="Kullanılacak model adı"),
    genre: Optional[str] = Query(None, description="Film türü filtresi"),
    min_year: Optional[int] = Query(None, description="Minimum yapım yılı"),
    max_year: Optional[int] = Query(None, description="Maksimum yapım yılı"),
    min_rating: Optional[float] = Query(None, description="Minimum ortalama film puanı"),
    min_rating_count: Optional[float] = Query(10.0, description="Minimum film oy sayısı"),
    user_avg_rating: float = Query(3.5, ge=0.5, le=5.0, description="Kullanıcının ortalama puanı"),
    user_rating_count: float = Query(20.0, ge=0.0, description="Kullanıcının oy sayısı"),
    top_n: int = Query(10, ge=1, le=100, description="Döndürülecek film sayısı")
):
    """
    GET isteği ile model seçerek en çok tavsiye edilen filmleri listeleme.
    """
    candidates = get_candidate_movies_for_recommendation(
        genre=genre,
        min_year=min_year,
        max_year=max_year,
        min_rating=min_rating,
        min_rating_count=min_rating_count,
        limit=500
    )

    try:
        rec_data = recommend_top_movies(
            model_name=model_name,
            candidate_movies=candidates,
            user_avg_rating=user_avg_rating,
            user_rating_count=user_rating_count,
            top_n=top_n
        )
        return RecommendationResponse(**rec_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Öneri oluşturulurken hata oluştu: {str(e)}")

# TMDB API keys list with fallbacks
TMDB_API_KEYS = [
    os.environ.get("TMDB_API_KEY", ""),
    "a07e22bc18f5cb106bfe4cc1f83ad8ed",
    "3fd2be6986705c5c6a165069780ace9d",
    "f0b08003f569f104d49a7852c00a6e30"
]
TMDB_API_KEYS = [k for k in TMDB_API_KEYS if k.strip()]

# In-memory poster cache to avoid duplicate network calls
_poster_cache: Dict[int, str] = {}

def _fetch_tmdb_poster_api(tmdb_id: int) -> str:
    """
    TMDB resmi API'si üzerinden film afişi URL'sini hızlıca çeker.
    """
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    for key in TMDB_API_KEYS:
        try:
            url = f"https://api.themoviedb.org/3/movie/{tmdb_id}?api_key={key}"
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=4) as resp:
                data = json.loads(resp.read().decode("utf-8", errors="ignore"))
                poster_path = data.get("poster_path")
                if poster_path:
                    return f"https://image.tmdb.org/t/p/w500{poster_path}"
        except Exception:
            continue
    return ""


@app.get("/api/poster/{tmdb_id}", tags=["Filmler"])
def get_movie_poster(tmdb_id: int):
    """
    TMDB ID'si ile film poster URL'sini getirir.
    TMDB API proxy üzerinden resmi poster resmini döndürür.
    """
    if tmdb_id in _poster_cache:
        return {"tmdb_id": tmdb_id, "poster_url": _poster_cache[tmdb_id]}

    try:
        poster_url = _fetch_tmdb_poster_api(tmdb_id)
        if poster_url:
            _poster_cache[tmdb_id] = poster_url
            return {"tmdb_id": tmdb_id, "poster_url": poster_url}
    except Exception:
        pass

    _poster_cache[tmdb_id] = ""
    return {"tmdb_id": tmdb_id, "poster_url": None}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
