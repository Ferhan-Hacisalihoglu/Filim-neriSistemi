import React, { useState, useEffect } from 'react';
import { Sparkles, Cpu, Filter, Plus, RotateCcw, Film, Search, X, CheckCircle2, Clapperboard } from 'lucide-react';
import MovieCard from './MovieCard';
import RangeFilter from './RangeFilter';
import { fetchRecommendations, fetchMovies } from '../api';

const GENRE_LIST = [
  'Action', 'Adventure', 'Animation', 'Children', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Fantasy', 'Film-Noir', 'Horror', 'IMAX',
  'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'
];

// Popular preset sample movies for quick selection
const POPULAR_SAMPLES = [
  { movie_id: 318, title: 'Shawshank Redemption, The (1994)', year: 1994, genres: ['Drama'], avg_movie_rating: 4.47 },
  { movie_id: 2571, title: 'Matrix, The (1999)', year: 1999, genres: ['Action', 'Sci-Fi'], avg_movie_rating: 4.12 },
  { movie_id: 1, title: 'Toy Story (1995)', year: 1995, genres: ['Animation', 'Children', 'Comedy'], avg_movie_rating: 3.89 },
  { movie_id: 296, title: 'Pulp Fiction (1994)', year: 1994, genres: ['Crime', 'Drama'], avg_movie_rating: 4.28 },
  { movie_id: 356, title: 'Forrest Gump (1994)', year: 1994, genres: ['Drama', 'Romance'], avg_movie_rating: 4.02 },
  { movie_id: 480, title: 'Jurassic Park (1993)', year: 1993, genres: ['Action', 'Adventure', 'Sci-Fi'], avg_movie_rating: 3.69 },
  { movie_id: 593, title: 'Silence of the Lambs, The (1991)', year: 1991, genres: ['Crime', 'Horror', 'Thriller'], avg_movie_rating: 4.13 },
  { movie_id: 55241, title: 'Interstellar (2014)', year: 2014, genres: ['Drama', 'Sci-Fi'], avg_movie_rating: 4.20 }
];

const MAX_RECS = 50;
const PAGE_STEP = 10;

