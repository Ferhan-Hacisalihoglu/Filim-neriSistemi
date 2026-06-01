// ─────────────────────────────────────────────
// FORM FONKSİYONLARI
// ─────────────────────────────────────────────

function updateYearDisplay() {
    const slider = document.getElementById('year');
    const display = document.getElementById('yearValue');
    if (slider && display) {
        display.textContent = slider.value;
    }
}

function updateScoreDisplay(element) {
    const minSlider = document.getElementById('minScore');
    const maxSlider = document.getElementById('maxScore');
    const minDisplay = document.getElementById('minScoreValue');
    const maxDisplay = document.getElementById('maxScoreValue');

    if (minSlider && maxSlider) {
        let minVal = parseFloat(minSlider.value);
        let maxVal = parseFloat(maxSlider.value);

        // En az 1 puan farkı zorla (arayüzden kesinlikle değiştirilemesin)
        if (maxVal - minVal < 1.0) {
            if (element && element.id === 'minScore') {
                // Eğer minScore değiştirildiyse ve fark 1'den azaldıysa, onu geri it
                minSlider.value = (maxVal - 1.0).toFixed(1);
                minVal = parseFloat(minSlider.value);
            } else if (element && element.id === 'maxScore') {
                // Eğer maxScore değiştirildiyse ve fark 1'den azaldıysa, onu geri it
                maxSlider.value = (minVal + 1.0).toFixed(1);
                maxVal = parseFloat(maxSlider.value);
            }
        }

        if (minDisplay) minDisplay.textContent = minVal.toFixed(1);
        if (maxDisplay) maxDisplay.textContent = maxVal.toFixed(1);
    }
}

function resetForm() {
    document.getElementById('formSection').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('loadingIndicator').style.display = 'none';
    document.getElementById('recommendationsList').innerHTML = '';
    if(document.getElementById('loadMoreContainer')) {
        document.getElementById('loadMoreContainer').style.display = 'none';
    }
    document.getElementById('recommendForm').reset();
    updateYearDisplay();
    updateScoreDisplay(); // Slider değerlerini ekrana yansıtmak için eklendi
    // Film arama alanını sıfırla
    const movieSearch = document.getElementById('movieSearch');
    const selectedMovieId = document.getElementById('selectedMovieId');
    const selectedMovieBadge = document.getElementById('selectedMovieBadge');
    if (movieSearch) { movieSearch.style.display = ''; movieSearch.value = ''; }
    if (selectedMovieId) { selectedMovieId.value = ''; }
    if (selectedMovieBadge) { selectedMovieBadge.style.display = 'none'; }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

let visibleGenresCount = 20;

function loadMoreGenres() {
    const genreChips = document.querySelectorAll('.genre-chip');
    const totalGenres = genreChips.length;
    
    // 10 tane daha göster
    const nextLimit = visibleGenresCount + 10;
    
    for (let i = visibleGenresCount; i < nextLimit && i < totalGenres; i++) {
        genreChips[i].style.display = 'flex'; // veya flex, css'ine bağlı. Normalde flex.
    }
    
    visibleGenresCount = nextLimit;
    
    if (visibleGenresCount >= totalGenres || visibleGenresCount >= 100) {
        document.getElementById('loadMoreGenresContainer').style.display = 'none';
    }
}

// ─────────────────────────────────────────────
// FİLM ARAMA AUTOCOMPLETE
// ─────────────────────────────────────────────

let _searchTimeout = null;

function initMovieSearch() {
    const searchInput = document.getElementById('movieSearch');
    const dropdown = document.getElementById('movieSearchDropdown');
    const hiddenInput = document.getElementById('selectedMovieId');
    const badge = document.getElementById('selectedMovieBadge');
    const badgeName = document.getElementById('selectedMovieName');
    const removeBtn = document.getElementById('removeSelectedMovie');

    if (!searchInput) return; // Bu sayfa arama barını içermiyor

    // Input olayı — debounce ile 5+ harf sonra arama yap
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();

        clearTimeout(_searchTimeout);
        dropdown.style.display = 'none';
        dropdown.innerHTML = '';

        if (query.length < 5) return;

        _searchTimeout = setTimeout(async () => {
            try {
                const resp = await fetch(`/api/search_movies?q=${encodeURIComponent(query)}`);
                const data = await resp.json();
                renderSearchResults(data.results || []);
            } catch (err) {
                console.error('Film arama hatası:', err);
            }
        }, 300);
    });

    // Sonuçları dropdown'a render et
    function renderSearchResults(results) {
        dropdown.innerHTML = '';

        if (results.length === 0) {
            dropdown.innerHTML = '<div class="search-no-result">Sonuç bulunamadı</div>';
            dropdown.style.display = 'block';
            return;
        }

        results.forEach(movie => {
            const genreTags = (movie.genre_names || [])
                .map(g => `<span class="genre-tag">${g}</span>`)
                .join('');

            const ratingStr = movie.avg_rating ? `⭐ ${movie.avg_rating}` : '';

            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.innerHTML = `
                <div style="flex:1;min-width:0;">
                    <div class="search-result-title">${movie.title}</div>
                    <div class="search-result-meta">
                        <span>${movie.year}</span>
                        ${genreTags}
                    </div>
                </div>
                ${ratingStr ? `<span class="search-result-rating">${ratingStr}</span>` : ''}
            `;
            item.addEventListener('click', () => selectMovie(movie));
            dropdown.appendChild(item);
        });

        dropdown.style.display = 'block';
    }

    // Film seçildiğinde
    function selectMovie(movie) {
        hiddenInput.value = movie.movieId;
        badgeName.textContent = `🎬 ${movie.title} (${movie.year})`;
        badge.style.display = 'inline-flex';
        searchInput.value = '';
        searchInput.style.display = 'none';
        dropdown.style.display = 'none';
        dropdown.innerHTML = '';
    }

    // Seçimi kaldır
    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            hiddenInput.value = '';
            badge.style.display = 'none';
            badgeName.textContent = '';
            searchInput.style.display = '';
            searchInput.value = '';
            searchInput.focus();
        });
    }

    // Dropdown dışı tıklayınca kapat
    document.addEventListener('click', function(e) {
        if (!e.target.closest('#movieSearchWrapper')) {
            dropdown.style.display = 'none';
        }
    });
}

