import os
import sqlite3
from typing import List, Dict, Any, Optional, Tuple

DB_PATH = os.path.join(os.path.dirname(__file__), 'database.sqlite')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def parse_genres_str(genres_raw: str) -> List[str]:
    if not genres_raw or genres_raw in ("(no genres listed)", "0"):
        return []
    return [g.strip() for g in str(genres_raw).split('|') if g.strip()]

def get_movies(
    title: Optional[str] = None,
    genre: Optional[str] = None,
    year_min: Optional[int] = None,
    year_max: Optional[int] = None,
    rating_min: Optional[float] = None,
    rating_max: Optional[float] = None,
    min_rating_count: Optional[float] = None,
    sort_by: str = "avg_movie_rating",
    order: str = "desc",
    page: int = 1,
    page_size: int = 20
) -> Tuple[List[Dict[str, Any]], int]:
    conn = get_db()
    cursor = conn.cursor()

    conditions = []
    params = []

    if title:
        conditions.append("m.title LIKE ?")
        params.append(f"%{title.strip()}%")

    if genre:
        conditions.append("m.movie_id IN (SELECT movie_id FROM movie_genres WHERE genre_name = ?)")
        params.append(genre.strip())

    if year_min is not None:
        conditions.append("m.year >= ?")
        params.append(year_min)

    if year_max is not None:
        conditions.append("m.year <= ?")
        params.append(year_max)

    if rating_min is not None:
        conditions.append("m.avg_movie_rating >= ?")
        params.append(rating_min)

    if rating_max is not None:
        conditions.append("m.avg_movie_rating <= ?")
        params.append(rating_max)

    if min_rating_count is not None:
        conditions.append("m.rating_count >= ?")
        params.append(min_rating_count)

    where_clause = f"WHERE {' AND '.join(conditions)}" if conditions else ""

    # Count total matching rows
    count_sql = f"SELECT COUNT(*) FROM movies m {where_clause}"
    cursor.execute(count_sql, params)
    total_count = cursor.fetchone()[0]

    # Validate sorting column
    valid_sort_cols = {
        "movie_id": "m.movie_id",
        "title": "m.title",
        "year": "m.year",
        "avg_movie_rating": "m.avg_movie_rating",
        "rating_count": "m.rating_count"
    }
    sort_column = valid_sort_cols.get(sort_by, "m.avg_movie_rating")
    sort_order = "ASC" if order.lower() == "asc" else "DESC"

    offset = (page - 1) * page_size
    query_sql = f"""
        SELECT m.movie_id, m.title, m.year, m.genres, m.avg_movie_rating, m.rating_count, m.imdb_id, m.tmdb_id
        FROM movies m
        {where_clause}
        ORDER BY {sort_column} {sort_order}
        LIMIT ? OFFSET ?
    """
    cursor.execute(query_sql, params + [page_size, offset])
    rows = cursor.fetchall()

    movies_list = []
    for row in rows:
        movies_list.append({
            "movie_id": row["movie_id"],
            "title": row["title"],
            "year": row["year"],
            "genres": parse_genres_str(row["genres"]),
            "avg_movie_rating": round(float(row["avg_movie_rating"]), 2),
            "rating_count": float(row["rating_count"]),
            "imdb_id": row["imdb_id"],
            "tmdb_id": row["tmdb_id"]
        })

    conn.close()
    return movies_list, total_count

def get_movie_by_id(movie_id: int) -> Optional[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT movie_id, title, year, genres, avg_movie_rating, rating_count, imdb_id, tmdb_id FROM movies WHERE movie_id = ?",
        (movie_id,)
    )
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    return {
        "movie_id": row["movie_id"],
        "title": row["title"],
        "year": row["year"],
        "genres": parse_genres_str(row["genres"]),
        "avg_movie_rating": round(float(row["avg_movie_rating"]), 2),
        "rating_count": float(row["rating_count"]),
        "imdb_id": row["imdb_id"],
        "tmdb_id": row["tmdb_id"]
    }

