export const fetcher = (...args) => fetch(...args).then((res) => res.json());
export const apiKey = "3f26965121945eba60b1efde4a5856d9";
const tmdbEndpoint = "https://api.themoviedb.org/3/movie";
const tmdbEndpointSearch = "https://api.themoviedb.org/3/search/movie";

export const tmdbAPI = {
  getMovieList: (type, page = 1) =>
    `${tmdbEndpoint}/${type}?api_key=${apiKey}&page=${page}`,
  getMovieDetail: (movieId) => `${tmdbEndpoint}/${movieId}?api_key=${apiKey}`,
  getMovieMeta: (movieId, type) =>
    `https://api.themoviedb.org/3/movie/${movieId}/${type}?api_key=${apiKey}`,
  getMovieSearch: (query, page) =>
    `${tmdbEndpointSearch}?api_key=${apiKey}&query=${query}&page=${page}`,
  imageOriginal: (url) => `https://image.tmdb.org/t/p/original/${url}`,
  image500: (url) => `https://image.tmdb.org/t/p/w500/${url}`,
};
