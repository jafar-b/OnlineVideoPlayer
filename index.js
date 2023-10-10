// Consts
const apikey = "97037c13cb583df804d4f91dbe9c6385";
// const apikey = "7543524441a260664a97044b8e2dc621";
const youtubeApikey = "AIzaSyDpgOqRhQ6H1Z9jQanld1oLfCsPHZvtGWY";
const apiEndpoint = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";

const apiPaths = {
  fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apikey}`,
  fetchMoviesList: (id) =>
    `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
  fetchTrending: `${apiEndpoint}/trending/all/day?api_key=${apikey}&language=en-US`,
  searchOnYoutube: (query) =>
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyC0SZJkHFX-fQ7NrsxdI4l4mGwYuY4l7P8`,
  fetchTrailer: (id) => {},
};

// Boots up the app
function init() {
  fetchTrendingMovies();
  fetchAndBuildAllSections();
}

function fetchTrendingMovies() {
  fetchAndbuildMovieSection(apiPaths.fetchTrending, "Trending Now")
    .then((list) => {
      const randomIndex = parseInt(Math.random() * list.length);
      buildBannerSection(list[randomIndex]);
    })
    .catch((err) => {
      console.error(err);
    });
}

function buildBannerSection(movie) {
  const bannerCont = document.getElementById("banner-section");
  bannerCont.style.backgroundImage = `url('${imgPath}${movie.backdrop_path}')`;
  const div = document.createElement("div");
    div.innerHTML = `<h2 class="banner__title">${movie.title}</h2>
  <p class="banner__info">Trending in movies | Released - ${movie.release_date}</p>
  <p class="banner__overview">${movie.overview}</p>
            <div class="action-buttons-cont">
               <button class="action-button" id="play"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard"><path d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z" fill="currentColor"></path></svg> &nbsp;&nbsp; Play</button>
            </div>
        `;
  div.className = "banner-content container";
  bannerCont.append(div);
}

function fetchAndBuildAllSections() {
  fetch(apiPaths.fetchAllCategories)
    .then((res) => res.json())
    .then((res) => {
      const categories = res.genres;
      if (Array.isArray(categories) && categories.length) {
        categories.forEach((category) => {
          fetchAndbuildMovieSection(
            apiPaths.fetchMoviesList(category.id),
            category.name
          );
        });
      }

    })
    .catch((err) => console.error(err));
}

function fetchAndbuildMovieSection(fetchUrl, categoryName) {
  console.log(fetchUrl, categoryName);
  return fetch(fetchUrl)
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      const movies = res.results;
      if (Array.isArray(movies) && movies.length) {
        buildMoviesSection(movies.slice(0, 6), categoryName);
      }
      return movies;
    })
    .catch((err) => console.error(err));
}

function buildMoviesSection(list, categoryName) {
  console.log(list, categoryName);
  const moviesCont = document.getElementById("movies-cont");
  const moviesListHTML = list
    .map((item) => {
      return `
        <div class="tooltip">
        <span class="tooltiptext"> Movie:${item.title} <br> Description: ${item.overview}<br> 
        </span>
        <div class="movie-item" onmouseenter="searchMovieTrailer('${item.title}', 'yt${item.id}')">
        <img class="move-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.title}" />
        <div class="iframe-wrap" id="yt${item.id}"></div>
          </div> 
          </div>`;
    })
    .join("");

  const moviesSectionHTML = `
        <h2 class="movie-section-heading">${categoryName} <span class="explore-nudge">Explore All</span></span></h2>
        <div class="movies-row">
            ${moviesListHTML}        
        </div>
    `;

  const div = document.createElement("div");
  div.className = "movies-section";
  div.innerHTML = moviesSectionHTML;

  // append html into movies container
  moviesCont.append(div);
}

function searchMovieTrailer(movieName, iframId) {
  if (!movieName) return;

  fetch(apiPaths.searchOnYoutube(movieName))
    .then((res) => res.json())
    .then((res) => {
      const bestResult = res.items[0];

      const elements = document.getElementById(iframId);
      console.log(elements, iframId);

      const div = document.createElement("div");
      div.innerHTML = `<iframe width="245px" height="150px" src="https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&controls=0"></iframe> `;

      elements.append(div);
    })
    .catch((err) => console.log(err));
}

window.addEventListener("load", function () {
  init();

  window.addEventListener("scroll", function () {
    // header ui update
    const header = document.getElementById("header");
    if (window.scrollY > 5) header.classList.add("black-bg");
    else header.classList.remove("black-bg");
  });
});