def get_genres() -> List[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name FROM genres ORDER BY name ASC")
    rows = cursor.fetchall()
    conn.close()
    return [{"id": row["id"], "name": row["name"]} for row in rows]

def get_models_metadata() -> List[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, name, accuracy, auc, cv_mean, cv_std, time_sec, file_path
        FROM models_metadata
        ORDER BY accuracy DESC
    """)
    rows = cursor.fetchall()
    conn.close()

    if not rows:
        return []

    best_cv_mean = max((float(row["cv_mean"] or 0) for row in rows), default=0.0)

    models_list = []
    for row in rows:
        cv_m = float(row["cv_mean"]) if row["cv_mean"] is not None else 0.0
        models_list.append({
            "id": row["id"],
            "name": row["name"],
            "accuracy": round(float(row["accuracy"]), 4),
            "auc": round(float(row["auc"]), 4) if row["auc"] is not None else None,
            "cv_mean": round(cv_m, 4),
            "cv_std": round(float(row["cv_std"]), 4) if row["cv_std"] is not None else 0.0,
            "time_sec": round(float(row["time_sec"]), 3) if row["time_sec"] is not None else 0.0,
            "file_path": row["file_path"],
            "is_best": (abs(cv_m - best_cv_mean) < 1e-6 and best_cv_mean > 0)
        })
    return models_list

def get_model_by_name(name: str) -> Optional[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, name, accuracy, auc, cv_mean, cv_std, time_sec, file_path FROM models_metadata WHERE name = ?",
        (name,)
    )
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    return dict(row)

def get_stats() -> Dict[str, Any]:
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM movies")
    total_movies = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM genres")
    total_genres = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM models_metadata")
    total_models = cursor.fetchone()[0]

    cursor.execute("SELECT MIN(year), MAX(year) FROM movies WHERE year IS NOT NULL AND year > 1800")
    yr_row = cursor.fetchone()
    min_yr, max_yr = yr_row[0], yr_row[1]

    cursor.execute("SELECT AVG(avg_movie_rating) FROM movies WHERE avg_movie_rating > 0")
    avg_rating_overall = cursor.fetchone()[0] or 0.0

    cursor.execute("""
        SELECT mg.genre_name, COUNT(mg.movie_id) as movie_cnt, AVG(m.avg_movie_rating) as avg_rating
        FROM movie_genres mg
        JOIN movies m ON mg.movie_id = m.movie_id
        GROUP BY mg.genre_name
        ORDER BY movie_cnt DESC
        LIMIT 10
    """)
    top_genres = [
        {
            "genre": r["genre_name"],
            "movie_count": r["movie_cnt"],
            "avg_rating": round(float(r["avg_rating"] or 0), 2)
        }
        for r in cursor.fetchall()
    ]

    # Top 10 Most Rated Movies
    cursor.execute("""
        SELECT movie_id, title, year, genres, avg_movie_rating, rating_count, imdb_id, tmdb_id
        FROM movies
        ORDER BY rating_count DESC
        LIMIT 10
    """)
    top_10_rated = [
        {
            "movie_id": r["movie_id"],
            "title": r["title"],
            "year": r["year"],
            "genres": parse_genres_str(r["genres"]),
            "avg_movie_rating": round(float(r["avg_movie_rating"]), 2),
            "rating_count": float(r["rating_count"]),
            "imdb_id": r["imdb_id"],
            "tmdb_id": r["tmdb_id"]
        }
        for r in cursor.fetchall()
    ]

    # Top 10 Highest Average Rating Movies (min 10 votes)
    cursor.execute("""
        SELECT movie_id, title, year, genres, avg_movie_rating, rating_count, imdb_id, tmdb_id
        FROM movies
        WHERE rating_count >= 10
        ORDER BY avg_movie_rating DESC, rating_count DESC
        LIMIT 10
    """)
    top_10_avg_rating = [
        {
            "movie_id": r["movie_id"],
            "title": r["title"],
            "year": r["year"],
            "genres": parse_genres_str(r["genres"]),
            "avg_movie_rating": round(float(r["avg_movie_rating"]), 2),
            "rating_count": float(r["rating_count"]),
            "imdb_id": r["imdb_id"],
            "tmdb_id": r["tmdb_id"]
        }
        for r in cursor.fetchall()
    ]

    conn.close()

    # Total users and ratings from MovieLens 32M Dataset
    total_users = 200948
    total_ratings = 32000204

    return {
        "total_movies": total_movies,
        "total_users": total_users,
        "total_ratings": total_ratings,
        "total_genres": total_genres,
        "total_models": total_models,
        "year_range": {"min_year": min_yr, "max_year": max_yr},
        "avg_rating_overall": round(float(avg_rating_overall), 2),
        "top_genres": top_genres,
        "top_10_rated": top_10_rated,
        "top_10_avg_rating": top_10_avg_rating
    }

def get_candidate_movies_for_recommendation(
    genre: Optional[str] = None,
    min_year: Optional[int] = None,
    max_year: Optional[int] = None,
    min_rating: Optional[float] = None,
    min_rating_count: Optional[float] = 5.0,
    limit: int = 500
) -> List[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()

    conditions = []
    params = []

    if genre:
        conditions.append("m.movie_id IN (SELECT movie_id FROM movie_genres WHERE genre_name = ?)")
        params.append(genre.strip())

    if min_year is not None:
        conditions.append("m.year >= ?")
        params.append(min_year)

    if max_year is not None:
        conditions.append("m.year <= ?")
        params.append(max_year)

    if min_rating is not None:
        conditions.append("m.avg_movie_rating >= ?")
        params.append(min_rating)

    if min_rating_count is not None:
        conditions.append("m.rating_count >= ?")
        params.append(min_rating_count)

    where_clause = f"WHERE {' AND '.join(conditions)}" if conditions else ""

    query_sql = f"""
        SELECT m.movie_id, m.title, m.year, m.genres, m.avg_movie_rating, m.rating_count, m.imdb_id, m.tmdb_id
        FROM movies m
        {where_clause}
        ORDER BY m.rating_count DESC, m.avg_movie_rating DESC
        LIMIT ?
    """
    cursor.execute(query_sql, params + [limit])
    rows = cursor.fetchall()
    conn.close()

    candidates = []
    for row in rows:
        candidates.append({
            "movie_id": row["movie_id"],
            "title": row["title"],
            "year": row["year"],
            "genres": parse_genres_str(row["genres"]),
            "avg_movie_rating": float(row["avg_movie_rating"]),
            "rating_count": float(row["rating_count"]),
            "imdb_id": row["imdb_id"],
            "tmdb_id": row["tmdb_id"]
        })
    return candidates
