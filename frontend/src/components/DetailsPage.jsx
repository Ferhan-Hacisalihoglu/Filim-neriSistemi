import React, { useState, useEffect } from 'react';
import { Database, Users, Star, Film, Cpu, Award, Activity, CheckCircle2, Layers, LineChart, Server } from 'lucide-react';
import MovieCard from './MovieCard';
import { fetchStats } from '../api';

export default function DetailsPage({ onSelectMovie }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', color: '#9ca3af' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid #2d3348', borderTopColor: '#e50914', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px auto' }} />
        <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Sistem İstatistikleri ve Veri İşleme Süreci Yükleniyor...</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const topRated = stats?.top_10_rated || [];
  const topAvg = stats?.top_10_avg_rating || [];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b0c10', padding: '30px 20px', maxWidth: '1400px', margin: '0 auto', color: '#e2e8f0' }}>

      {/* Header Banner */}
      <div style={{ marginBottom: '36px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(229, 9, 20, 0.15)', border: '1px solid rgba(229, 9, 20, 0.3)', padding: '6px 16px', borderRadius: '20px', marginBottom: '14px' }}>
          <Activity size={16} color="#e50914" />
          <span style={{ color: '#e50914', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Sistem Mimarisi &amp; İstatistikler</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#ffffff', marginBottom: '10px', lineHeight: 1.2 }}>
          Veri Tabanı Detayları &amp; Makine Öğrenmesi Süreci
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '1rem', maxWidth: '750px', margin: '0 auto' }}>
          MovieLens 32M büyük ölçekli veri kümesi, SQLite veritabanı altyapısı ve 7 farklı yapay zeka algoritmasının detaylı analiz raporu.
        </p>
      </div>

      {/* ─── 1. Core Database Statistics Cards ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>

        <div style={statCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Toplam Film</span>
            <div style={{ ...iconBgStyle, backgroundColor: 'rgba(229, 9, 20, 0.2)', color: '#e50914' }}><Film size={22} /></div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff' }}>
            {stats?.total_movies?.toLocaleString('tr-TR') || '87.585'}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '4px' }}>SQLite Veritabanı İndeksi</div>
        </div>

        <div style={statCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Toplam Kullanıcı</span>
            <div style={{ ...iconBgStyle, backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}><Users size={22} /></div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff' }}>
            {stats?.total_users?.toLocaleString('tr-TR') || '200.948'}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '4px' }}>Tekil Kullanıcı Profili</div>
        </div>

        <div style={statCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Toplam Değerlendirme</span>
            <div style={{ ...iconBgStyle, backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}><Star size={22} /></div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff' }}>
            {stats?.total_ratings?.toLocaleString('tr-TR') || '32.000.204'}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '4px' }}>Kullanıcı Puanlaması</div>
        </div>

        <div style={statCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>ML Modelleri</span>
            <div style={{ ...iconBgStyle, backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}><Cpu size={22} /></div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff' }}>
            {stats?.total_models || 7} Algoritma
          </div>
          <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '4px' }}>Random Forest, XGBoost vb.</div>
        </div>

      </div>

      {/* ─── 2. Top 10 Most Rated Movies ─── */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Award size={24} color="#e50914" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
            En Çok Puanlanan Top 10 Film
          </h2>
          <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>(En fazla değerlendirme alan filmler)</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
          {topRated.map((movie, idx) => (
            <div key={movie.movie_id} style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', top: '-10px', left: '-6px', zIndex: 10,
                backgroundColor: idx < 3 ? '#ffb800' : '#e50914',
                color: idx < 3 ? '#000' : '#fff',
                width: '28px', height: '28px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 800, boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
              }}>
                {idx + 1}
              </div>
              <MovieCard movie={movie} onSelect={onSelectMovie} />
            </div>
          ))}
        </div>
      </div>

      {/* ─── 3. Top 10 Highest Average Rated Movies ─── */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Star size={24} color="#ffb800" fill="#ffb800" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
            En Yüksek Ortalama Puana Sahip Top 10 Film
          </h2>
          <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>(Minimum 10 oy almış filmler)</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
          {topAvg.map((movie, idx) => (
            <div key={movie.movie_id} style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', top: '-10px', left: '-6px', zIndex: 10,
                backgroundColor: idx < 3 ? '#ffb800' : '#3b82f6',
                color: idx < 3 ? '#000' : '#fff',
                width: '28px', height: '28px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 800, boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
              }}>
                {idx + 1}
              </div>
              <MovieCard movie={movie} onSelect={onSelectMovie} />
            </div>
          ))}
        </div>
      </div>

      {/* ─── 4. Data Processing & ML Pipeline Explanation ─── */}
      <div style={{ backgroundColor: '#141722', border: '1px solid #262c3e', borderRadius: '16px', padding: '32px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <Layers size={26} color="#e50914" />
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff' }}>
              Veri İşleme ve Makine Öğrenmesi Süreci (Data Mining Pipeline)
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
              Projede 32 milyon veri satırından makine öğrenmesi modellerine uzanan uçtan uca mimari
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>

          <div style={pipelineStepStyle}>
            <div style={stepHeaderStyle}>
              <span style={stepNumStyle}>1</span>
              <h3 style={stepTitleStyle}>Veri Toplama &amp; Depolama (SQLite)</h3>
            </div>
            <p style={stepDescStyle}>
              MovieLens 32M ve TMDb veri kümelerinden (<code>movies.csv</code>, <code>ratings.csv</code>, <code>links.csv</code>) 32 milyondan fazla oy ve 87 binden fazla film verisi ayıklanarak <strong>SQLite</strong> veritabanında tablolar halinde indekslenmiştir.
            </p>
          </div>

          <div style={pipelineStepStyle}>
            <div style={stepHeaderStyle}>
              <span style={stepNumStyle}>2</span>
              <h3 style={stepTitleStyle}>Veri Temizleme &amp; Regex Ayrıştırma</h3>
            </div>
            <p style={stepDescStyle}>
              Bozuk, boş veya hatalı yıl kayıtları ayıklandı. Film başlıklarındaki parantez içi yapım yılları düzenli ifadelerle (Regex: <code>\(\d{4}\)</code>) çekilip sayısal <code>year</code> niteliği olarak ayrıştırıldı.
            </p>
          </div>

          <div style={pipelineStepStyle}>
            <div style={stepHeaderStyle}>
              <span style={stepNumStyle}>3</span>
              <h3 style={stepTitleStyle}>Özellik Mühendisliği (Feature Engineering)</h3>
            </div>
            <p style={stepDescStyle}>
              Her film için ortalama puan (<code>avg_movie_rating</code>) ve oy sayısı (<code>rating_count</code>) hesaplandı. 20 farklı film türü One-Hot Vector olarak kodlandı. Kullanıcı davranışını temsilen ortalama oy nitelikleri eklendi.
            </p>
          </div>

          <div style={pipelineStepStyle}>
            <div style={stepHeaderStyle}>
              <span style={stepNumStyle}>4</span>
              <h3 style={stepTitleStyle}>Hedef Değişken &amp; İkili Sınıflandırma</h3>
            </div>
            <p style={stepDescStyle}>
              Kullanıcının bir filmi beğenme eşiği <strong>≥ 3.5</strong> olarak tanımlandı. Problemin makine öğrenmesi karşılığı "Beğenildi (1)" ve "Beğenilmedi (0)" şeklinde ikili sınıflandırma (Binary Classification) olarak kurgulandı.
            </p>
          </div>

          <div style={pipelineStepStyle}>
            <div style={stepHeaderStyle}>
              <span style={stepNumStyle}>5</span>
              <h3 style={stepTitleStyle}>Model Eğitimi &amp; 5-Katlı Çapraz Doğrulama</h3>
            </div>
            <p style={stepDescStyle}>
              scikit-learn, XGBoost, LightGBM ve CatBoost kütüphaneleriyle 7 farklı algoritma (Random Forest, Gradient Boosting, Logistic Regression, Decision Tree vb.) eğitildi. 5-Fold Cross Validation ile Accuracy ve AUC skorları doğrulandı.
            </p>
          </div>

          <div style={pipelineStepStyle}>
            <div style={stepHeaderStyle}>
              <span style={stepNumStyle}>6</span>
              <h3 style={stepTitleStyle}>Model Saklama &amp; Canlı FastAPI Hizmeti</h3>
            </div>
            <p style={stepDescStyle}>
              Eğitilen tüm modeller <code>joblib</code> formatında diske kaydedildi. FastAPI backend sunucusu üzerinden milisaniyeler içinde kişiselleştirilmiş film önerileri hesaplanıp sunulmaktadır.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

const statCardStyle = {
  backgroundColor: '#141722',
  border: '1px solid #262c3e',
  borderRadius: '14px',
  padding: '20px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
};

const iconBgStyle = {
  width: '42px',
  height: '42px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const pipelineStepStyle = {
  backgroundColor: '#0e1017',
  border: '1px solid #222738',
  borderRadius: '12px',
  padding: '20px'
};

const stepHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '10px'
};

const stepNumStyle = {
  backgroundColor: '#e50914',
  color: '#ffffff',
  fontWeight: 900,
  fontSize: '0.85rem',
  width: '26px',
  height: '26px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

const stepTitleStyle = {
  fontSize: '1rem',
  fontWeight: 800,
  color: '#ffffff',
  margin: 0
};

const stepDescStyle = {
  fontSize: '0.85rem',
  color: '#9ca3af',
  lineHeight: 1.5,
  margin: 0
};
