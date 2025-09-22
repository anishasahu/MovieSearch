const API_KEY = "ef8093d3";
const searchBtn = document.getElementById("search-btn");
const movieInput = document.getElementById("movie-input");
const moviesContainer = document.getElementById("movies-container");

const modal = document.getElementById("movie-modal");
const modalBody = document.getElementById("modal-body");
const closeBtn = document.querySelector(".close-btn");

// Fetch movies by search query
async function fetchMovies(query) {
  const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const data = await res.json();
  console.log("API response:", data);
  if (data.Response === "True") {
    displayMovies(data.Search);
  } else {
    moviesContainer.innerHTML = `<p>${data.Error}</p>`;
  }
}

// Fetch detailed movie info by ID
async function fetchMovieDetails(id) {
  const url = `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`;
  const res = await fetch(url);
  return await res.json();
}

// Display movie cards
async function displayMovies(movies) {
  moviesContainer.innerHTML = "";
  for (let movie of movies) {
    const details = await fetchMovieDetails(movie.imdbID);

    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    movieCard.innerHTML = `
      <img src="${details.Poster !== "N/A" ? details.Poster : 'https://via.placeholder.com/200x300'}" alt="${details.Title}">
      <h3>${details.Title} (${details.Year})</h3>
    `;

    // When user clicks a movie card, show modal
    movieCard.addEventListener("click", () => showMovieModal(details));

    moviesContainer.appendChild(movieCard);
  }
}

// Show modal with movie details
function showMovieModal(details) {
  modalBody.innerHTML = `
    <img src="${details.Poster !== "N/A" ? details.Poster : 'https://via.placeholder.com/200x300'}" alt="${details.Title}">
    <h2>${details.Title} (${details.Year})</h2>
    <p><strong>Genre:</strong> ${details.Genre}</p>
    <p><strong>Director:</strong> ${details.Director}</p>
    <p><strong>Actors:</strong> ${details.Actors}</p>
    <p><strong>Plot:</strong> ${details.Plot}</p>
    <p><strong>IMDB Rating:</strong> ${details.imdbRating}</p>
  `;
  modal.style.display = "block";
}

// Close modal when X is clicked
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Close modal when clicking outside the content
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

// Event listeners for search
searchBtn.addEventListener("click", () => {
  const query = movieInput.value.trim();
  if (query) fetchMovies(query);
});

movieInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchBtn.click();
});