// ─────────────────────────────────────────────
// FORM SUBMIT
// ─────────────────────────────────────────────

let currentOffset = 0;
let currentFormData = null;
const PAGE_LIMIT = 10;

const _recommendForm = document.getElementById('recommendForm');
if (_recommendForm) {
_recommendForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const selectedGenres = formData.getAll('genres');

    // --- YENİ: Tür zorunluluğu ve limit kontrolü ---
    if (selectedGenres.length === 0) {
        alert("Lütfen en az bir film türü seçiniz!");
        return;
    }
    if (selectedGenres.length > 5) {
        alert("En fazla 5 adet film türü seçebilirsiniz!");
        return;
    }
    // -------------------------------------

    // Seçili film ID'si
    const selectedMovieId = document.getElementById('selectedMovieId')?.value || '';

    currentFormData = {
        preferred_year: parseInt(document.getElementById('year').value),
        selected_genres: selectedGenres,
        min_score: parseFloat(document.getElementById('minScore')?.value || 0),
        max_score: parseFloat(document.getElementById('maxScore')?.value || 10),
        selected_movie_id: selectedMovieId ? parseInt(selectedMovieId) : null
    };
    
    currentOffset = 0;

    // UI güncelle
    document.getElementById('formSection').style.display = 'none';
    document.getElementById('loadingIndicator').style.display = 'block';
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('recommendationsList').innerHTML = '';

    await fetchRecommendations();
});
}

