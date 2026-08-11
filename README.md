# 🎬 Yapay Zeka Destekli Film Öneri Sistemi (Movie Recommendation System)

[English](#english) | [Türkçe](#türkçe)

---

<a name="english"></a>
# English

This project is an advanced, end-to-end **Machine Learning-based Movie Recommendation System** built on the **MovieLens 32M** and **TMDb** datasets. It processes over 32 million ratings and 27,000+ movies using 7 distinct machine learning algorithms (Logistic Regression, Random Forest, Decision Tree, Gradient Boosting, XGBoost, LightGBM, CatBoost) to provide real-time, highly personalized movie recommendations.

The application features a high-performance **FastAPI** backend integrated with an **SQLite** database, and a modern, reactive **React (Vite)** frontend delivered seamlessly via **Docker** containers.

---

## 📊 Dataset & Citation

The system utilizes the **MovieLens 32M (December 2023)** dataset provided by [GroupLens Research](https://grouplens.org/datasets/movielens/) combined with **TMDb** metadata links.

- **Dataset Source:** [MovieLens 32M Dataset](https://grouplens.org/datasets/movielens/32m/)
- **Citation:** F. Maxwell Harper and Joseph A. Konstan. 2015. *The MovieLens Datasets: History and Context.* ACM Transactions on Interactive Intelligent Systems (TiiS) 5, 4: 19:1–19:19. <https://doi.org/10.1145/2827872>

---

## 🚀 Key Features

- **Big Data Processing & Mining:** Cleaned and indexed **32,000,204** ratings from **200,948** users across **27,585** movies into SQLite.
- **7 Machine Learning Models:** Trains and evaluates Logistic Regression, Decision Tree, Random Forest, Gradient Boosting, XGBoost, LightGBM, and CatBoost models using 5-Fold Cross Validation.
- **FastAPI REST API:** Full RESTful API with SQLite persistence, model serialization via `joblib`, and automated documentation.
- **Dockerized React Frontend:** Built with React & Vite, running entirely inside Docker containers without host node/npm dependencies.
- **Interactive Dual Range Sliders:** Custom range sliders for filtering publication years (1874–2024) and movie ratings (0.0–5.0).
- **Sample Movie Selector:** Select reference sample movies (*The Matrix*, *Interstellar*, *Toy Story*, etc.) or search custom movies to guide AI recommendations.
- **Free Poster Fetching:** Backend TMDb metadata proxy fetching high-resolution poster images without requiring API keys.
- **Detailed System Analytics:** Built-in statistics page showing total users, ratings, Top 10 most rated movies, Top 10 highest-rated movies, and complete data pipeline steps.

---

## 🛠️ Architecture & Technologies

- **Backend:** Python 3.13, FastAPI, Uvicorn, SQLite3, Scikit-Learn, XGBoost, LightGBM, CatBoost, Joblib
- **Frontend:** React 18, Vite, Lucide Icons, Vanilla CSS
- **Deployment & Containers:** Docker, Nginx, Batch Scripts (`.bat`)

---

## 🚀 Quick Start (Running the Application)

No local Node.js or npm installation is required on your host machine!

### 1️⃣ Run Backend (Local Python)
Double-click `run_backend.bat` or run:
```bash
# Installs dependencies & initializes SQLite database
python backend/init_db.py

# Launches FastAPI server at http://127.0.0.1:8000
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```
- Swagger API Documentation: `http://127.0.0.1:8000/docs`

### 2️⃣ Run Frontend (Docker Container)
Double-click `run_frontend.bat` or run:
```bash
cd frontend
docker build -t movie_frontend .
docker run -it --rm --name movie_frontend_container -p 3000:80 movie_frontend
```
- Open Web App: `http://localhost:3000`

### 3️⃣ Run All Services (Docker Compose)
Double-click `run_all.bat` or run:
```bash
docker compose up --build
```

---

## 📁 Project Structure

```
Filim-neriSistemi/
├── backend/                  # FastAPI Backend & SQLite Database
│   ├── database.py           # SQLite query helpers & data access
│   ├── database.sqlite       # Pre-built SQLite database file
│   ├── init_db.py            # DB initializer & CSV importer
│   ├── main.py               # FastAPI endpoints & CORS
│   ├── model_service.py      # Joblib ML model prediction engine
│   └── schemas.py            # Pydantic data schemas
├── dataMining/               # Data Science & Machine Learning Pipeline
│   ├── dataClean.py          # Data cleaning & regex parsing
│   ├── dataMining.py         # Trains 7 ML models & saves joblib bundles
│   └── dataAnyleze.py        # EDA analysis scripts
├── frontend/                 # React + Vite Web Portal
│   ├── src/                  # React components & UI logic
│   │   ├── components/       # UI Components (FilterBar, MovieCard, DetailsPage, RecommendationPage...)
│   │   ├── api.js            # Axios/Fetch API client & SVG fallback
│   │   └── App.jsx           # Main App router
│   ├── Dockerfile            # Multi-stage Docker build file
│   └── nginx.conf            # Nginx static server configuration
├── ModelResult/              # Saved ML models (.joblib) & comparison CSVs
├── run_backend.bat           # One-click script for Backend
├── run_frontend.bat          # One-click script for Docker Frontend
└── README.md                 # Project documentation
```

---

## 🤖 Trained Machine Learning Algorithms

| Algoritma | Accuracy | AUC Score | CV Mean | Eğitim Süresi |
|---|---|---|---|---|
| **Logistic Regression** | %85.0 | 0.902 | %84.95 | ~1.2s |
| **Random Forest** | %85.4 | 0.912 | %85.38 | ~14.5s |
| **Decision Tree** | %84.9 | 0.895 | %84.88 | ~1.8s |
| **Gradient Boosting** | %85.6 | 0.915 | %85.52 | ~18.2s |
| **XGBoost** | %85.8 | 0.918 | %85.70 | ~6.4s |
| **LightGBM** | %85.7 | 0.916 | %85.64 | ~3.1s |
| **CatBoost** | %85.9 | 0.920 | %85.81 | ~12.0s |

---


## 📸 Screenshots

<img width="1902" height="2681" alt="Screenshot 2026-08-10 at 19-17-45 Film Öneri Sistemi — Yapay Zeka Film Portalı" src="https://github.com/user-attachments/assets/e755418f-fb57-4edd-8330-1d6e5cc953ba" />

<img width="1902" height="2392" alt="Screenshot 2026-08-10 at 19-18-39 Film Öneri Sistemi — Yapay Zeka Film Portalı" src="https://github.com/user-attachments/assets/9d1673dd-f9f0-4744-a5fb-02f563b67806" />

<img width="1902" height="3394" alt="Screenshot 2026-08-10 at 19-18-53 Film Öneri Sistemi — Yapay Zeka Film Portalı" src="https://github.com/user-attachments/assets/082a079d-4250-4df7-8a07-451d7b22d64e" />

<img width="1902" height="994" alt="Screenshot 2026-08-10 at 19-18-59 Film Öneri Sistemi — Yapay Zeka Film Portalı" src="https://github.com/user-attachments/assets/5371efbe-e4dd-42cb-868f-be72752a4f7c" />

---

## 📡 Key REST API Endpoints

- `GET /api/movies` - List movies with pagination, search, genre, year range, and rating filters.
- `GET /api/movies/{id}` - Get detailed information for a specific movie.
- `GET /api/genres` - List available movie genres.
- `GET /api/models` - List trained ML models & performance metrics.
- `GET /api/stats` - Overall dataset statistics, Top 10 rated movies, Top 10 highest average rating movies.
- `POST /api/predict` - Real-time probability prediction for a specific movie using chosen ML model.
- `POST /api/recommend` - Generate top N recommended movies based on user criteria and ML model.
- `GET /api/poster/{tmdb_id}` - Proxy poster URL fetcher from TMDb meta tags (No API key needed).

---
---

<a name="türkçe"></a>
# Türkçe

Bu proje, **MovieLens 32M** ve **TMDb** veri kümeleri üzerinde geliştirilmiş, uçtan uca **Yapay Zeka Destekli Film Öneri Sistemi** projesidir. 32 milyondan fazla kullanıcı değerlendirmesini ve 27.000'den fazla filmi 7 farklı makine öğrenmesi algoritması (Logistic Regression, Random Forest, Decision Tree, Gradient Boosting, XGBoost, LightGBM, CatBoost) ile işleyerek gerçek zamanlı kişiselleştirilmiş film tavsiyeleri sunar.

Uygulama, **FastAPI** ve **SQLite** veritabanı altyapısıyla desteklenen bir backend sunucusu ile **React (Vite)** ve **Docker** tabanlı modern bir web portalından oluşmaktadır.

---

## 📊 Veri Seti ve Atıf

Projelerdeki veriler [GroupLens Research](https://grouplens.org/datasets/movielens/) tarafından yayınlanan **MovieLens 32M (Aralık 2023)** veri seti ve **TMDb** bağlantıları ile oluşturulmuştur.

- **Veri Seti Bağlantısı:** [MovieLens 32M Dataset](https://grouplens.org/datasets/movielens/32m/)
- **Atıf:** F. Maxwell Harper ve Joseph A. Konstan. 2015. *The MovieLens Datasets: History and Context.* ACM Transactions on Interactive Intelligent Systems (TiiS) 5, 4: 19:1–19:19. <https://doi.org/10.1145/2827872>

---

## 🚀 Proje Öne Çıkan Özellikleri

- **Büyük Veri İşleme & Madenciliği:** **200.948** kullanıcıya ait **32.000.204** oy verisi ve **27.629** film SQLite veritabanına indekslenmiştir.
- **7 Eğitilmiş ML Modeli:** Logistic Regression, Decision Tree, Random Forest, Gradient Boosting, XGBoost, LightGBM ve CatBoost modelleri 5-Katlı Çapraz Doğrulama ile eğitilip saklanmıştır.
- **FastAPI REST API:** SQLite desteği, `joblib` model serileştirmesi ve otomatik Swagger dokümantasyonu.
- **Dockerized React Ön Yüzü:** Bilgisayarınıza Node.js/npm kurmanıza gerek kalmadan Docker konteynerleri üzerinde Nginx ile çalışan duyarlı web arayüzü.
- **Çift Yönlü Slider Filtreleri:** Yapım yılı (1874–2024) ve film puanı (0.0–5.0) için min/max çift kutulu ve sürüklemeli slider kontrolü.
- **Örnek Film Seç / Ekle:** Örnek referans filmler (*The Matrix*, *Interstellar*, *Toy Story* vb.) seçerek veya arşivde aratarak kişiselleştirilmiş film önerileri üretme.
- **Ücretsiz Afiş Çekme:** API key gerektirmeyen, TMDb meta etiketlerinden otomatik poster URL'si proxy'leme ve renkli SVG fallback.
- **Sistem İstatistikleri & Detay Sayfası:** Toplam kullanıcı, film, oy istatistikleri, En Çok Puanlanan Top 10 Film, En Yüksek Ortalama Puana Sahip Top 10 Film ve 6 adımlı Veri Madenciliği Süreci (Data Mining Pipeline) raporu.

---

## 🛠️ Kurulum ve Çalıştırma

Bilgisayarınıza Node.js veya npm yüklemenize gerek yoktur!

### 1️⃣ Backend Çalıştırma (Yerel Python)
[run_backend.bat](file:///c:/Project/Other/Filim-neriSistemi/run_backend.bat) dosyasına tıklayın veya terminalde çalıştırın:
```bash
# Veritabanını kontrol eder/hazırlar
python backend/init_db.py

# FastAPI sunucusunu http://127.0.0.1:8000 adresinde başlatır
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```
- Swagger API Dokümantasyonu: `http://127.0.0.1:8000/docs`

### 2️⃣ Frontend Çalıştırma (Docker Container)
[run_frontend.bat](file:///c:/Project/Other/Filim-neriSistemi/run_frontend.bat) dosyasına tıklayın veya terminalde çalıştırın:
```bash
cd frontend
docker build -t movie_frontend .
docker run -it --rm --name movie_frontend_container -p 3000:80 movie_frontend
```
- Web Portalı: `http://localhost:3000`

### 3️⃣ Tüm Sistemi Çalıştırma (Docker Compose)
[run_all.bat](file:///c:/Project/Other/Filim-neriSistemi/run_all.bat) dosyasına çift tıklayarak Docker Compose ile tüm sistemi başlatabilirsiniz:
```bash
docker compose up --build
```

---

## 📁 Proje Dizin Yapısı

```
Filim-neriSistemi/
├── backend/                  # FastAPI Backend & SQLite Veritabanı
│   ├── database.py           # SQLite sorgu yardımcıları
│   ├── database.sqlite       # Önceden hazırlanmış SQLite veritabanı
│   ├── init_db.py            # Veritabanı ilklendirici & CSV aktarıcı
│   ├── main.py               # FastAPI endpoint'leri & CORS
│   ├── model_service.py      # Joblib ML tahmin motoru
│   └── schemas.py            # Pydantic veri şemaları
├── dataMining/               # Veri Bilimi & Yapay Zeka Hattı
│   ├── dataClean.py          # Veri temizleme & Regex ayrıştırma
│   ├── dataMining.py         # 7 ML modelini eğitir ve joblib olarak kaydeder
│   └── dataAnyleze.py        # EDA analiz scriptleri
├── frontend/                 # React + Vite Web Portalı
│   ├── src/                  # React bileşenleri & arayüz mantığı
│   │   ├── components/       # Arayüz Bileşenleri (FilterBar, MovieCard, DetailsPage, RecommendationPage...)
│   │   ├── api.js            # Fetch API istemcisi & SVG fallback
│   │   └── App.jsx           # Ana uygulama yönlendiricisi
│   ├── Dockerfile            # Docker derleme dosyası
│   └── nginx.conf            # Nginx statik sunucu yapılandırması
├── ModelResult/              # Eğitilen ML modelleri (.joblib) & sonuç CSV'leri
├── run_backend.bat           # Backend başlatma betiği
├── run_frontend.bat           # Docker Frontend başlatma betiği
└── README.md                 # Proje dokümantasyonu
```

---

## 🤖 Eğitilmiş Makine Öğrenmesi Algoritmaları

| Algoritma | Doğruluk (Accuracy) | AUC Skoru | CV Ortalaması | Eğitim Süresi |
|---|---|---|---|---|
| **Logistic Regression** | %85.0 | 0.902 | %84.95 | ~1.2 sn |
| **Random Forest** | %85.4 | 0.912 | %85.38 | ~14.5 sn |
| **Decision Tree** | %84.9 | 0.895 | %84.88 | ~1.8 sn |
| **Gradient Boosting** | %85.6 | 0.915 | %85.52 | ~18.2 sn |
| **XGBoost** | %85.8 | 0.918 | %85.70 | ~6.4 sn |
| **LightGBM** | %85.7 | 0.916 | %85.64 | ~3.1 sn |
| **CatBoost** | %85.9 | 0.920 | %85.81 | ~12.0 sn |

---

## 📸 Ekran Görüntüleri

<img width="1902" height="2681" alt="Screenshot 2026-08-10 at 19-17-45 Film Öneri Sistemi — Yapay Zeka Film Portalı" src="https://github.com/user-attachments/assets/e755418f-fb57-4edd-8330-1d6e5cc953ba" />

<img width="1902" height="2392" alt="Screenshot 2026-08-10 at 19-18-39 Film Öneri Sistemi — Yapay Zeka Film Portalı" src="https://github.com/user-attachments/assets/9d1673dd-f9f0-4744-a5fb-02f563b67806" />

<img width="1902" height="3394" alt="Screenshot 2026-08-10 at 19-18-53 Film Öneri Sistemi — Yapay Zeka Film Portalı" src="https://github.com/user-attachments/assets/082a079d-4250-4df7-8a07-451d7b22d64e" />

<img width="1902" height="994" alt="Screenshot 2026-08-10 at 19-18-59 Film Öneri Sistemi — Yapay Zeka Film Portalı" src="https://github.com/user-attachments/assets/5371efbe-e4dd-42cb-868f-be72752a4f7c" />

---

## 📡 Önemli REST API Uç Noktaları (Endpoints)

- `GET /api/movies` – Sayfalama, arama, tür, yapım yılı aralığı ve puan filtresiyle filmleri listeler.
- `GET /api/movies/{id}` – Belirli bir filme ait detaylı bilgileri getirir.
- `GET /api/genres` – Mevcut film türlerini listeler.
- `GET /api/models` – Eğitilmiş makine öğrenmesi modellerini ve başarım metriklerini listeler.
- `GET /api/stats` – Veri setine ait genel istatistikleri, En Çok Oy Alan İlk 10 Filmi ve En Yüksek Ortalama Puana Sahip İlk 10 Filmi döndürür.
- `POST /api/predict` – Seçilen ML modelini kullanarak belirli bir film için gerçek zamanlı olasılık tahmini yapar.
- `POST /api/recommend` – Kullanıcı kriterlerine ve seçilen ML modeline göre ilk N önerilen filmi oluşturur.
- `GET /api/poster/{tmdb_id}` – TMDb meta etiketlerinden poster URL’sini getiren proxy uç noktasıdır (API anahtarı gerekmez).
