import React from 'react';
import MovieCard from './MovieCard';
import { Film } from 'lucide-react';

export default function MovieGrid({ movies, loading, onSelectMovie, recommendationScores = {} }) {
  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px', margin: '20px 0' }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ backgroundColor: '#141722', borderRadius: '10px', overflow: 'hidden', height: '340px', border: '1px solid #232738', animation: 'pulse 1.5s infinite ease-in-out' }}>
            <div style={{ height: '240px', backgroundColor: '#1d2232' }} />
            <div style={{ padding: '12px' }}>
              <div style={{ height: '14px', backgroundColor: '#2b3248', borderRadius: '4px', marginBottom: '8px', width: '80%' }} />
              <div style={{ height: '10px', backgroundColor: '#222738', borderRadius: '4px', width: '50%' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#141722', borderRadius: '12px', border: '1px solid #262c3e', margin: '30px 0' }}>
        <Film size={48} color="#e50914" style={{ marginBottom: '12px', opacity: 0.8 }} />
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '6px' }}>Film Bulunamadı</h3>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Seçtiğiniz filtreler veya arama terimine uygun film bulunamadı. Lütfen filtreleri sıfırlamayı deneyin.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px', margin: '20px 0' }}>
      {movies.map((movie) => (
        <MovieCard
          key={movie.movie_id}
          movie={movie}
          onSelect={onSelectMovie}
          recommendationScore={recommendationScores[movie.movie_id]}
        />
      ))}
    </div>
  );
}
