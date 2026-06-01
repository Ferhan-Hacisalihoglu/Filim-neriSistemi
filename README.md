# 🎬 Film Öneri Sistemi (Movie Recommendation System)

Bu proje, **MovieLens** veri seti kullanılarak geliştirilmiş, makine öğrenmesi tabanlı bir film öneri sistemidir. Kullanıcıların geçmiş puanlama alışkanlıklarını ve tercihlerini analiz ederek kişiselleştirilmiş film önerileri sunar.

---

## 📊 Veri Seti ve Atıf

Bu projede kullanılan veriler [GroupLens Research](https://grouplens.org/datasets/movielens/) tarafından sağlanan **MovieLens 32M (Aralık 2023)** sürümüdür.

**Veri Seti Linki:** [https://grouplens.org/datasets/movielens/32m/](https://grouplens.org/datasets/movielens/32m/)

### Atıf (Citation)
> F. Maxwell Harper and Joseph A. Konstan. 2015. The MovieLens Datasets: History and Context. ACM Transactions on Interactive Intelligent Systems (TiiS) 5, 4: 19. [https://doi.org/10.1145/2827872](https://doi.org/10.1145/2827872)

---

## 🚀 Proje Özellikleri

-   **Veri Madenciliği:** 31 milyondan fazla büyük ölçekli verinin temizlenmesi ve optimize edilmesi.
-   **Makine Öğrenmesi:** Decision Tree (Karar Ağacı) algoritması ile %85'e varan çapraz doğrulama başarısı.
-   **Modern Web Arayüzü:** Flask tabanlı, kullanıcı dostu ve interaktif bir ön yüz.
-   **Kişiselleştirme:** Yıl, tür ve puanlama trendlerine dayalı akıllı tahmin motoru.

## 🛠️ Kurulum ve Çalıştırma

### 1️⃣ Docker (Önerilen)
```bash
docker compose up --build
```
-   Tarayıcıda açın: `http://localhost:5000`

### 2️⃣ Yerel Python Ortamı
```bash
# Bağımlılıkları yükleyin
pip install -r requirements.txt

# Web uygulamasını başlatın
cd Site
python app.py
```

---

## 📁 Proye Yapısı

-   `dartaClean.py`: Büyük veriyi temizler ve RAM dostu hale getirir.
-   `dataMining.py`: Modelleri eğitir ve en iyi modeli (Decision Tree) seçer.
-   `Site/`: Flask web uygulamasının kaynak kodları.
-   `ModelResult/`: Eğitilmiş model dosyaları ve analiz grafikleri.
-   `ProcessedData/`: Optimize edilmiş veri setleri (git-ignore ile dışlanmıştır).
-   `RawData/`: Ham MovieLens dosyaları (git-ignore ile dışlanmıştır).

---


---

## 🔧 Teknik Bilgiler

### Kullanılan Teknolojiler
- **Backend**: Flask (Python web framework)
- **Frontend**: HTML5, CSS3, JavaScript
- **ML Model**: scikit-learn (Decision Tree)
- **Veri**: MovieLens dataset
- **Container**: Docker + Docker Compose
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

---

## 🐳 Docker Komutları

```bash
# Image'ı oluştur
docker build -t film-recommender:latest .

# Container'ı çalıştır
docker run -p 5000:5000 film-recommender:latest

# Docker Compose ile (Önerilen)
docker compose up

# Container'ları listele
docker ps

# Container'ı kapat
docker stop film-recommender-app

# Container'ı sil
docker rm film-recommender-app

# Logs'u gör
docker logs film-recommender-app -f
```

---

## 🆘 Sorun Giderme

### ❌ "Docker yüklü değil" hatası
**Çözüm**: Docker Desktop'ı https://www.docker.com/products/docker-desktop adresinden indirin ve yükleyin.

### ❌ "Port 5000 kullanımda" hatası
**Çözüm**: 
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

### ❌ "Model bulunamadı" hatası
**Çözüm**: Önce `dataMining.py` ile modeli eğitin:
```bash
python dataMining.py
```

### ❌ Site açılmıyor
**Çözüm**: Terminal'de hata mesajını kontrol edin:
- Docker logs'u kontrol et: `docker logs film-recommender-app`
- Python çalıştırıyor mısın: `python Site/app.py`'de hata mesajı bak

### ❌ Çok yavaş çalışıyor
**Çözüm**: 
- Docker'ın kaynakları arttır (Docker Desktop ayarları)
- Python'da doğrudan çalıştırmayı dene

---

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

## 📝 Lisans & Bilgiler

**Veri**: MovieLens 1M Dataset  
**Proje**: Veri Madenciliği Dersi - 2026  
**ML Model**: scikit-learn  

---

## 💡 İpuçları

✨ En iyi sonuç için:
- Gerçekçi oy ortalaması gir
- Eğer 10+ film değerlendirdiysen daha iyi sonuç alırsın
- Tercih ettiğin türleri seç (çünkü sınırlaması yok!)

🎯 Deneme:
- İlk kez: Varsayılan ayarlarla deneylendir
- Sonra: Kendi tercihlerine göre özelleştir
- Farklı parametreler dene: Hangi kombinasyon en iyisini buldu?

---

## 🤝 Destek

Sorun yaşamaya devam ediyorsanız:
1. Terminal çıktısını paylaş
2. Hata mesajını not et
3. Kullandığın işletim sistemi ve Docker sürümünü belirt

---

**Eğlenceyle kullan! 🎉**
