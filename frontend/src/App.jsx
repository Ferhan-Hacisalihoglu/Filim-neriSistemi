import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import MovieGrid from './components/MovieGrid';
import MovieModal from './components/MovieModal';
import ModelStatsModal from './components/ModelStatsModal';
import RecommendationPage from './components/RecommendationPage';
import DetailsPage from './components/DetailsPage';
import Pagination from './components/Pagination';
import { fetchMovies, fetchGenres, fetchModels, fetchStats } from './api';
import { Sparkles, Film, Activity, Cpu } from 'lucide-react';

// Pages: 'home' | 'recommendations' | 'details'
export default function App() {
  const [activePage, setActivePage] = useState('home');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedModel, setSelectedModel] = useState('Logistic Regression');
  const [yearMin, setYearMin] = useState(null);
  const [yearMax, setYearMax] = useState(null);
  const [ratingMin, setRatingMin] = useState(null);
  const [ratingMax, setRatingMax] = useState(null);
  const [minRatingCount, setMinRatingCount] = useState(null);
  const [sortBy, setSortBy] = useState('avg_movie_rating');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);

  const [movies, setMovies] = useState([]);
  const [totalMovies, setTotalMovies] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const [genres, setGenres] = useState([]);
  const [models, setModels] = useState([]);
  const [stats, setStats] = useState(null);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModelStats, setShowModelStats] = useState(false);

  // Load initial metadata
  useEffect(() => {
    fetchGenres().then(setGenres).catch(console.error);
    fetchModels().then(m => {
      setModels(m);
      if (m && m.length > 0) {
        const best = m.find(item => item.is_best) || m[0];
        setSelectedModel(best.name);
      }
    }).catch(console.error);
    fetchStats().then(setStats).catch(console.error);
  }, []);

  // Load filtered movies from Backend (SQLite)
  useEffect(() => {
    if (activePage !== 'home') return;
    let isMounted = true;
    setLoading(true);

    fetchMovies({
      title: searchQuery,
      genre: selectedGenre,
      year_min: yearMin,
      year_max: yearMax,
      rating_min: ratingMin,
      rating_max: ratingMax,
      min_rating_count: minRatingCount,
      sort_by: sortBy,
      order: order,
      page: page,
      page_size: 20
    }).then((data) => {
      if (isMounted) {
        setMovies(data.movies);
        setTotalMovies(data.total);
        setTotalPages(data.total_pages);
        setLoading(false);
      }
    }).catch((err) => {
      console.error(err);
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, [activePage, searchQuery, selectedGenre, yearMin, yearMax, ratingMin, ratingMax, minRatingCount, sortBy, order, page]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGenre('');
    setYearMin(null);
    setYearMax(null);
    setRatingMin(null);
    setRatingMax(null);
    setMinRatingCount(null);
    setSortBy('avg_movie_rating');
    setOrder('desc');
    setPage(1);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0b0c10' }}>

      {/* ─── Header Navbar ─── */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(11, 12, 16, 0.97)',
        borderBottom: '1px solid #1a1f2e',
        backdropFilter: 'blur(10px)',
        padding: '0 24px',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', gap: '20px' }}>

          {/* Logo */}
          <button
            onClick={() => setActivePage('home')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div style={{ backgroundColor: '#e50914', borderRadius: '8px', padding: '6px 10px', fontWeight: 900, fontSize: '1.1rem', color: '#fff', letterSpacing: '-0.5px' }}>
              🎬
            </div>
            <span style={{ fontWeight: 900, fontSize: '1.15rem', color: '#ffffff', letterSpacing: '-0.3px' }}>
              CINEMA<span style={{ color: '#e50914' }}>AI</span>
            </span>
          </button>

          {/* Nav Links */}
          <nav style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActivePage('home')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '0.88rem',
                backgroundColor: activePage === 'home' ? 'rgba(229, 9, 20, 0.15)' : 'transparent',
                color: activePage === 'home' ? '#e50914' : '#9ca3af',
                border: activePage === 'home' ? '1px solid rgba(229, 9, 20, 0.3)' : '1px solid transparent',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <Film size={16} /> Film Arşivi
            </button>

            <button
              onClick={() => setActivePage('recommendations')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '0.88rem',
                backgroundColor: activePage === 'recommendations' ? 'rgba(229, 9, 20, 0.15)' : 'transparent',
                color: activePage === 'recommendations' ? '#e50914' : '#9ca3af',
                border: activePage === 'recommendations' ? '1px solid rgba(229, 9, 20, 0.3)' : '1px solid transparent',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <Sparkles size={16} /> Film Öner
            </button>

            <button
              onClick={() => setActivePage('details')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '0.88rem',
                backgroundColor: activePage === 'details' ? 'rgba(229, 9, 20, 0.15)' : 'transparent',
                color: activePage === 'details' ? '#e50914' : '#9ca3af',
                border: activePage === 'details' ? '1px solid rgba(229, 9, 20, 0.3)' : '1px solid transparent',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <Activity size={16} /> Sistem Detayları
            </button>
          </nav>

          {/* Search (only on home) */}
          {activePage === 'home' && (
            <input
              type="text"
              placeholder="🔍 Film ara..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
              style={{
                backgroundColor: '#141722', border: '1px solid #2b3248', borderRadius: '8px',
                color: '#ffffff', padding: '8px 14px', fontSize: '0.9rem', outline: 'none',
                width: '220px', maxWidth: '100%'
              }}
            />
          )}

          {/* Model Comparison Stats Button */}
          <button
            onClick={() => setShowModelStats(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              backgroundColor: '#141722', border: '1px solid #2b3248', borderRadius: '8px',
              color: '#9ca3af', padding: '8px 14px', fontSize: '0.82rem', fontWeight: 600,
              cursor: 'pointer', whiteSpace: 'nowrap'
            }}
          >
            🤖 Modeller
          </button>
        </div>
      </header>

      {/* ─── Page Router Render ─── */}
      {activePage === 'recommendations' ? (
        <RecommendationPage
          models={models}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          onSelectMovie={setSelectedMovie}
        />
      ) : activePage === 'details' ? (
        <DetailsPage
          onSelectMovie={setSelectedMovie}
        />
      ) : (
        <main style={{ flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '20px 20px 40px 20px' }}>

          {/* Filter Controls Bar */}
          <FilterBar
            genres={genres}
            selectedGenre={selectedGenre}
            setSelectedGenre={(g) => { setSelectedGenre(g); setPage(1); }}
            yearMin={yearMin}
            setYearMin={(y) => { setYearMin(y); setPage(1); }}
            yearMax={yearMax}
            setYearMax={(y) => { setYearMax(y); setPage(1); }}
            ratingMin={ratingMin}
            setRatingMin={(r) => { setRatingMin(r); setPage(1); }}
            ratingMax={ratingMax}
            setRatingMax={(r) => { setRatingMax(r); setPage(1); }}
            minRatingCount={minRatingCount}
            setMinRatingCount={(c) => { setMinRatingCount(c); setPage(1); }}
            sortBy={sortBy}
            setSortBy={(s) => { setSortBy(s); setPage(1); }}
            order={order}
            setOrder={(o) => { setOrder(o); setPage(1); }}
            onResetFilters={handleResetFilters}
          />

          {/* Section Title */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '24px 0 12px 0' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Film color="#e50914" size={24} />
              {searchQuery ? `Arama: "${searchQuery}"` : selectedGenre ? `${selectedGenre} Filmleri` : 'Tüm Film Arşivi'}
              <span style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 500 }}>
                ({totalMovies.toLocaleString('tr-TR')} film)
              </span>
            </h2>
          </div>

          {/* Main Movie Cards Grid */}
          <MovieGrid
            movies={movies}
            loading={loading}
            onSelectMovie={setSelectedMovie}
          />

          {/* Pagination Controls */}
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />

        </main>
      )}

      {/* Footer */}
      <footer style={{ backgroundColor: '#07080a', borderTop: '1px solid #1f2536', padding: '30px 20px', color: '#6b7280', fontSize: '0.85rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div>
            <strong style={{ color: '#fff' }}>CINEMA AI ML ENGINE</strong> — SQLite &amp; React Yapay Zeka Film Portalı
          </div>
          {stats && (
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span>🎬 {stats.total_movies.toLocaleString('tr-TR')} Film</span>
              <span>👤 {stats.total_users ? stats.total_users.toLocaleString('tr-TR') : '200.948'} Kullanıcı</span>
              <span>⭐ {stats.total_ratings ? stats.total_ratings.toLocaleString('tr-TR') : '32.000.204'} Puan</span>
              <span>🤖 {stats.total_models} ML Modeli</span>
            </div>
          )}
        </div>
      </footer>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          selectedModel={selectedModel}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      {/* Model Stats Comparison Modal */}
      {showModelStats && (
        <ModelStatsModal
          models={models}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          onClose={() => setShowModelStats(false)}
        />
      )}

    </div>
  );
}
