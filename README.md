# 🎬 Film Öneri Sistemi (Movie Recommendation System)

[English](#english) | [Türkçe](#türkçe)

---

<a name="english"></a>
# English

This project is a machine learning-based movie recommendation system developed using the **MovieLens** dataset. It provides personalized movie recommendations by analyzing users' past rating habits and preferences.

---

## 📊 Dataset

The data used in this project is the **MovieLens 32M (December 2023)** version provided by [GroupLens Research](https://grouplens.org/datasets/movielens/).

**Dataset Link:** [https://grouplens.org/datasets/movielens/32m/](https://grouplens.org/datasets/movielens/32m/)

---

## 🚀 Project Features

-   **Data Mining:** Cleaning and optimizing large-scale data of more than 31 million entries.
-   **Machine Learning:** Up to 85% cross-validation success with the Decision Tree algorithm.
-   **Modern Web Interface:** Flask-based, user-friendly, and interactive frontend.
-   **Personalization:** Smart prediction engine based on year, genre, and rating trends.

## 📸 Screenshots

<img width="1253" height="1796" alt="image3" src="https://github.com/user-attachments/assets/7f076825-e181-40a7-b324-b8cf5d7be5de" />
<img width="1357" height="1981" alt="image4" src="https://github.com/user-attachments/assets/52e34363-9331-4d6a-9d2e-ab5e1ed783ba" />
<img width="1431" height="1147" alt="image2" src="https://github.com/user-attachments/assets/ad9f9143-94b4-4384-b51e-80e51360a481" />
<img width="1431" height="741" alt="image5" src="https://github.com/user-attachments/assets/14be9c59-2109-414e-8031-8dd8aa91eed3" />

---

## 🛠️ Installation and Running

### 1️⃣ Local Python Environment
```bash
# Install dependencies
pip install -r requirements.txt

# Start the web application
cd Site
python app.py
```

---

## 📁 Project Structure

-   `dartaClean.py`: Cleans large data and makes it RAM-friendly.
-   `dataMining.py`: Trains models and selects the best model (Decision Tree).
-   `Site/`: Source codes of the Flask web application.
-   `ModelResult/`: Trained model files and analysis charts.
-   `ProcessedData/`: Optimized datasets (excluded with git-ignore).
-   `RawData/`: Raw MovieLens files (excluded with git-ignore).

---

## 🔧 Technical Information

### Technologies Used
- **Backend**: Flask (Python web framework)
- **Frontend**: HTML5, CSS3, JavaScript
- **ML Model**: scikit-learn (Decision Tree)
- **Data**: MovieLens dataset
- **Web Server**: Gunicorn

### Algorithms Used
1. **ZeroR** - Baseline model
2. **OneR** - Best single rule
3. **KNN** - K-Nearest Neighbors
4. **Naive Bayes** - Probabilistic model
5. **Decision Tree** - Best model ⭐

### Features
- `avg_movie_rating` - Average rating of the movie
- `rating_count` - Number of ratings the movie received
- `avg_user_rating` - User's average rating
- `user_rating_count` - Number of ratings the user has given
- `year` - Movie production year
- `genre_*` - Movie genres (one-hot encoded)

## 📊 API Endpoints

### GET `/`
Home page (form)

### POST `/recommend`
Get movie recommendation
```json
{
  "avg_user_rating": 3.5,
  "user_rating_count": 50,
  "preferred_year": 2010,
  "selected_genres": ["2", "5"]
}
```

**Response:**
```json
{
  "success": true,
  "recommendations": [
    {
      "movieId": 1,
      "title": "Toy Story (1995)",
      "year": 1995,
      "genres": "2|3|4|5|9",
      "score": 0.8754
    }
  ]
}
```

### GET `/health`
API health check

---

## 🤝 Support

If you continue to have problems:
1. Share the terminal output
2. Note the error message
3. Specify your operating system and Docker version

---

**Enjoy! 🎉**

---

<a name="türkçe"></a>
# Türkçe

Bu proje, **MovieLens** veri seti kullanılarak geliştirilmiş, makine öğrenmesi tabanlı bir film öneri sistemidir. Kullanıcıların geçmiş puanlama alışkanlıklarını ve tercihlerini analiz ederek kişiselleştirilmiş film önerileri sunar.

---

## 📊 Veri Seti

Bu projede kullanılan veriler [GroupLens Research](https://grouplens.org/datasets/movielens/) tarafından sağlanan **MovieLens 32M (Aralık 2023)** sürümüdür.

**Veri Seti Linki:** [https://grouplens.org/datasets/movielens/32m/](https://grouplens.org/datasets/movielens/32m/)

---

## 🚀 Proje Özellikleri

-   **Veri Madenciliği:** 31 milyondan fazla büyük ölçekli verinin temizlenmesi ve optimize edilmesi.
-   **Makine Öğrenmesi:** Decision Tree (Karar Ağacı) algoritması ile %85'e varan çapraz doğrulama başarısı.
-   **Modern Web Arayüzü:** Flask tabanlı, kullanıcı dostu ve interaktif bir ön yüz.
-   **Kişiselleştirme:** Yıl, tür ve puanlama trendlerine dayalı akıllı tahmin motoru.

## 📸 Ekran Görüntüleri

(Ekran görüntüleri yukarıdaki İngilizce bölümünde mevcuttur.)

---

## 🛠️ Kurulum ve Çalıştırma

### 1️⃣ Yerel Python Ortamı
```bash
# Bağımlılıkları yükleyin
pip install -r requirements.txt

# Web uygulamasını başlatın
cd Site
python app.py
```

---

## 📁 Proje Yapısı

-   `dartaClean.py`: Büyük veriyi temizler ve RAM dostu hale getirir.
-   `dataMining.py`: Modelleri eğitir ve en iyi modeli (Decision Tree) seçer.
-   `Site/`: Flask web uygulamasının kaynak kodları.
-   `ModelResult/`: Eğitilmiş model dosyaları ve analiz grafikleri.
-   `ProcessedData/`: Optimize edilmiş veri setleri (git-ignore ile dışlanmıştır).
-   `RawData/`: Ham MovieLens dosyaları (git-ignore ile dışlanmıştır).

---

## 🔧 Teknik Bilgiler

### Kullanılan Teknolojiler
- **Backend**: Flask (Python web framework)
- **Frontend**: HTML5, CSS3, JavaScript
- **ML Model**: scikit-learn (Decision Tree)
- **Veri**: MovieLens dataset
- **Web Server**: Gunicorn

### Kullanılan Algoritmalar
1. **ZeroR** - Baseline modeli
2. **OneR** - En iyi tek kural
3. **KNN** - K En Yakın Komşu
4. **Naive Bayes** - Olasılıksal model
5. **Decision Tree** - En iyi model ⭐

### Özellikler (Features)
- `avg_movie_rating` - Filmin ortalama puanı
- `rating_count` - Filmin aldığı oy sayısı
- `avg_user_rating` - Kullanıcının ortalama puanı
- `user_rating_count` - Kullanıcının verdiği oy sayısı
- `year` - Film yapım yılı
- `genre_*` - Film türleri (one-hot encoded)

## 📊 API Endpoints

### GET `/`
Ana sayfa (form)

### POST `/recommend`
Film önerisi al
```json
{
  "avg_user_rating": 3.5,
  "user_rating_count": 50,
  "preferred_year": 2010,
  "selected_genres": ["2", "5"]
}
```

**Cevap:**
```json
{
  "success": true,
  "recommendations": [
    {
      "movieId": 1,
      "title": "Toy Story (1995)",
      "year": 1995,
      "genres": "2|3|4|5|9",
      "score": 0.8754
    }
  ]
}
```

### GET `/health`
API sağlık kontrolü

---

## 🤝 Destek

Sorun yaşamaya devam ediyorsanız:
1. Terminal çıktısını paylaş
2. Hata mesajını not et
3. Kullandığın işletim sistemi ve Docker sürümünü belirt

---

**Eğlenceyle kullan! 🎉**