async function fetchRecommendations() {
    const data = {
        ...currentFormData,
        offset: currentOffset,
        limit: PAGE_LIMIT
    };

    console.log('Gönderilen veri:', data);

    try {
        const response = await fetch('/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.error || 'Bir hata oluştu');
        }

        displayRecommendations(result.recommendations, currentOffset === 0);

        const loadMoreContainer = document.getElementById('loadMoreContainer');
        if (loadMoreContainer) {
            // Sadece 1 defa daha fazlası yüklenebilir (toplam 20 film)
            if (currentOffset >= PAGE_LIMIT) {
                loadMoreContainer.style.display = 'none';
            } else {
                loadMoreContainer.style.display = result.has_more ? 'block' : 'none';
            }
        }

    } catch (error) {
        console.error('Hata:', error);
        showError(error.message);
    } finally {
        document.getElementById('loadingIndicator').style.display = 'none';
    }
}

async function loadMore() {
    currentOffset += PAGE_LIMIT;
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    if (loadMoreContainer) {
        loadMoreContainer.style.display = 'none';
    }
    
    // Geçici yükleme göstergesi
    const loadingBtn = document.createElement('div');
    loadingBtn.id = 'tempLoading';
    loadingBtn.className = 'loading-text';
    loadingBtn.innerHTML = 'AI model çalışıyor<span class="dots"></span>';
    loadingBtn.style.textAlign = 'center';
    loadingBtn.style.marginTop = '20px';
    document.getElementById('recommendationsList').appendChild(loadingBtn);
    
    await fetchRecommendations();
    
    const tempLoading = document.getElementById('tempLoading');
    if (tempLoading) {
        tempLoading.remove();
    }
}

// ─────────────────────────────────────────────
// SONUÇLARI GÖSTER
// ─────────────────────────────────────────────

function displayRecommendations(recommendations, isFirstLoad = true) {
    const container = document.getElementById('recommendationsList');
    
    if (isFirstLoad) {
        container.innerHTML = '';
    }

    if (isFirstLoad && (!recommendations || recommendations.length === 0)) {
        showError('Hiç film önerisi bulunamadı. Lütfen kriterleri değiştirerek deneyin.');
        return;
    }

    recommendations.forEach((movie, index) => {
        const posterUrl = movie.poster_url || '';
        const posterAlt = movie.title ? `${movie.title} poster` : 'Movie poster';

        // Genre etiketleri
        const genres = Array.isArray(movie.genre_names) && movie.genre_names.length
            ? movie.genre_names.slice(0, 4)
            : [];

        const genreHTML = genres
            .map(g => `<span class="genre-tag">${g}</span>`)
            .join('');

        const globalIndex = index + currentOffset;

        // Rank renkleri
        let rankClass = '';
        if (globalIndex === 0) rankClass = 'gold';
        else if (globalIndex === 1) rankClass = 'silver';
        else if (globalIndex === 2) rankClass = 'bronze';

        const imdbLink = movie.imdbId ? `<a href="https://www.imdb.com/title/tt${movie.imdbId}/" target="_blank" class="movie-link imdb-link" title="IMDb'de Aç">IMDb</a>` : '';
        const tmdbLink = movie.tmdbId ? `<a href="https://www.themoviedb.org/movie/${movie.tmdbId}" target="_blank" class="movie-link tmdb-link" title="TMDb'de Aç">TMDb</a>` : '';
        const linksHtml = (imdbLink || tmdbLink) ? `<div class="movie-links">${imdbLink}${tmdbLink}</div>` : '';

        const card = document.createElement('div');
        card.className = 'movie-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.cursor = 'pointer';
        card.onclick = () => window.location.href = `/movie/${movie.movieId}`;
        card.innerHTML = `
            <div class="movie-poster" id="poster-${movie.movieId}">
                ${posterUrl
                    ? `<img src="${posterUrl}" alt="${posterAlt}" loading="lazy">`
                    : `<div class="poster-fallback"><span>POSTER</span></div>`
                }
            </div>
            <div class="movie-body">
                <div class="movie-title">${movie.title}</div>
                <div class="movie-year">${movie.year}</div>
                ${genreHTML ? `<div class="movie-genres">${genreHTML}</div>` : ''}
                ${linksHtml}
            </div>
            <div class="movie-side">
                <div class="avg-rating-label">RATING</div>
                <div class="avg-rating-value">${movie.avg_rating || '—'}</div>
            </div>
        `;

        // Poster img hata yönetimi (sunucudan gelen URL için)
        const posterImg = card.querySelector('.movie-poster img');
        if (posterImg) {
            posterImg.addEventListener('error', () => {
                const wrapper = posterImg.closest('.movie-poster');
                if (wrapper) {
                    wrapper.innerHTML = `<div class="poster-fallback">${movie.title.substring(0,2)}</div>`;
                }
            });
        }

        container.appendChild(card);

        // Eğer poster URL yoksa TMDb'den asenkron yükle
        if (!posterUrl && movie.tmdbId) {
            loadPosterAsync(movie.movieId, movie.tmdbId);
        }
    });

    document.getElementById('resultsSection').style.display = 'block';
    if (isFirstLoad) {
        window.scrollTo({
            top: document.getElementById('resultsSection').offsetTop - 40,
            behavior: 'smooth'
        });
    }
}

