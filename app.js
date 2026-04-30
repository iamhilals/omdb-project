const API_KEY = 'c37df076';
const BASE_URL = 'https://www.omdbapi.com/';

const searchInput = document.getElementById('searchInput');
const movieDisplay = document.getElementById('movieDisplay');
const suggestionsList = document.getElementById('suggestionsList');
const featuredSlider = document.getElementById('featuredSlider');
const themeToggle = document.getElementById('themeToggle');

const getPoster = (url) => (url === "N/A" || !url) ? "https://via.placeholder.com/300x450?text=Afiş+Bulunamadı" : url;

window.addEventListener('DOMContentLoaded', () => {
    loadFeatured();

    const savedTheme = localStorage.getItem('theme') || 'cold';
    if (savedTheme === 'warm') {
        document.documentElement.setAttribute('data-theme', 'warm');
        themeToggle.textContent = '🌙 Gece Modu';
    } else {
        themeToggle.textContent = '🌸 Gündüz Modu';
    }

    const last = localStorage.getItem('lastMovieSearch');
    if (last) {
        searchInput.value = last;
        fetchMovies(last);
    }
});

async function loadFeatured() {
    const ids = ['tt7286456', 'tt1375666', 'tt0816692', 'tt0468569', 'tt4154796', 'tt0499549', 'tt0110912', 'tt1877830'];
    featuredSlider.innerHTML = '';
    for (const id of ids) {
        try {
            const res = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${id}`);
            const m = await res.json();
            if (m.Response === "True" && m.Poster !== "N/A") {
                const card = document.createElement('div');
                card.className = 'slider-card';
                card.style.backgroundImage = `url('${m.Poster}')`;
                card.style.backgroundSize = 'cover';
                card.onclick = () => openModal(m.imdbID);
                featuredSlider.appendChild(card);
            }
        } catch (e) { console.error("Slider yükleme hatası:", e); }
    }
}

let debounce;
searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim();
    clearTimeout(debounce);
    if (q.length < 3) {
        suggestionsList.style.display = 'none';
        return;
    }

    debounce = setTimeout(async () => {
        const res = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${q}`);
        const data = await res.json();
        if (data.Search) {
            suggestionsList.innerHTML = data.Search.slice(0, 6).map(m => `
                <div class="suggestion-item" onclick="selectSuggestion('${m.Title.replace(/'/g, "\\'")}')">
                    <img src="${getPoster(m.Poster)}" width="35" height="50" style="border-radius:4px;">
                    <div>
                        <p style="font-size:14px; font-weight:500;">${m.Title}</p>
                        <small style="color:#aaa;">${m.Year}</small>
                    </div>
                </div>`).join('');
            suggestionsList.style.display = 'block';
        }
    }, 300);
});

function selectSuggestion(t) {
    searchInput.value = t;
    suggestionsList.style.display = 'none';
    fetchMovies(t);
}

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            fetchMovies(query);
            suggestionsList.style.display = 'none';
        }
    }
});

async function fetchMovies(q) {
    movieDisplay.innerHTML = '<div class="loader"></div>';
    suggestionsList.style.display = 'none';
    localStorage.setItem('lastMovieSearch', q);

    const type = document.getElementById('typeFilter').value;
    const year = document.getElementById('yearFilter').value;
    const selectedGenre = document.getElementById('genreFilter').value;

    const url = `${BASE_URL}?apikey=${API_KEY}&s=${q}${type ? '&type=' + type : ''}${year ? '&y=' + year : ''}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.Response === "True") {
            movieDisplay.innerHTML = '';
            let foundCount = 0;

            for (const m of data.Search) {
                const dRes = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${m.imdbID}`);
                const d = await dRes.json();

                if (selectedGenre && !d.Genre.includes(selectedGenre)) {
                    continue;
                }

                foundCount++;
                const card = document.createElement('div');
                card.className = 'movie-card';
                card.onclick = () => openModal(m.imdbID);
                card.innerHTML = `
                    <img src="${getPoster(m.Poster)}" loading="lazy">
                    <div class="movie-info">
                        <strong>${m.Title}</strong>
                        <p>${m.Year} | ${d.Genre.split(',')[0]}</p> <!-- Yönetmen yerine türü gösterelim -->
                    </div>`;
                movieDisplay.appendChild(card);
            }

            if (foundCount === 0) {
                movieDisplay.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding: 20px;">Seçilen kategoride sonuç bulunamadı.</p>`;
            }

        } else {
            movieDisplay.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding: 20px;">${data.Error}</p>`;
        }
    } catch (e) {
        movieDisplay.innerHTML = '<p style="grid-column:1/-1; text-align:center;">Bağlantı hatası oluştu.</p>';
    }
}

async function openModal(id) {
    const modal = document.getElementById('movieModal');
    modal.style.display = "block";
    document.getElementById('modalDetails').innerHTML = '<p style="text-align:center;">Yükleniyor...</p>';

    const res = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${id}`);
    const m = await res.json();
    const rCol = parseFloat(m.imdbRating) > 7 ? '#46d369' : '#f5c518';

    document.getElementById('modalDetails').innerHTML = `
        <div style="display:flex; gap:25px; flex-wrap:wrap">
            <img src="${getPoster(m.Poster)}" width="280" style="border-radius:15px; border: 1px solid var(--primary); box-shadow: 0 10px 20px rgba(0,0,0,0.5);">
            <div style="flex:1; min-width:300px;">
                <h2 style="color:var(--primary); margin-bottom:15px; font-size:2rem;">${m.Title} (${m.Year})</h2>
                <p style="margin-bottom:10px"><strong>Yönetmen:</strong> ${m.Director}</p>
                <p style="margin-bottom:10px"><strong>Tür:</strong> ${m.Genre}</p>
                <p style="margin-bottom:10px"><strong>Oyuncular:</strong> ${m.Actors}</p>
                <p><strong>Puan:</strong> <span style="color:${rCol}; font-size:1.3rem; font-weight:bold;">⭐ ${m.imdbRating}</span></p>
                <div style="margin-top:20px; padding-top:20px; border-top:1px solid rgba(255,255,255,0.1);">
                    <p style="font-style:italic; line-height:1.6;">${m.Plot}</p>
                </div>
            </div>
        </div>`;
}

document.getElementById('searchBtn').onclick = () => fetchMovies(searchInput.value);

document.querySelector('.close-button').onclick = () => {
    document.getElementById('movieModal').style.display = "none";
};

document.querySelector('.next').onclick = () => featuredSlider.scrollLeft += 500;
document.querySelector('.prev').onclick = () => featuredSlider.scrollLeft -= 500;

themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');

    if (theme === 'warm') {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.textContent = '🌸 Gündüz Modu';
        localStorage.setItem('theme', 'cold');
    } else {
        document.documentElement.setAttribute('data-theme', 'warm');
        themeToggle.textContent = '🌙 Gece Modu';
        localStorage.setItem('theme', 'warm');
    }
});

window.onclick = (e) => {
    if (e.target.id === 'movieModal') document.getElementById('movieModal').style.display = "none";
    if (e.target !== searchInput) suggestionsList.style.display = 'none';
};