# 🎬 Film Öneri Sistemi Proje Raporu

## 1. Giriş
Bu rapor, "Veri Madenciliği" dersi kapsamında geliştirilen, kullanıcıların geçmiş puanlama eğilimlerini ve güncel tercihlerini analiz ederek kişiselleştirilmiş film önerileri sunan bir makine öğrenmesi projesini kapsamaktadır. Proje, hem veri temizleme ve modelleme gibi arka plan süreçlerini hem de son kullanıcının etkileşime geçebileceği bir web arayüzünü içermektedir.

### 1.1 Projenin Amacı
Projenin temel amacı, devasa boyutlardaki film veri setlerinden anlamlı çıkarımlar yaparak kullanıcının bir filmi beğenip beğenmeyeceğini yüksek doğrulukla tahmin etmektir. Günümüzde içerik yığınları arasında doğru tercihi yapmak zorlaştığından, bu sistem kullanıcıyı tanıyan ve ona rehberlik eden bir dijital asistan görevi görmektedir.

### 1.2 Problemin Tanımı ve Çözümü
Veri seti 31 milyondan fazla kayıt içermektedir. Bu kadar büyük bir veriyi gerçek zamanlı olarak işleyip öneri üretmek "performans" ve "isabet" açısından iki temel problem oluşturur. Projede bu problemler, verinin önceden optimize edilmesi (preprocessing) ve hibrit bir özellik mühendisliği (feature engineering) yaklaşımıyla çözülmüştür.

---

## 2. Veri Seti Tanıtımı
Veri seti olarak GroupLens Research tarafından sağlanan **MovieLens 25M/30M** veri serisi kullanılmıştır.

### 2.1 Veri Yapısı ve Analizi
Veri seti dört ana dosyadan oluşmaktadır:
*   **movies.csv:** Film kimlikleri, başlıklar ve '|' ayıracı ile ayrılmış tür bilgileri.
*   **ratings.csv:** Kullanıcıların filmlere verdiği 0.5-5.0 arası puanlar ve zaman damgaları.
*   **tags.csv:** Kullanıcılar tarafından filmlere eklenen anahtar kelimeler.
*   **links.csv:** IMDb ve TMDB veri tabanlarına bağlantı ID'leri.

### 2.2 Temel İstatistiksel Görünüm
Yürütülen analizler sonucunda elde edilen genel istatistikler şu şekildedir:
| Bilgi Tipi | Değer |
| :--- | :--- |
| **Toplam Puanlama Sayısı** | 31,498,689 |
| **Benzersiz Kullanıcı Sayısı** | 200,947 |
| **Benzersiz Film Sayısı** | 62,000+ (Ham) / 13,294 (Modelde kullanılan) |
| **Puanlama Ölçeği** | 0.5 - 5.0 (0.5 artışlarla) |
| **Ortalama Puan** | ~3.53 |

---

## 3. Veri Ön İşleme ve Örnek Veri Optimizasyonu
Büyük veriyi işlenebilir kılmak için `dartaClean.py` scripti üzerinden şu adımlar uygulanmıştır:

1.  **Veri Temizliği:** Eksik veriler (`NaN`) ve mükerrer kayıtlar tamamen ayıklanmıştır.
2.  **Özellik Mühendisliği (Feature Engineering):** 
    *   Film başlıklarından regex kullanılarak **yapım yılı** (`year`) sütunu oluşturulmuştur.
    *   Film türleri (Action, Comedy vb.) modelin işleyebilmesi için **sayısal ID**'lere (`genre_ids`) dönüştürülmüştür.
3.  **Optimizasyon:** Veri setinin ham boyutu RAM limitlerini aşabileceğinden, `dtype` optimizasyonu (ör: `int64` yerine `int32`, `float64` yerine `float32`) yapılmıştır.
4.  **Sınıflandırma Dönüşümü:** Regresyon modelini daha kararlı bir sınıflandırma modeline çekmek için:
    *   3.5 ve üzeri puanlar → **Liked (1)**
    *   3.5 altındaki puanlar → **Not Liked (0)**
    olarak etiketlenmiştir.

