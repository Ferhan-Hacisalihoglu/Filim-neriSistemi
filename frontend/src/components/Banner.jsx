import React, { useEffect, useState } from 'react';
import { Star, Play, Sparkles, Calendar, Tag } from 'lucide-react';
import { getMoviePosterUrl } from '../api';

export default function Banner({ featuredMovie, selectedModel, onSelectMovie, onGetAiRecs }) {
  const [posterUrl, setPosterUrl] = useState('');

  useEffect(() => {
    if (featuredMovie) {
      getMoviePosterUrl(featuredMovie.tmdb_id, featuredMovie.title).then(setPosterUrl);
    }
  }, [featuredMovie]);

  if (!featuredMovie) return null;

  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: '16px', overflow: 'hidden', margin: '20px 0 30px 0', backgroundColor: '#141722', border: '1px solid #262c3e', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
      {/* Background Glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${posterUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          filter: 'blur(20px) opacity(0.25)',
          transform: 'scale(1.1)'
        }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #0e1017 0%, rgba(14,16,23,0.85) 50%, rgba(14,16,23,0.4) 100%)' }} />

      <div style={{ position: 'relative', zIndex: 1, padding: '36px 32px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '32px' }}>
        
        {/* Poster */}
        <div style={{ width: '180px', height: '270px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 12px 24px rgba(0,0,0,0.6)', flexShrink: 0, border: '2px solid #2a3146' }}>
          <img src={posterUrl} alt={featuredMovie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: '280px' }}>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '12px' }}>
            <span style={{ backgroundColor: '#e50914', color: '#fff', fontSize: '0.75rem', fontWeight: 800, padding: '3px 10px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              🎬 ÖNE ÇIKAN FİLM
            </span>
            <span style={{ backgroundColor: 'rgba(255,184,0,0.15)', border: '1px solid #ffb800', color: '#ffb800', fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Star size={12} fill="#ffb800" /> {featuredMovie.avg_movie_rating} / 5.0
            </span>
            {featuredMovie.year && (
              <span style={{ backgroundColor: '#1f2536', color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={12} /> {featuredMovie.year}
              </span>
            )}
          </div>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '10px', lineHeight: 1.2 }}>
            {featuredMovie.title}
          </h1>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {featuredMovie.genres.map(g => (
              <span key={g} style={{ backgroundColor: '#1e2435', color: '#cbd5e1', fontSize: '0.75rem', padding: '3px 10px', borderRadius: '12px', border: '1px solid #2e374e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Tag size={10} color="#e50914" /> {g}
              </span>
            ))}
          </div>

          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '24px', maxWidth: '650px', lineHeight: 1.6 }}>
            Seçili makine öğrenmesi modeli (<strong>{selectedModel}</strong>) ve yüksek IMDb puanı ile önerilen öne çıkan yapım. Detayları inceleyebilir veya yapay zeka ile kişiselleştirilmiş tahmin alabilirsiniz.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onSelectMovie(featuredMovie)}
              style={{
                backgroundColor: '#e50914',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(229, 9, 20, 0.4)'
              }}
            >
              <Play size={18} fill="#ffffff" /> Film Detayı & ML Tahmini
            </button>
            <button
              onClick={onGetAiRecs}
              style={{
                backgroundColor: '#1f2537',
                color: '#f3f4f6',
                padding: '12px 20px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid #374151'
              }}
            >
              <Sparkles size={18} color="#ffb800" /> Yapay Zeka Listesi Al
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
