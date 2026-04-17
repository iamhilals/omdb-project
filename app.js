const API_KEY = 'c37df076'; 
const BASE_URL = 'https://www.omdbapi.com/';
const searchInput = document.getElementById('searchInput');
const movieDisplay = document.getElementById('movieDisplay');
const suggestionsList = document.getElementById('suggestionsList');
const featuredSlider = document.getElementById('featuredSlider');

const getPoster = (url) => (url === "N/A" || !url) ? "https://via.placeholder.com/300x450?text=Afiş+Yok" : url;

window.addEventListener('DOMContentLoaded', () => {
    loadFeatured();
    const last = localStorage.getItem('lastMovieSearch');
    if (last) { searchInput.value = last; fetchMovies(last); }
});

async function loadFeatured() {
    const ids = ['tt7286456', 'tt1375666', 'tt0816692', 'tt0468569', 'tt4154796', 'tt0499549', 'tt0110912', 'tt1877830'];
    featuredSlider.innerHTML = '';
    for (const id of ids) {
        const res = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${id}`);
        const m = await res.json();
        if (m.Response === "True" && m.Poster !== "N/A") {
            const card = document.createElement('div');
            card.className = 'slider-card';
            card.style.backgroundImage = `url('${m.Poster}')`;
            card.onclick = () => openModal(m.imdbID);
            featuredSlider.appendChild(card);
        }
    }
}

let debounce;
searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim();
    clearTimeout(debounce);
    if (q.length < 3) { suggestionsList.style.display='none'; return; }
    debounce = setTimeout(async () => {
        const res = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${q}`);
        const data = await res.json();
        if (data.Search) {
            suggestionsList.innerHTML = data.Search.slice(0, 5).map(m => `
                <div class="suggestion-item" onclick="selectSuggestion('${m.Title.replace(/'/g, "\\'")}')">
                    <img src="${getPoster(m.Poster)}" width="35" height="50">
                    <div><p style="font-size:13px">${m.Title}</p><small style="color:#888">${m.Year}</small></div>
                </div>`).join('');
            suggestionsList.style.display = 'block';
        }
    }, 300);
});

function selectSuggestion(t) { searchInput.value = t; suggestionsList.style.display = 'none'; fetchMovies(t); }

async function fetchMovies(q) {
    movieDisplay.innerHTML = '<p style="grid-column:1/-1; text-align:center;">Yükleniyor...</p>';
    suggestionsList.style.display = 'none';
    localStorage.setItem('lastMovieSearch', q);
    const type = document.getElementById('typeFilter').value;
    const year = document.getElementById('yearFilter').value;
    const url = `${BASE_URL}?apikey=${API_KEY}&s=${q}${type ? '&type='+type : ''}${year ? '&y='+year : ''}`;
    
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.Response === "True") {
            const sorted = data.Search.sort((a,b) => (a.Poster==="N/A" ? 1 : b.Poster==="N/A" ? -1 : 0));
            movieDisplay.innerHTML = '';
            for (const m of sorted) {
                const dRes = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${m.imdbID}`);
                const d = await dRes.json();
                const card = document.createElement('div');
                card.className = 'movie-card';
                card.onclick = () => openModal(m.imdbID);
                card.innerHTML = `<img src="${getPoster(m.Poster)}"><div class="movie-info"><strong>${m.Title}</strong><p>${m.Year} | ${d.Director}</p></div>`;
                movieDisplay.appendChild(card);
            }
        } else { movieDisplay.innerHTML = `<p style="grid-column:1/-1; text-align:center;">${data.Error}</p>`; }
    } catch (e) { console.error(e); }
}

async function openModal(id) {
    const modal = document.getElementById('movieModal');
    modal.style.display = "block";
    const res = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${id}`);
    const m = await res.json();
    const rCol = parseFloat(m.imdbRating) > 7 ? '#46d369' : '#f5c518';
    document.getElementById('modalDetails').innerHTML = `
        <div style="display:flex; gap:25px; flex-wrap:wrap">
            <img src="${getPoster(m.Poster)}" width="280" style="border-radius:8px; box-shadow: 0 5px 15px rgba(0,0,0,0.5);">
            <div style="flex:1; min-width:300px;">
                <h2 style="color:var(--primary); margin-bottom:15px; font-size:2rem;">${m.Title} (${m.Year})</h2>
                <p style="margin-bottom:8px"><strong>Yönetmen:</strong> ${m.Director}</p>
                <p style="margin-bottom:8px"><strong>Tür:</strong> ${m.Genre}</p>
                <p style="margin-bottom:8px"><strong>Oyuncular:</strong> ${m.Actors}</p>
                <p><strong>Puan:</strong> <span style="color:${rCol}; font-size:1.2rem; font-weight:bold;">⭐ ${m.imdbRating}</span></p>
                <div style="margin-top:20px; padding-top:20px; border-top:1px solid #333;">
                    <p style="color:#ccc; font-style:italic; line-height:1.6;">${m.Plot}</p>
                </div>
            </div>
        </div>`;
}

document.getElementById('searchBtn').onclick = () => fetchMovies(searchInput.value);
document.querySelector('.close-button').onclick = () => document.getElementById('movieModal').style.display="none";
document.querySelector('.next').onclick = () => featuredSlider.scrollLeft += 500;
document.querySelector('.prev').onclick = () => featuredSlider.scrollLeft -= 500;

window.onclick = (e) => {
    if (e.target.className === 'modal') document.getElementById('movieModal').style.display="none";
    if (e.target !== searchInput) suggestionsList.style.display = 'none';
};