// ─────────────────────────────────────────────
// HATA GÖSTERME
// ─────────────────────────────────────────────

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    errorText.textContent = message;
    errorDiv.style.display = 'block';

    document.getElementById('formSection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'none';

    errorDiv.scrollIntoView({ behavior: 'smooth' });
}

// ─────────────────────────────────────────────
// TMDb POSTER ASYNC YÜKLEME
// ─────────────────────────────────────────────

// TMDb poster cache (tmdbId -> posterUrl string)
const _tmdbCache = {};

async function loadPosterAsync(movieId, tmdbId) {
    if (!tmdbId) return;

    // Cache kontrolü
    if (_tmdbCache[tmdbId] !== undefined) {
        updatePosterElement(movieId, _tmdbCache[tmdbId]);
        return;
    }

    try {
        // TMDb public API — ücretsiz, kayıt gerektirmez (demo key)
        const TMDB_KEY = '8265bd1679663a7ea12ac168da84d2e8';
        const resp = await fetch(
            `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_KEY}&language=tr-TR`,
            { signal: AbortSignal.timeout(5000) }
        );
        if (resp.ok) {
            const data = await resp.json();
            const posterPath = data.poster_path || '';
            const posterUrl = posterPath
                ? `https://image.tmdb.org/t/p/w342${posterPath}`
                : '';
            _tmdbCache[tmdbId] = posterUrl;
            updatePosterElement(movieId, posterUrl);
        } else {
            _tmdbCache[tmdbId] = '';
            updatePosterElement(movieId, '');
        }
    } catch (err) {
        _tmdbCache[tmdbId] = '';
        updatePosterElement(movieId, '');
    }
}

function updatePosterElement(movieId, posterUrl) {
    const wrapper = document.getElementById(`poster-${movieId}`);
    if (!wrapper) return;
    if (posterUrl) {
        const img = document.createElement('img');
        img.src = posterUrl;
        img.alt = 'Movie poster';
        img.loading = 'lazy';
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.4s ease';
        img.addEventListener('load', () => { img.style.opacity = '1'; });
        img.addEventListener('error', () => {
            wrapper.innerHTML = '<div class="poster-fallback">No Image</div>';
        });
        wrapper.innerHTML = '';
        wrapper.appendChild(img);
    } else {
        wrapper.innerHTML = '<div class="poster-fallback">No Image</div>';
    }
}

// ─────────────────────────────────────────────
// İLK YÜKLEME
// ─────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function() {
    updateYearDisplay();
    initMovieSearch();

    // Max 5 genre seçimi limiti
    const genreCheckboxes = document.querySelectorAll('.genre-input');
    genreCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedCount = document.querySelectorAll('.genre-input:checked').length;
            if (checkedCount > 5) {
                this.checked = false; // Son seçileni geri al
                alert("En fazla 5 adet film türü seçebilirsiniz!");
            }
        });
    });

    // API sağlık kontrolü
    fetch('/health')
        .then(r => r.json())
        .then(data => console.log('✓ API hazır:', data))
        .catch(err => console.error('✗ API kontrol hatası:', err));
});
