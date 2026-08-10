import React, { useState, useEffect, useCallback } from 'react';
import { Star, Play, Sparkles } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Global poster cache (module-level, shared across all cards)
const POSTER_CACHE = new Map();
// Track in-flight requests to avoid duplicate fetches
const POSTER_FETCHING = new Map();

function generateSvgPoster(title) {
  const colors = [
    ['#1a1a2e', '#e94560'],
    ['#16213e', '#0f3460'],
    ['#0f0f0f', '#c0392b'],
    ['#1b1b2f', '#2c3e50'],
    ['#1e1e1e', '#6c3483'],
    ['#131313', '#1a5276'],
    ['#1c1c1c', '#117864'],
  ];
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash = title.charCodeAt(i) + ((hash << 5) - hash);
  const [bg, accent] = colors[Math.abs(hash) % colors.length];
  const short = title.split('(')[0].trim().substring(0, 22);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750">
    <rect width="500" height="750" fill="${bg}"/>
    <rect x="0" y="0" width="500" height="8" fill="${accent}"/>
    <rect x="0" y="742" width="500" height="8" fill="${accent}"/>
    <circle cx="250" cy="300" r="90" fill="${accent}" opacity="0.08"/>
    <circle cx="250" cy="300" r="60" fill="none" stroke="${accent}" stroke-width="3" opacity="0.35"/>
    <text x="250" y="320" font-family="sans-serif" font-size="56" text-anchor="middle" opacity="0.55">🎬</text>
    <text x="250" y="450" font-family="Arial,sans-serif" font-size="22" fill="#ffffff" text-anchor="middle" font-weight="bold">${short}</text>
    <text x="250" y="490" font-family="sans-serif" font-size="13" fill="${accent}" text-anchor="middle" opacity="0.8">CINEMA AI</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

async function fetchPosterUrl(tmdbId, title) {
  const cacheKey = tmdbId ? `tmdb_${tmdbId}` : `title_${title}`;

  if (POSTER_CACHE.has(cacheKey)) return POSTER_CACHE.get(cacheKey);

  // Deduplicate concurrent requests for same tmdb_id
  if (POSTER_FETCHING.has(cacheKey)) return POSTER_FETCHING.get(cacheKey);

  if (!tmdbId) {
    const fb = generateSvgPoster(title || 'Film');
    POSTER_CACHE.set(cacheKey, fb);
    return fb;
  }

  const promise = fetch(`${API_BASE_URL}/poster/${tmdbId}`)
    .then(r => r.ok ? r.json() : null)
    .then(data => {
      const url = (data && data.poster_url) ? data.poster_url : generateSvgPoster(title || 'Film');
      POSTER_CACHE.set(cacheKey, url);
      POSTER_FETCHING.delete(cacheKey);
      return url;
    })
    .catch(() => {
      const fb = generateSvgPoster(title || 'Film');
      POSTER_CACHE.set(cacheKey, fb);
      POSTER_FETCHING.delete(cacheKey);
      return fb;
    });

  POSTER_FETCHING.set(cacheKey, promise);
  return promise;
}

export default function MovieCard({ movie, onSelect, recommendationScore }) {
  const [posterUrl, setPosterUrl] = useState(() => {
    // Synchronous cache hit — no loading flash
    const key = movie.tmdb_id ? `tmdb_${movie.tmdb_id}` : `title_${movie.title}`;
    return POSTER_CACHE.get(key) || null;
  });
  const [posterLoaded, setPosterLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchPosterUrl(movie.tmdb_id, movie.title).then(url => {
      if (!cancelled) setPosterUrl(url);
    });
    return () => { cancelled = true; };
  }, [movie.tmdb_id, movie.title]);

  const ratingFormatted = movie.avg_movie_rating ? movie.avg_movie_rating.toFixed(1) : 'N/A';

  return (
    <div
      onClick={() => onSelect(movie)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: '#141722',
        borderRadius: '10px',
        overflow: 'hidden',
        border: isHovered ? '1px solid #e50914' : '1px solid #232738',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 12px 25px rgba(229, 9, 20, 0.3)' : '0 4px 12px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      {/* Poster Image Container */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '148%', overflow: 'hidden', backgroundColor: '#0e1017' }}>

        {/* Shimmer loading skeleton */}
        {!posterLoaded && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, #1a1f2e 25%, #232a3a 50%, #1a1f2e 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.4s infinite',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: '8px'
          }}>
            <div style={{ fontSize: '2rem', opacity: 0.3 }}>🎬</div>
          </div>
        )}

        {/* Actual Poster Image */}
        {posterUrl && (
          <img
            src={posterUrl}
            alt={movie.title}
            loading="lazy"
            onLoad={() => setPosterLoaded(true)}
            onError={() => {
              // If remote image fails, fall back to SVG placeholder
              const fb = generateSvgPoster(movie.title);
              setPosterUrl(fb);
              setPosterLoaded(true);
            }}
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease, opacity 0.3s ease',
              transform: isHovered ? 'scale(1.08)' : 'scale(1)',
              opacity: posterLoaded ? 1 : 0
            }}
          />
        )}

        {/* Dark overlay on hover */}
        <div
          style={{
            position: 'absolute', inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.25s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <div style={{ backgroundColor: '#e50914', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(229, 9, 20, 0.8)' }}>
            <Play size={24} fill="#ffffff" color="#ffffff" style={{ marginLeft: '4px' }} />
          </div>
        </div>

        {/* Top-Left Rating Badge */}
        <div
          style={{
            position: 'absolute', top: '8px', left: '8px',
            backgroundColor: 'rgba(14, 16, 23, 0.85)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255, 184, 0, 0.5)',
            color: '#ffb800', fontSize: '0.75rem', fontWeight: 800,
            padding: '2px 8px', borderRadius: '4px',
            display: 'flex', alignItems: 'center', gap: '4px'
          }}
        >
          <Star size={11} fill="#ffb800" /> {ratingFormatted}
        </div>

        {/* Top-Right Year Badge */}
        {movie.year && (
          <div
            style={{
              position: 'absolute', top: '8px', right: '8px',
              backgroundColor: 'rgba(14, 16, 23, 0.85)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#e2e8f0', fontSize: '0.72rem', fontWeight: 700,
              padding: '2px 6px', borderRadius: '4px'
            }}
          >
            {movie.year}
          </div>
        )}

        {/* ML Score Badge */}
        {recommendationScore !== undefined && (
          <div
            style={{
              position: 'absolute', bottom: '8px', left: '8px', right: '8px',
              backgroundColor: 'rgba(229, 9, 20, 0.9)',
              color: '#ffffff', fontSize: '0.72rem', fontWeight: 800,
              padding: '4px 8px', borderRadius: '4px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
            }}
          >
            <Sparkles size={12} color="#ffb800" /> ML Skoru: %{(recommendationScore * 100).toFixed(0)}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <h3
            style={{
              fontSize: '0.9rem', fontWeight: 700,
              color: isHovered ? '#ff1e27' : '#ffffff',
              marginBottom: '6px', lineHeight: 1.3,
              display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.4em'
            }}
            title={movie.title}
          >
            {movie.title}
          </h3>

          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {(movie.genres || []).slice(0, 2).map((g) => (
              <span key={g} style={{ fontSize: '0.68rem', backgroundColor: '#1d2232', color: '#9ca3af', padding: '2px 6px', borderRadius: '4px', border: '1px solid #2b3248' }}>
                {g}
              </span>
            ))}
            {(movie.genres || []).length > 2 && (
              <span style={{ fontSize: '0.68rem', color: '#6b7280' }}>+{movie.genres.length - 2}</span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #1c2030', fontSize: '0.72rem', color: '#6b7280' }}>
          <span>{movie.rating_count ? `${Math.round(movie.rating_count)} oy` : 'Yeni'}</span>
          <span style={{ color: '#e50914', fontWeight: 600 }}>İncele</span>
        </div>
      </div>

      {/* Shimmer keyframe */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
