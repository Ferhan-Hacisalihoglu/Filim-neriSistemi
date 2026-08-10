from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class MovieResponse(BaseModel):
    movie_id: int
    title: str
    year: Optional[int] = None
    genres: List[str] = []
    avg_movie_rating: float = 0.0
    rating_count: float = 0.0
    imdb_id: Optional[str] = None
    tmdb_id: Optional[int] = None

class MovieListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    total_pages: int
    movies: List[MovieResponse]

class GenreResponse(BaseModel):
    id: int
    name: str

class ModelMetadataResponse(BaseModel):
    id: int
    name: str
    accuracy: float
    auc: Optional[float] = None
    cv_mean: float
    cv_std: float
    time_sec: float
    is_best: bool = False

class YearRange(BaseModel):
    min_year: Optional[int] = None
    max_year: Optional[int] = None

class StatsResponse(BaseModel):
    total_movies: int
    total_users: int = 200948
    total_ratings: int = 32000204
    total_genres: int
    total_models: int
    year_range: YearRange
    avg_rating_overall: float
    top_genres: List[Dict[str, Any]] = []
    top_10_rated: List[Dict[str, Any]] = []
    top_10_avg_rating: List[Dict[str, Any]] = []

class PredictionRequest(BaseModel):
    movie_id: Optional[int] = None
    model_name: str = Field(default="Logistic Regression", description="Eğitilmiş model adı")
    user_avg_rating: float = Field(default=3.5, ge=0.5, le=5.0, description="Kullanıcının ortalama puanı")
    user_rating_count: float = Field(default=20.0, ge=0.0, description="Kullanıcının toplam oy sayısı")
    custom_year: Optional[int] = Field(default=None, description="Özel film yılı")
    custom_genres: Optional[List[str]] = Field(default=None, description="Özel film türleri")
    custom_avg_movie_rating: Optional[float] = Field(default=None, ge=0.0, le=5.0, description="Özel film ortalama puanı")
    custom_rating_count: Optional[float] = Field(default=None, ge=0.0, description="Özel film oy sayısı")

class PredictionResponse(BaseModel):
    model_name: str
    liked_prediction: int
    liked_label: str
    probability: Optional[float] = None
    confidence_score: float
    movie_info: Optional[Dict[str, Any]] = None

class RecommendationRequest(BaseModel):
    model_name: str = Field(default="Logistic Regression", description="Model seçimi")
    user_avg_rating: float = Field(default=3.5, ge=0.5, le=5.0)
    user_rating_count: float = Field(default=20.0, ge=0.0)
    genre: Optional[str] = None
    min_year: Optional[int] = None
    max_year: Optional[int] = None
    min_rating: Optional[float] = None
    min_rating_count: Optional[float] = 10.0
    top_n: int = Field(default=12, ge=1, le=100)

class RecommendationItem(BaseModel):
    movie_id: int
    title: str
    year: Optional[int] = None
    genres: List[str] = []
    avg_movie_rating: float
    rating_count: float
    recommendation_score: float
    prediction: int
    imdb_id: Optional[str] = None
    tmdb_id: Optional[int] = None

class RecommendationResponse(BaseModel):
    model_name: str
    total_candidates_analyzed: int
    recommendations: List[RecommendationItem]
