# Film Öneri Sistemi — FastAPI Backend

Bu proje, eğitilmiş Makine Öğrenmesi (ML) modelleri ile SQLite veritabanını birleştirerek film arama, detay görüntüleme, filtreleme ve kişiselleştirilmiş film öneri hizmeti sunan FastAPI tabanlı bir backend servisidir.

## Özellikler

1. **SQLite Veritabanı Entegrasyonu**:
   - Backend tüm film, tür, istatistik ve model metadatalarını **yalnızca SQLite** (`backend/database.sqlite`) üzerinden sorgular.
   - `python backend/init_db.py` komutuyla veritabanı sıfırdan oluşturulur ve otomatik doldurulur.

2. **Çoklu Model Desteği ile Film Önerisi**:
   - Makine öğrenmesi algoritmaları (Logistic Regression, Random Forest, Decision Tree, Gradient Boosting, KNN, Naive Bayes, OneR, ZeroR) arasından **model seçimi** yapılarak öneri üretilebilir.

3. **Frontend İçin GET & Filtreleme Endpoints**:
   - `GET /api/movies`: Başlık, tür, yapım yılı aralığı, ortalama puan, minimum oy sayısı gibi gelişmiş filtrelerle film listeleme ve sayfalandırma.
   - `GET /api/movies/{movie_id}`: Film detay bilgisi.
   - `GET /api/genres`: Tüm film türlerinin listesi.
   - `GET /api/models`: Tüm eğitilmiş makine öğrenmesi modelleri ve başarı metrikleri (Accuracy, AUC, CV skoru vb.).
   - `GET /api/stats`: Genel veriseti ve veritabanı özet istatistikleri.
   - `POST /api/predict`: Belirli bir film veya özel girdi için seçilen ML modeli ile beğeni olasılığı tahmini.
   - `POST /api/recommend` & `GET /api/recommend`: Kullanıcı tercihlerine (tür, yıl aralığı, puan filtresi vb.) ve seçilen ML modeline göre kişiselleştirilmiş top N film önerisi.

---

## Kurulum ve Çalıştırma

### 1. Bağımlılıkları Yükleyin
```bash
pip install -r backend/requirements.txt
```

### 2. SQLite Veritabanını Oluşturun
```bash
python backend/init_db.py
```

### 3. Backend Sunucusunu Başlatın
```bash
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

veya varsayılan python ile:
```bash
python backend/main.py
```

---

## API Dokümantasyonu (Interactive Docs)

Sunucu çalıştıktan sonra tarayıcıdan aşağıdaki adreslere erişerek Swagger UI üzerinden tüm endpoint'leri test edebilirsiniz:

- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## Endpoint Listesi ve Örnek Kullanımlar

### 1. Filmleri Filtreleme ve Listeleme (`GET /api/movies`)
**Parametreler**:
- `title` (string, opsiyonel): Film adında arama
- `genre` (string, opsiyonel): Tür filtresi (ör: `Action`, `Comedy`, `Sci-Fi`)
- `year_min` & `year_max` (integer, opsiyonel): Yapım yılı aralığı
- `rating_min` & `rating_max` (float, opsiyonel): Ortalama puan aralığı
- `min_rating_count` (float, opsiyonel): Minimum oy sayısı
- `sort_by` (string): Sıralama kriteri (`avg_movie_rating`, `rating_count`, `year`, `title`)
- `order` (string): `desc` veya `asc`
- `page` (integer): Sayfa numarası (varsayılan: 1)
- `page_size` (integer): Sayfa başına eleman (varsayılan: 20)

### 2. Eğitilmiş Modelleri Listeleme (`GET /api/models`)
Tüm eğitilmiş modellerin (Logistic Regression, Random Forest, Decision Tree vb.) Accuracy, ROC-AUC, CV ortalaması ve eğitim sürelerini döner.

### 3. Model Seçimi ile Film Önerisi Alma (`POST /api/recommend` veya `GET /api/recommend`)
**Örnek GET İsteği**:
```http
GET /api/recommend?model_name=Logistic%20Regression&genre=Action&min_year=2000&top_n=5
```

**Örnek POST İsteği Body**:
```json
{
  "model_name": "Random Forest",
  "genre": "Sci-Fi",
  "min_year": 1990,
  "min_rating": 3.5,
  "min_rating_count": 20,
  "user_avg_rating": 4.0,
  "top_n": 10
}
```
