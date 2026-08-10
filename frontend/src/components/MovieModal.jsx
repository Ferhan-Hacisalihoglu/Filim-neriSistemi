import React, { useState, useEffect } from 'react';
import { X, Star, Calendar, ExternalLink, Cpu, Sparkles, ThumbsUp, ThumbsDown, Database } from 'lucide-react';
import { getMoviePosterUrl, predictMovie } from '../api';

export default function MovieModal({ movie, selectedModel, onClose }) {
  const [posterUrl, setPosterUrl] = useState('');
  const [predictionResult, setPredictionResult] = useState(null);
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    if (movie) {
      getMoviePosterUrl(movie.tmdb_id, movie.title).then(setPosterUrl);
      setPredictionResult(null);
      handlePredict();
    }
  }, [movie, selectedModel]);

  const handlePredict = async () => {
    if (!movie) return;
    setPredicting(true);
    try {
      const res = await predictMovie({
        movie_id: movie.movie_id,
        model_name: selectedModel,
        user_avg_rating: 3.5,
        user_rating_count: 20
      });
      setPredictionResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setPredicting(false);
    }
  };

  if (!movie) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      
      <div
        className="animate-fade-in"
        style={{
          backgroundColor: '#141722',
          border: '1px solid #2d3348',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10, backgroundColor: 'rgba(30, 36, 53, 0.8)', border: '1px solid #374151', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ padding: '28px', display: 'flex', flexWrap: 'wrap', gap: '28px' }}>
          
          {/* Poster Image */}
          <div style={{ width: '220px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #2b3248', flexShrink: 0, boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
            <img src={posterUrl} alt={movie.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>

          {/* Details */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge-gold">⭐ {movie.avg_movie_rating} / 5.0</span>
              {movie.year && (
                <span style={{ color: '#9ca3af', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={14} /> {movie.year}
                </span>
              )}
            </div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginBottom: '12px', lineHeight: 1.2 }}>
              {movie.title}
            </h2>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {(movie.genres || []).map(g => (
                <span key={g} style={{ backgroundColor: '#1d2232', color: '#e2e8f0', fontSize: '0.78rem', padding: '3px 10px', borderRadius: '6px', border: '1px solid #2b3248' }}>
                  {g}
                </span>
              ))}
            </div>

            <div style={{ fontSize: '0.88rem', color: '#9ca3af', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px', backgroundColor: '#0e1017', padding: '14px', borderRadius: '10px', border: '1px solid #222738' }}>
              <div><strong style={{ color: '#fff' }}>Film ID:</strong> #{movie.movie_id}</div>
              <div><strong style={{ color: '#fff' }}>Toplam Oy:</strong> {Math.round(movie.rating_count || 0).toLocaleString('tr-TR')}</div>
              {movie.tmdb_id && <div><strong style={{ color: '#fff' }}>TMDb ID:</strong> {movie.tmdb_id}</div>}
              {movie.imdb_id && <div><strong style={{ color: '#fff' }}>IMDb ID:</strong> tt{movie.imdb_id}</div>}
            </div>

            {/* External Links */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
              {movie.imdb_id && (
                <a
                  href={`https://www.imdb.com/title/tt${movie.imdb_id}/`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ backgroundColor: '#f5c518', color: '#000', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                >
                  IMDb Detayı <ExternalLink size={14} />
                </a>
              )}
              {movie.tmdb_id && (
                <a
                  href={`https://www.themoviedb.org/movie/${movie.tmdb_id}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ backgroundColor: '#01b4e4', color: '#fff', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                >
                  TMDb Detayı <ExternalLink size={14} />
                </a>
              )}
            </div>

            {/* Static ML Model Prediction Badge (No Rating Slider) */}
            <div style={{ backgroundColor: '#1b2030', border: '1px solid #2e364f', borderRadius: '12px', padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffb800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Cpu size={16} color="#e50914" /> Model Tahmini: {selectedModel}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Yapay Zeka Analizi</span>
              </div>

              {predicting ? (
                <div style={{ textAlign: 'center', padding: '10px', fontSize: '0.85rem', color: '#9ca3af' }}>
                  Model hesaplıyor...
                </div>
              ) : predictionResult ? (
                <div
                  style={{
                    backgroundColor: predictionResult.liked_prediction === 1 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(229, 9, 20, 0.15)',
                    border: predictionResult.liked_prediction === 1 ? '1px solid #10b981' : '1px solid #e50914',
                    borderRadius: '8px',
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {predictionResult.liked_prediction === 1 ? (
                      <ThumbsUp size={24} color="#10b981" />
                    ) : (
                      <ThumbsDown size={24} color="#e50914" />
                    )}
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: predictionResult.liked_prediction === 1 ? '#10b981' : '#ff1e27' }}>
                        {predictionResult.liked_prediction === 1 ? 'Yapay Zeka Bu Filmi Öneriyor 👍' : 'Düşük Beğenilme Olasılığı 👎'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                        Model Güven Skoru: %{predictionResult.confidence_score}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Algoritma</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>{predictionResult.model_name}</div>
                  </div>
                </div>
              ) : null}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
