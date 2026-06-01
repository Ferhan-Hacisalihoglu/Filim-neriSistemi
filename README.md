# 🎬 Film Öneri Sistemi (Movie Recommendation System)

[English](#english) | [Türkçe](#türkçe)

---

<a name="english"></a>
# English

This project is a machine learning-based movie recommendation system developed using the **MovieLens** dataset. It provides personalized movie recommendations by analyzing users' past rating habits, preferred genres, and movie release years. Through a sophisticated data pipeline, it processes millions of ratings to build a robust prediction engine that suggests movies you're most likely to enjoy.

The system isn't just a simple filter; it's an end-to-end data science project that covers data cleaning, feature engineering, model selection, and deployment via a web interface. By leveraging the Decision Tree algorithm, we achieve high accuracy in predicting user preferences based on historical data patterns.

---

## 📊 Dataset And Citation

The data used in this project is the **MovieLens 32M (December 2023)** version provided by [GroupLens Research](https://grouplens.org/datasets/movielens/).

**Dataset Link:** [https://grouplens.org/datasets/movielens/32m/](https://grouplens.org/datasets/movielens/32m/)

F. Maxwell Harper ve Joseph A. Konstan. 2015. The MovieLens Datasets: History and Context. ACM Transactions on Interactive Intelligent Systems (TiiS) 5, 4: 19:1–19:19. <https://doi.org/10.1145/2827872>

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
python Site/app.py
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

<img width="1235" height="614" alt="ZeroR" src="https://github.com/user-attachments/assets/d663f422-50fa-41e7-bec6-166b808c4e73" />

*Baseline model that always predicts the majority class. With **63.47% accuracy**, it serves as the minimum performance benchmark for all other models.*

2. **OneR** - Best single rule

<img width="1207" height="614" alt="OneR" src="https://github.com/user-attachments/assets/c20569b6-531a-41bc-aad5-e904e6671756" />

*A simple rule-based model that selects the single most influential feature. It surprisingly achieves **82.0% CV success**, showing a strong correlation between core features and user preferences.*

3. **KNN** - K-Nearest Neighbors

<img width="1235" height="614" alt="KNN_k=11" src="https://github.com/user-attachments/assets/3f290192-47c2-4738-b859-9f347ce53d57" />

*Classifies movies based on feature similarity. While attaining a solid **82.7% CV success**, its high computational cost (52s training time) makes it less ideal for real-time recommendations compared to other models.*

4. **Naive Bayes** - Probabilistic model

<img width="1235" height="614" alt="Naive_Bayes" src="https://github.com/user-attachments/assets/94e78dd1-3d3d-48a9-aa02-40f706f7ae59" />

*A fast probabilistic model with **77.25% CV success**. It offers great speed (0.2s) but slightly lower accuracy as it assumes feature independence, which may not hold perfectly in complex movie data.*

5. **Decision Tree** - Best model ⭐

<img width="1235" height="614" alt="Decision_Tree" src="https://github.com/user-attachments/assets/ab546968-96e7-415f-b4a5-dc61e5572667" />

*Our top performer with **84.96% cross-validation success**. It provides the best balance of high accuracy and rapid execution (1.2s), effectively capturing complex decision boundaries in the dataset.*


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

## 🤝 Contributing

We welcome contributions to make this recommendation system even better! Whether you're a data scientist, a developer, or a movie enthusiast, your input is valuable.

### How to Help?
1.  **Issues:** If you find a bug or have a feature request, please open an [Issue](https://github.com/your-username/your-repo/issues).
2.  **Pull Requests:** Feel free to fork the repository and submit a pull request for improvements in the ML model, UI/UX, or documentation.
3.  **Feedback:** Share your thoughts on how the recommendation logic can be improved.

Let's build the best movie recommendation engine together! 🚀

---

**Enjoy! 🎉**

---

<a name="türkçe"></a>
# Türkçe

Bu proje, **MovieLens** veri seti kullanılarak geliştirilmiş, makine öğrenmesi tabanlı bir film öneri sistemidir. Kullanıcıların geçmiş puanlama alışkanlıklarını, tercih ettikleri türleri ve film yıllarını analiz ederek kişiselleştirilmiş film önerileri sunar. Gelişmiş veri işleme aşamalarından geçerek milyonlarca puanlamayı analiz eden bu sistem, sizin en çok beğenebileceğiniz filmleri tahmin etmek için güçlü bir motor kullanır.

Bu çalışma sadece basit bir filtreleme sistemi değil; veri temizleme, özellik mühendisliği (feature engineering), model seçimi ve web arayüzü ile yayına alma aşamalarını kapsayan uçtan uca bir veri bilimi projesidir. Karar Ağacı (Decision Tree) algoritması sayesinde, geçmiş veri kalıplarına dayanarak kullanıcı tercihlerini yüksek doğrulukla tahmin edebilmekteyiz.

---

## 📊 Veri Seti ve Atıf

Bu projede kullanılan veriler [GroupLens Research](https://grouplens.org/datasets/movielens/) tarafından sağlanan **MovieLens 32M (Aralık 2023)** sürümüdür.

**Veri Seti Linki:** [https://grouplens.org/datasets/movielens/32m/](https://grouplens.org/datasets/movielens/32m/)

F. Maxwell Harper ve Joseph A. Konstan. 2015. The MovieLens Datasets: History and Context. ACM Transactions on Interactive Intelligent Systems (TiiS) 5, 4: 19:1–19:19. <https://doi.org/10.1145/2827872>

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
python Site/app.py
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

<img width="1235" height="614" alt="ZeroR" src="https://github.com/user-attachments/assets/d663f422-50fa-41e7-bec6-166b808c4e73" />

*En yaygın sınıfı tahmin eden temel seviye algoritma. **%63.47 doğruluk** oranıyla, diğer modellerin başarısını ölçmek için minimum referans noktasıdır.*

2. **OneR** - En iyi tek kural

<img width="1207" height="614" alt="OneR" src="https://github.com/user-attachments/assets/c20569b6-531a-41bc-aad5-e904e6671756" />

*Tek bir baskın özelliğe göre karar veren basit bir modeldir. Şaşırtıcı bir şekilde **%82.0 çapraz doğrulama (CV) başarısına** ulaşarak temel özelliklerin güçlü etkisini kanıtlar.*

3. **KNN** - K En Yakın Komşu

<img width="1235" height="614" alt="KNN_k=11" src="https://github.com/user-attachments/assets/3f290192-47c2-4738-b859-9f347ce53d57" />

*Matematiksel benzerliğe göre sınıflandırma yapar. **%82.7 CV başarısı** sağlasa da, yüksek hesaplama maliyeti (52 sn eğitim süresi) gerçek zamanlı öneriler için onu daha az verimli kılar.*

4. **Naive Bayes** - Olasılıksal model

<img width="1235" height="614" alt="Naive_Bayes" src="https://github.com/user-attachments/assets/94e78dd1-3d3d-48a9-aa02-40f706f7ae59" />

*Oldukça hızlı (0.2 sn) çalışarak **%77.25 CV başarısı** sunar. Özellikler arası bağımsızlık varsayımı nedeniyle karmaşık veri setlerinde isabet oranı diğerlerinin biraz gerisinde kalmıştır.*

5. **Decision Tree** - En iyi model ⭐

<img width="1235" height="614" alt="Decision_Tree" src="https://github.com/user-attachments/assets/ab546968-96e7-415f-b4a5-dc61e5572667" />

*En yüksek performansı gösteren modelimizdir. **%84.96 çapraz doğrulama başarısı** ve hızı (1.2 sn) ile isabet oranı ve verimlilik arasındaki en iyi dengeyi sağlar.*


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

## 🤝 Katkıda Bulunma

Bu öneri sistemini daha iyi hale getirmek için katkılarınızı bekliyoruz! Veri bilimci, yazılımcı veya bir film tutkunu olun, her türlü desteğiniz bizim için değerlidir.

### Nasıl Destek Olabilirsiniz?
1.  **Hata Bildirimi (Issues):** Bir hata bulursanız veya yeni bir özellik öneriniz varsa lütfen [Issue](https://github.com/your-username/your-repo/issues) kısmından bildirin.
2.  **Geliştirme (Pull Requests):** Depoyu (repository) çatallayarak (fork) ML modeli, arayüz veya dokümantasyon üzerinde yaptığınız geliştirmeleri bir çekme isteği (PR) ile bize ulaştırabilirsiniz.
3.  **Geri Bildirim:** Öneri mantığının nasıl daha başarılı olabileceği konusundaki fikirlerinizi paylaşın.

Gelin, en iyi film öneri motorunu birlikte inşa edelim! 🚀

---

**Eğlenceyle kullan! 🎉**

---
