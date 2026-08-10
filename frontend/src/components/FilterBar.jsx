import React from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, RefreshCw } from 'lucide-react';
import RangeFilter from './RangeFilter';

export default function FilterBar({
  genres,
  selectedGenre,
  setSelectedGenre,
  yearMin,
  setYearMin,
  yearMax,
  setYearMax,
  ratingMin,
  setRatingMin,
  ratingMax,
  setRatingMax,
  minRatingCount,
  setMinRatingCount,
  sortBy,
  setSortBy,
  order,
  setOrder,
  onResetFilters
}) {
  const popularGenres = ['Tümü', 'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi', 'Thriller'];

  return (
    <div style={{ margin: '20px 0', backgroundColor: '#141722', borderRadius: '14px', border: '1px solid #262c3e', padding: '20px 24px' }}>
      
      {/* Genre Pills Slider */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '18px', borderBottom: '1px solid #222738' }}>
        {popularGenres.map((g) => {
          const val = g === 'Tümü' ? '' : g;
          const isActive = selectedGenre === val;
          return (
            <button
              key={g}
              onClick={() => setSelectedGenre(val)}
              style={{
                backgroundColor: isActive ? '#e50914' : '#1d2232',
                color: isActive ? '#ffffff' : '#cbd5e1',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: isActive ? 700 : 500,
                whiteSpace: 'nowrap',
                border: isActive ? '1px solid #ff1e27' : '1px solid #2b3248',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {g === 'Tümü' ? '🎬 Tüm Türler' : g}
            </button>
          );
        })}
      </div>

      {/* Range Sliders Section: Yıllar ve Puanlar Dual Slider */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '20px' }}>
        
        {/* Year Dual Slider */}
        <RangeFilter
          label="Yayım Yılı Aralığı"
          type="year"
          minValue={yearMin}
          maxValue={yearMax}
          onMinChange={setYearMin}
          onMaxChange={setYearMax}
          minLimit={1874}
          maxLimit={2024}
          step={1}
        />

        {/* Rating Dual Slider */}
        <RangeFilter
          label="Film Puanı Aralığı"
          type="rating"
          minValue={ratingMin}
          maxValue={ratingMax}
          onMinChange={setRatingMin}
          onMaxChange={setRatingMax}
          minLimit={0.0}
          maxLimit={5.0}
          step={0.1}
        />

      </div>

      {/* Bottom Filter Controls Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid #1f2536' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          
          {/* Genre Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600 }}>Tür:</span>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              style={{
                backgroundColor: '#0e1017',
                border: '1px solid #2b3248',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="">Tüm Türler ({genres.length})</option>
              {genres.map((g) => (
                <option key={g.id} value={g.name}>{g.name}</option>
              ))}
            </select>
          </div>

          {/* Min Votes */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600 }}>Min. Oy Sayısı:</span>
            <select
              value={minRatingCount || ''}
              onChange={(e) => setMinRatingCount(e.target.value ? parseFloat(e.target.value) : null)}
              style={{
                backgroundColor: '#0e1017',
                border: '1px solid #2b3248',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="">Fark Etmez</option>
              <option value="10">10+ Oy</option>
              <option value="50">50+ Oy</option>
              <option value="100">100+ Oy</option>
              <option value="200">200+ Oy</option>
            </select>
          </div>

        </div>

        {/* Sorting & Reset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowUpDown size={14} color="#9ca3af" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                backgroundColor: '#0e1017',
                border: '1px solid #2b3248',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="avg_movie_rating">Puan</option>
              <option value="rating_count">Popülerlik (Oy Sayısı)</option>
              <option value="year">Yıl</option>
              <option value="title">Film Adı</option>
            </select>
          </div>

          <button
            onClick={() => setOrder(order === 'desc' ? 'asc' : 'desc')}
            style={{ backgroundColor: '#0e1017', border: '1px solid #2b3248', color: '#cbd5e1', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
          >
            {order === 'desc' ? 'AZ ↓' : 'ZA ↑'}
          </button>

          <button
            onClick={onResetFilters}
            title="Filtreleri Sıfırla"
            style={{ backgroundColor: '#262c3e', border: '1px solid #374151', color: '#f3f4f6', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, cursor: 'pointer' }}
          >
            <RefreshCw size={13} /> Sıfırla
          </button>
        </div>

      </div>

    </div>
  );
}
