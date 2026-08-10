const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export async function fetchMovies(params = {}) {
  const query = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
      query.append(key, params[key]);
    }
  });
  const res = await fetch(`${API_BASE_URL}/movies?${query.toString()}`);
  if (!res.ok) throw new Error('Filmler yüklenirken hata oluştu.');
  return await res.json();
}

export async function fetchMovieDetail(movieId) {
  const res = await fetch(`${API_BASE_URL}/movies/${movieId}`);
  if (!res.ok) throw new Error('Film detayı bulunamadı.');
  return await res.json();
}

export async function fetchGenres() {
  const res = await fetch(`${API_BASE_URL}/genres`);
  if (!res.ok) throw new Error('Türler yüklenirken hata oluştu.');
  return await res.json();
}

export async function fetchModels() {
  const res = await fetch(`${API_BASE_URL}/models`);
  if (!res.ok) throw new Error('ML modelleri yüklenirken hata oluştu.');
  return await res.json();
}

export async function fetchStats() {
  const res = await fetch(`${API_BASE_URL}/stats`);
  if (!res.ok) throw new Error('İstatistikler yüklenirken hata oluştu.');
  return await res.json();
}

export async function predictMovie(data) {
  const res = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Model tahmini yapılırken hata oluştu.');
  return await res.json();
}

export async function fetchRecommendations(data) {
  const res = await fetch(`${API_BASE_URL}/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('ML film önerileri yüklenirken hata oluştu.');
  return await res.json();
}

// ─── Poster helper ───────────────────────────────────────────────────────────
// Poster URL'lerini backend /api/poster/{tmdb_id} proxy üzerinden çeker.
// TMDB_API_KEY env varı backend'de set edilmişse gerçek poster gelir,
// yoksa güzel renkli placeholder oluşturulur.

const POSTER_CACHE = new Map();

function buildTitleColor(title = '') {
  // Deterministic dark color from title hash for placeholder
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash = title.charCodeAt(i) + ((hash << 5) - hash);
  const h = Math.abs(hash) % 360;
  return `hsl(${h},55%,22%)`;
}

function generateFallbackPoster(title = 'Film') {
  const cleanTitle = title.split('(')[0].trim();
  const short = cleanTitle.substring(0, 18).replace(/[^a-zA-Z0-9 ]/g, '').trim();
  const encoded = encodeURIComponent(short || 'Film');
  const bg = buildTitleColor(title).replace('#', '').replace('hsl(', '').replace(')', '').replace(',', '').replace('%', '').replace(',', '').replace('%', '');
  // Use a simple SVG data URI as fallback — no external service needed
  return generateSvgPoster(cleanTitle);
}

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
  const short = title.substring(0, 20);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750">
    <rect width="500" height="750" fill="${bg}"/>
    <rect x="0" y="0" width="500" height="8" fill="${accent}"/>
    <rect x="0" y="742" width="500" height="8" fill="${accent}"/>
    <circle cx="250" cy="280" r="80" fill="none" stroke="${accent}" stroke-width="3" opacity="0.4"/>
    <text x="250" y="295" font-family="sans-serif" font-size="60" fill="${accent}" text-anchor="middle" opacity="0.6">🎬</text>
    <text x="250" y="430" font-family="sans-serif" font-size="22" fill="#ffffff" text-anchor="middle" font-weight="bold">${short}</text>
    <text x="250" y="470" font-family="sans-serif" font-size="14" fill="${accent}" text-anchor="middle">FILM ÖNERİ SİSTEMİ</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export async function getMoviePosterUrl(tmdbId, title) {
  const cacheKey = tmdbId ? `tmdb_${tmdbId}` : `title_${title}`;

  if (POSTER_CACHE.has(cacheKey)) {
    return POSTER_CACHE.get(cacheKey);
  }

  if (!tmdbId) {
    const fallback = generateFallbackPoster(title);
    POSTER_CACHE.set(cacheKey, fallback);
    return fallback;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/poster/${tmdbId}`);
    if (res.ok) {
      const data = await res.json();
      if (data.poster_url) {
        POSTER_CACHE.set(cacheKey, data.poster_url);
        return data.poster_url;
      }
    }
  } catch (err) {
    // Network error — use fallback
  }

  const fallback = generateFallbackPoster(title);
  POSTER_CACHE.set(cacheKey, fallback);
  return fallback;
}