export default function RecommendationPage({ models, selectedModel, setSelectedModel, onSelectMovie }) {
  // Sample reference movie state
  const [selectedSample, setSelectedSample] = useState(null);
  const [sampleSearchQuery, setSampleSearchQuery] = useState('');
  const [sampleSearchResults, setSampleSearchResults] = useState([]);
  const [searchingSamples, setSearchingSamples] = useState(false);

  // User inputs
  const [genre, setGenre] = useState('');
  const [minYear, setMinYear] = useState(null);
  const [maxYear, setMaxYear] = useState(null);
  const [minRating, setMinRating] = useState(3.5);
  const [maxRating, setMaxRating] = useState(5.0);
  const [minVotes, setMinVotes] = useState('50');
  const [userAvgRating, setUserAvgRating] = useState(4.0);
  const [userRatingCount, setUserRatingCount] = useState(50);
  const [modelName, setModelName] = useState(selectedModel || 'Logistic Regression');

  // Results state
  const [allRecs, setAllRecs] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [totalCandidates, setTotalCandidates] = useState(0);

  // Live search for custom sample movies
  useEffect(() => {
    if (!sampleSearchQuery.trim()) {
      setSampleSearchResults([]);
      return;
    }
    const timer = setTimeout(() => {
      setSearchingSamples(true);
      fetchMovies({ title: sampleSearchQuery, page_size: 6 })
        .then(res => setSampleSearchResults(res.movies || []))
        .catch(console.error)
        .finally(() => setSearchingSamples(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [sampleSearchQuery]);

  // When a sample movie is selected, automatically update filters to match it
  const handleSelectSample = (movie) => {
    setSelectedSample(movie);
    setSampleSearchQuery('');
    setSampleSearchResults([]);

    // Automatically set primary genre
    if (movie.genres && movie.genres.length > 0) {
      setGenre(movie.genres[0]);
    }
    // Set year range centered around movie year
    if (movie.year) {
      setMinYear(Math.max(1874, movie.year - 15));
      setMaxYear(Math.min(2024, movie.year + 15));
    }
    // Set min rating threshold
    if (movie.avg_movie_rating) {
      setMinRating(Math.max(2.0, Math.floor(movie.avg_movie_rating * 10 - 5) / 10));
    }
  };

  const handleClearSample = () => {
    setSelectedSample(null);
  };

  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);
    setVisibleCount(10);
    setAllRecs([]);
    try {
      const res = await fetchRecommendations({
        model_name: modelName,
        genre: genre || null,
        min_year: minYear ? parseInt(minYear) : null,
        max_year: maxYear ? parseInt(maxYear) : null,
        min_rating: minRating !== null && minRating !== undefined ? parseFloat(minRating) : null,
        min_rating_count: minVotes ? parseFloat(minVotes) : 10,
        user_avg_rating: userAvgRating,
        user_rating_count: userRatingCount,
        top_n: MAX_RECS
      });
      setAllRecs(res.recommendations || []);
      setTotalCandidates(res.total_candidates_analyzed || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + PAGE_STEP, MAX_RECS, allRecs.length));
      setLoadingMore(false);
    }, 300);
  };

  const handleReset = () => {
    setSelectedSample(null);
    setGenre('');
    setMinYear(null);
    setMaxYear(null);
    setMinRating(3.5);
    setMaxRating(5.0);
    setMinVotes('50');
    setUserAvgRating(4.0);
    setUserRatingCount(50);
    setAllRecs([]);
    setHasSearched(false);
    setVisibleCount(10);
  };

  const visibleRecs = allRecs.slice(0, visibleCount);
  const canLoadMore = visibleCount < allRecs.length && visibleCount < MAX_RECS;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b0c10', padding: '30px 20px', maxWidth: '1400px', margin: '0 auto' }}>

      {/* Page Header */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', backgroundColor: '#e50914', padding: '6px 16px', borderRadius: '20px', marginBottom: '14px' }}>
          <Sparkles size={16} color="#fff" fill="#fff" />
          <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Yapay Zeka Öneri Motoru</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '10px', lineHeight: 1.2 }}>
          Size Özel Film Tavsiyeleri
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '1rem', maxWidth: '650px', margin: '0 auto' }}>
          Beğendiğiniz bir örnek film ekleyin veya tercihlerinizi belirleyin; yapay zeka 87.000+ film arasından en yüksek uyumlu filmleri getirsin.
        </p>
      </div>

      {/* ─── Örnek Film Ekle / Seç Paneli ─── */}
      <div style={{ backgroundColor: '#141722', border: '1px solid #262c3e', borderRadius: '16px', padding: '24px', marginBottom: '28px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clapperboard size={20} color="#e50914" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Örnek Referans Film Ekle / Seç
            </h2>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
            Sevdiğiniz bir filmi seçtiğinizde filtrelere ve önerilere otomatik yansır.
          </span>
        </div>

        {/* Selected Sample Badge if present */}
        {selectedSample ? (
          <div style={{
            backgroundColor: 'rgba(229, 9, 20, 0.15)',
            border: '1px solid #e50914',
            borderRadius: '12px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 size={24} color="#e50914" />
              <div>
                <div style={{ fontSize: '0.78rem', color: '#e50914', fontWeight: 800, textTransform: 'uppercase' }}>
                  Seçili Referans Film
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                  {selectedSample.title} {selectedSample.year ? `(${selectedSample.year})` : ''}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '2px' }}>
                  Türler: {(selectedSample.genres || []).join(', ')} • Puan: ⭐ {selectedSample.avg_movie_rating}
                </div>
              </div>
            </div>

            <button
              onClick={handleClearSample}
              style={{
                backgroundColor: '#262c3e',
                border: 'none',
                color: '#ffffff',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <X size={14} /> Kaldır
            </button>
          </div>
        ) : null}

        {/* Quick Sample Buttons */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '8px' }}>
            Hızlı Örnek Filmler:
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {POPULAR_SAMPLES.map(sample => {
              const isSelected = selectedSample?.movie_id === sample.movie_id;
              return (
                <button
                  key={sample.movie_id}
                  onClick={() => handleSelectSample(sample)}
                  style={{
                    backgroundColor: isSelected ? '#e50914' : '#1d2232',
                    color: isSelected ? '#ffffff' : '#cbd5e1',
                    border: isSelected ? '1px solid #ff1e27' : '1px solid #2b3248',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  🎬 {sample.title.split('(')[0].trim()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Movie Search Input for Sample Selection */}
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#0e1017', border: '1px solid #2b3248', borderRadius: '10px', padding: '0 12px' }}>
            <Search size={16} color="#9ca3af" />
            <input
              type="text"
              placeholder="Arşivden farklı bir örnek film ara ve ekle (örn: Inception, Gladiator)..."
              value={sampleSearchQuery}
              onChange={e => setSampleSearchQuery(e.target.value)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#ffffff',
                padding: '10px 12px',
                fontSize: '0.88rem',
                outline: 'none',
                width: '100%'
              }}
            />
            {sampleSearchQuery && (
              <button onClick={() => setSampleSearchQuery('')} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 0 }}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Autocomplete Results Dropdown */}
          {sampleSearchResults.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 50,
              backgroundColor: '#141722',
              border: '1px solid #2b3248',
              borderRadius: '10px',
              marginTop: '4px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
              overflow: 'hidden'
            }}>
              {sampleSearchResults.map(m => (
                <div
                  key={m.movie_id}
                  onClick={() => handleSelectSample(m)}
                  style={{
                    padding: '10px 16px',
                    borderBottom: '1px solid #1f2536',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'background-color 0.15s'
                  }}
                  className="search-item-hover"
                >
                  <div>
                    <strong style={{ color: '#ffffff', fontSize: '0.9rem' }}>{m.title}</strong>
                    <span style={{ fontSize: '0.78rem', color: '#9ca3af', marginLeft: '8px' }}>
                      ({(m.genres || []).join(', ')})
                    </span>
                  </div>
                  <span style={{ color: '#ffb800', fontWeight: 700, fontSize: '0.8rem' }}>
                    ⭐ {m.avg_movie_rating}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ─── Input Form Panel ─── */}
      <div style={{ backgroundColor: '#141722', border: '1px solid #262c3e', borderRadius: '16px', padding: '28px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '22px' }}>
          <Filter size={18} color="#e50914" />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>Tercih Ayarlarınızı Yapın</h2>
        </div>

        {/* Dual Sliders Row: Yıllar ve Puanlar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px', marginBottom: '24px' }}>
          
          <RangeFilter
            label="Yayım Yılı Aralığı"
            type="year"
            minValue={minYear}
            maxValue={maxYear}
            onMinChange={setMinYear}
            onMaxChange={setMaxYear}
            minLimit={1874}
            maxLimit={2024}
            step={1}
          />

          <RangeFilter
            label="Film Puanı Aralığı"
            type="rating"
            minValue={minRating}
            maxValue={maxRating}
            onMinChange={setMinRating}
            onMaxChange={setMaxRating}
            minLimit={0.0}
            maxLimit={5.0}
            step={0.1}
          />

        </div>

        {/* Other Inputs Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>

          {/* Genre */}
          <div>
            <label style={labelStyle}>Film Türü</label>
            <select value={genre} onChange={e => setGenre(e.target.value)} style={selectStyle}>
              <option value="">Tüm Türler</option>
              {GENRE_LIST.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {/* Min Votes */}
          <div>
            <label style={labelStyle}>Min. Oy Sayısı</label>
            <select value={minVotes} onChange={e => setMinVotes(e.target.value)} style={selectStyle}>
              <option value="10">10+ Oy</option>
              <option value="50">50+ Oy</option>
              <option value="100">100+ Oy</option>
              <option value="200">200+ Oy</option>
              <option value="500">500+ Oy</option>
            </select>
          </div>

          {/* User Avg Rating Preference */}
          <div>
            <label style={labelStyle}>Beğeni Eşiğiniz: ⭐ {userAvgRating.toFixed(1)}</label>
            <input
              type="range" min="1.0" max="5.0" step="0.5"
              value={userAvgRating}
              onChange={e => setUserAvgRating(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#e50914', cursor: 'pointer', marginTop: '8px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#6b7280', marginTop: '2px' }}>
              <span>Düşük Eşik</span><span>Çok Seçici</span>
            </div>
          </div>

          {/* ML Model Selection */}
          <div>
            <label style={labelStyle}>Yapay Zeka Modeli</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#0e1017', border: '1px solid #2b3248', borderRadius: '8px', padding: '4px 12px' }}>
              <Cpu size={14} color="#e50914" />
              <select
                value={modelName}
                onChange={e => { setModelName(e.target.value); setSelectedModel(e.target.value); }}
                style={{ ...selectStyle, border: 'none', backgroundColor: 'transparent', padding: '6px 0' }}
              >
                {(models || []).map(m => (
                  <option key={m.name} value={m.name} style={{ backgroundColor: '#141722' }}>
                    {m.name} ({(m.accuracy * 100).toFixed(1)}%)
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={handleSearch}
            disabled={loading}
            style={{
              backgroundColor: '#e50914',
              color: '#fff',
              padding: '12px 28px',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(229, 9, 20, 0.4)',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            <Sparkles size={18} fill={loading ? 'transparent' : '#fff'} />
            {loading ? 'Analiz ediliyor...' : '10 Film Öner'}
          </button>

          {hasSearched && (
            <button
              onClick={handleReset}
              style={{
                backgroundColor: '#1d2232',
                color: '#cbd5e1',
                padding: '12px 20px',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid #374151',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={16} /> Sıfırla
            </button>
          )}
        </div>
      </div>

      {/* ─── Results ─── */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #2d3348', borderTopColor: '#e50914', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px auto' }} />
          <p style={{ fontWeight: 600 }}>Yapay Zeka analiz ediyor...</p>
          <p style={{ fontSize: '0.82rem', marginTop: '6px' }}>Model film veritabanını tarıyor</p>
        </div>
      )}

      {!loading && hasSearched && (
        <>
          {/* Result Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
                {allRecs.length > 0
                  ? `Size Özel ${allRecs.length} Film Bulundu`
                  : 'Kriterlerinize Uygun Film Bulunamadı'}
              </h2>
              {allRecs.length > 0 && (
                <p style={{ color: '#9ca3af', fontSize: '0.82rem' }}>
                  <span style={{ color: '#e50914', fontWeight: 700 }}>{totalCandidates.toLocaleString('tr-TR')}</span> aday film analiz edildi •{' '}
                  <span style={{ color: '#ffb800', fontWeight: 700 }}>{modelName}</span> modeli ile sıralandı •{' '}
                  {visibleCount}/{allRecs.length} gösteriliyor
                </p>
              )}
            </div>
          </div>

          {/* Movie Grid */}
          {visibleRecs.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              {visibleRecs.map((movie, idx) => (
                <div key={movie.movie_id} style={{ position: 'relative' }}>
                  {/* Rank Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '-6px',
                    zIndex: 10,
                    backgroundColor: idx < 3 ? '#ffb800' : '#e50914',
                    color: idx < 3 ? '#000' : '#fff',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
                  }}>
                    {idx + 1}
                  </div>
                  <MovieCard
                    movie={movie}
                    onSelect={onSelectMovie}
                    recommendationScore={movie.recommendation_score}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {canLoadMore && (
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <p style={{ color: '#9ca3af', fontSize: '0.82rem', marginBottom: '14px' }}>
                {visibleCount} / {Math.min(allRecs.length, MAX_RECS)} film gösteriliyor
              </p>
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                style={{
                  backgroundColor: '#1d2232',
                  border: '2px solid #e50914',
                  color: '#ffffff',
                  padding: '14px 36px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '1rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 4px 14px rgba(229, 9, 20, 0.25)',
                  cursor: loadingMore ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <Plus size={20} color="#e50914" />
                {loadingMore ? 'Yükleniyor...' : `${PAGE_STEP} Ekstra Film Öner`}
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  (maks. {MAX_RECS})
                </span>
              </button>
            </div>
          )}

          {!canLoadMore && allRecs.length > 0 && visibleCount >= allRecs.length && (
            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.85rem', marginBottom: '40px' }}>
              Maksimum {MAX_RECS} film önerisi tamamlandı. Farklı filtrelerle yeni öneriler alabilirsiniz.
            </p>
          )}
        </>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .search-item-hover:hover { background-color: #1d2232; }
      `}</style>

    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '0.78rem',
  fontWeight: 700,
  color: '#9ca3af',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '6px'
};

const selectStyle = {
  backgroundColor: '#0e1017',
  border: '1px solid #2b3248',
  borderRadius: '8px',
  color: '#ffffff',
  padding: '8px 12px',
  fontSize: '0.9rem',
  outline: 'none',
  width: '100%',
  cursor: 'pointer'
};