---

## 4. Kullanılan Algoritma ve Öneri Modeli
Projede 5 farklı algoritma eğitilmiş ve performansları kıyaslanmıştır:

### 4.1 Modellerin Performans Analizi
Elde edilen deneysel sonuçlar:
| Algoritma | Test Doğruluğu (%) | Çapraz Doğrulama (CV) | Eğitim Süresi |
| :--- | :---: | :---: | :---: |
| **ZeroR (Baseline)** | %63.47 | %63.47 | 0.008 sn |
| **OneR** | %63.88 | %82.00 | 0.586 sn |
| **KNN (k=11)** | %66.10 | %82.70 | 51.993 sn |
| **Naive Bayes** | %67.02 | %77.25 | 0.211 sn |
| **Decision Tree** | **%67.74** | **%84.96** | 1.191 sn |

### 4.2 Neden Decision Tree (Karar Ağacı)?
En iyi performansı gösteren **Decision Tree** modeli tercih edilmiştir. Bu algoritma:
*   Kullanıcının tercih kriterleri (yıl ve tür gibi) arasındaki hiyerarşik ilişkileri çok iyi yakalayabilmektedir.
*   Tahminleme süreci (inference) milisaniyeler seviyesindedir, bu da web uygulamasında anlık yanıt verilmesini sağlar.
*   `max_depth` ve `min_samples_leaf` parametreleri ile aşırı öğrenme (overfitting) kontrol altına alınmıştır.

---

## 5. Web Arayüzü ve Sistem Kullanımı
Web uygulaması **Flask (Python)** tabanlıdır ve frontend tarafında modern HTML5/CSS3/JS teknolojileri kullanılmıştır.

### 5.1 Sayfa Yapıları
*   **Giriş Sayfası (Home):** Projenin tanıtımı ve model performans grafiklerinin gösterildiği alan.
*   **Önerici (Engine):** Kullanıcının kriterlerini girdiği form alanı.
*   **Sonuç Ekranı:** Modelin ürettiği önerilerin dinamik olarak listelendiği bölüm.

### 5.2 Kullanım Adımları
1.  **Veri Girişi:** Kullanıcı; izlediği film sayısını, ortalama puanını ve sevdiği türleri seçer.
2.  **Analiz:** Veriler, eğitilmiş en iyi model olan Decision Tree modeline (`best_model.joblib`) aktarılır.
3.  **Görsel Sunum:** Önerilen her film için; yıl, tür ve "Beğenilme Olasılığı Skoru" gösterilir.

---

## 6. Bulgular ve Sonuç
Proje boyunca elde edilen temel bulgular:

*   **Veri Seti Dengesi:** Veri setinde "beğenilen" filmlerin çoğunlukta olduğu (%63.47), bu yüzden saf tahminin ötesine geçmek için karmaşık özelliklerin önemi anlaşıldı.
*   **Zorluklar:** 31 milyon satırlık veri ile çalışırken bellek hatalarıyla (MemoryError) karşılaşılmış, bu aşama veri tiplerini optimize ederek ve sadece gerekli özet tabloları kullanarak aşılmıştır.
*   **Sonuç:** Geliştirilen sistem, sadece rastgele öneriler sunmak yerine kullanıcının belirttiği demografik (yıl) ve içeriksel (tür) tercihlere göre isabetli tahminler üretmektedir.

### 6.1 Gelecek Çalışmalar
Sistem; derin öğrenme temelli **Autoencoders** veya **Collaborative Filtering** yöntemleri kullanılarak geliştirilebilir. Ayrıca gerçek zamanlı IMDb görsel desteği eklenerek poster görüntüleme özellikleri zenginleştirilebilir.

Bu çalışma ile büyük veri madenciliği süreçlerinin uçtan uca (ham veriden canlı servise kadar) nasıl yönetileceği deneyimlenmiştir.
