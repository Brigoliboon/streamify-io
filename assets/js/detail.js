"use strict";

import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";

import { sidebar } from "./sidebar.js";

import { createMovieCard } from "./movie-card.js";

import { search } from "./search.js";

const paramsId = new URLSearchParams(window.location.search);
const Idfromquery = paramsId.get('id')
const movieId = /*window.localStorage.getItem("movieId")*/Idfromquery;

const pageContent = document.querySelector("[page-content]");
sidebar();

const getGenres = function (genreList) {
  const newGenreList = [];

  for (const { name } of genreList) newGenreList.push(name);
  return newGenreList.join(", ");
};

const getCasts = function (castList) {
  const newCastList = [];

  for (let i = 0, len = castList.length; i < len && len && i < 10; i++) {
    const { name } = castList[i];
    newCastList.push(name);
  }
  return newCastList.join(", ");
};

const getDirectors = function (crewList) {
  const directors = crewList.filter(({ job }) => job === "Director");

  const directorList = [];
  for (const { name } of directors) directorList.push(name);
  return directorList.join(", ");
};

// returns only trailers and teasers as array
const filterVideos = function (videoList) {
  return videoList.filter(
    ({ type, site }) =>
      (type === "Trailer" || type === "Teaser") && site === "YouTube"
  );
};

fetchDataFromServer(
  `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=casts,videos,images,releases`,
  function (movie) {
    const {
      backdrop_path,
      poster_path,
      title,
      release_date,
      runtime,
      vote_average,
      releases: {
        countries: [{ certification }],
      },
      genres,
      overview,
      casts: { cast, crew },
      videos: { results: videos },
      key,
    } = movie;
    document.title = `${title} - Streamify-io`;
    const titleSlug = title.replaceAll(" ", "-").toLowerCase();
    let url = "https://streamify-io.netlify.app/detail";
    const NewUrl = `https://streamify-io.netlify.app/detail?movie=${titleSlug}&id=${movieId}`;
    window.history.pushState({}, '', NewUrl);
    window.localStorage.setItem('title',title)
    window.localStorage.setItem('year',release_date)
    window.localStorage.setItem('about',overview)
    const movieDetail = document.createElement("div");
    movieDetail.classList.add("movie-detail");
    movieDetail.innerHTML = `
                <html prefix="og: https://ogp.me/ns#">
                  <head>
                  <meta property="og:title" content="${title} - Streamify-io">
                  <meta property="og:type" content="image.poster" />
                  <meta property="og:description" content="${overview}">
                  <meta property="og:image" content="${imageBaseURL}${
                    "w1280" || "original"
                  }${backdrop_path || poster_path}">
                  <meta property="og:url" content="${NewUrl}">
                  </head>
                </html>
                <div id="overlay" onclick="off()">
                <center><div class="movie-body">
                <h1>${title} (${release_date.split("-")[0]})</h1>
                <center><iframe class="movie-container" src="https://vidsrc.to/embed/movie/${movieId}" allowfullscreen="1" frameborder="0" style="height:350px; width:700px; margin-top:30px;"></iframe></center>
                </div></center>
                </div>
                <div 
                class="backdrop-image" 
                style="background-image: url('${imageBaseURL}${
      "w1280" || "original"
    }${backdrop_path || poster_path}')">
                </div>

                <figure class="poster-box movie-poster">
                <img
                    src="${imageBaseURL}w342${poster_path}"
                    alt="${title} poster"
                    class="img-cover"
                />
                </figure>
                <div class="detail-box">
                <div class="detail-content">
                    <h1 class="heading">${title}</h1>

                    <div class="meta-list">
                    <div class="meta-item">
                        <img
                        src="./assets/images/star.png"
                        width="20"
                        height="20"
                        alt="rating"
                        />
                        <span class="span">${vote_average.toFixed(1)}</span>
                    </div>

                    <div class="separator"></div>

                    <div class="meta-item">${runtime}m</div>

                    <div class="separator"></div>

                    <div class="meta-item">${release_date.split("-")[0]}</div>

                    <div class="meta-item card-badge">${certification}</div>
                    </div>

                    <p class="genre">${getGenres(genres)}</p>

                    <p class="overview">${overview}</p>

                    <ul class="detail-list">
                    <div class="list-item">
                        <p class="list-name">Starring</p>
                        <p>${getCasts(cast)}</p>
                    </div>

                    <div class="list-item">
                        <p class="list-name">Directed By</p>
                        <p>${getDirectors(crew)}</p>
                    </div>
                    </ul>
                </div>

                <div class="title-wrapper">
                    <h3 class="title-large">Trailer and Clips</h3>
                    <a class="watch-button" href="./watch.html">Watch Movie <i class="fa-regular fa-circle-play"></i></a>
                </div>
                <div class="slider-list">
                    <div class="slider-inner">
                    </div>
                </div>
                </div>
    `;

    for (const { key, name } of filterVideos(videos)) {
      const videoCard = document.createElement("div");
      videoCard.classList.add("video-card");

      videoCard.innerHTML = `
        <iframe width="500px" height="294px" src="https://www.youtube.com/embed/${key}?&theme=dark&color=white&rel=0" frameborder="0" allowfullscreen="1" title="${name}" class="img-cover" loading="lazy"></iframe>
        `;

      movieDetail.querySelector("div.slider-inner").appendChild(videoCard);
    }

    pageContent.appendChild(movieDetail);

    fetchDataFromServer(
      `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${api_key}&page=1`,
      addSuggestedMovies
    );
  }
);

const addSuggestedMovies = function ({ results: movieList }, title) {
  const movieListElem = document.createElement("section");
  movieListElem.classList.add("movie-list");
  movieListElem.ariaLabel = "You May Also Like";

  movieListElem.innerHTML = `
    <div class="title-wrapper">
      <h3 class="title-large">You May Also Like</h3>
    </div>

    <div class="slider-list">
      <div class="slider-inner"></div>
    </div>
  `;

  for (const movie of movieList) {
    // Called from movie_card.js
    const movieCard = createMovieCard(movie);

    movieListElem.querySelector(".slider-inner").appendChild(movieCard);
  }
  pageContent.appendChild(movieListElem);
};

search();
