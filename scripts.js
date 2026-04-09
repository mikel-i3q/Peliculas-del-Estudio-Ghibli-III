const moviesContainer = document.getElementById("movies-container");
const favoritesContainer = document.getElementById("favorites-container");
const searchInput = document.getElementById("search-input");

let moviesData = [];
let favorites = [];

function saveFavorites() {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

function addFavorite(movie) {
    if (!favorites.find(fav => fav.id === movie.id)) {
        favorites.push(movie);
        saveFavorites();
        renderFavorites();
        renderMovies(moviesData);
    }
}

function removeFavorite(id) {
    favorites = favorites.filter(fav => fav.id !== id);
    saveFavorites();
    renderFavorites();
    renderMovies(moviesData);
}

function renderFavorites() {
    favoritesContainer.innerHTML = "";

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = `
            <p class="sin-favoritas">Todavía no has añadido ninguna favorita. ¡Pulsa el botón <strong>Favorita</strong> en cualquier película!</p>
        `;
        return;
    }

    favorites.forEach(movie => {
        const card = document.createElement("div");
        card.classList.add("card", "mb-3");
        card.style.width = "18rem";
        card.innerHTML = `
            <img src="${movie.image}" class="card-img-top" alt="${movie.title}">
            <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
                <p class="card-text"><strong>Director:</strong> ${movie.director}</p>
                <p class="card-text"><strong>Año:</strong> ${movie.release_date}</p>
                <p class="card-text"><strong>Puntuación:</strong> ${movie.rt_score}</p>
                <button class="btn btn-danger btn-remove" data-id="${movie.id}">Eliminar</button>
            </div>
        `;
        favoritesContainer.appendChild(card);
    });

    document.querySelectorAll(".btn-remove").forEach(btn => {
        btn.addEventListener("click", () => removeFavorite(btn.dataset.id));
    });
}

function renderMovies(movies) {
    moviesContainer.innerHTML = "";

    if (movies.length === 0) {
        moviesContainer.innerHTML = `<p class="text-muted mt-4">No se ha encontrado ninguna película con ese título.</p>`;
        return;
    }

    movies.forEach(movie => {
        const card = document.createElement("div");
        card.classList.add("card", "mb-3", "m-2");
        card.style.width = "18rem";
        card.innerHTML = `
            <img src="${movie.image}" class="card-img-top" alt="${movie.title}">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${movie.title}</h5>
                <p class="card-text"><strong>Director:</strong> ${movie.director}</p>
                <p class="card-text"><strong>Año:</strong> ${movie.release_date}</p>
                <p class="card-text"><strong>Puntuación:</strong> ${movie.rt_score}</p>
                <button class="btn btn-primary btn-fav mt-auto">${favorites.find(fav => fav.id === movie.id) ? 'Quitar favorita' : 'Favorita'}</button>
            </div>
        `;

        const favButton = card.querySelector(".btn-fav");
        favButton.addEventListener("click", () => {
            if (favorites.find(fav => fav.id === movie.id)) {
                removeFavorite(movie.id);
            } else {
                addFavorite(movie);
            }
        });

        moviesContainer.appendChild(card);
    });
}

function cargarPeliculasAPI() {
    fetch("https://ghibliapi.vercel.app/films")
        .then(res => res.json())
        .then(data => {
            moviesData = data;
            renderMovies(moviesData);

            searchInput.addEventListener("input", (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const filtered = moviesData.filter(movie => movie.title.toLowerCase().includes(searchTerm));
                renderMovies(filtered);
            });
        })
        .catch(error => {
            console.error("Error al conectar con la API:", error);
            moviesContainer.innerHTML = `<p class="text-danger mt-4">Error al cargar las películas. Revisa tu conexión.</p>`;
        });
}

document.addEventListener("DOMContentLoaded", () => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites"));
    if (savedFavorites) {
        favorites = savedFavorites;
    }
    renderFavorites();
    cargarPeliculasAPI();
});
