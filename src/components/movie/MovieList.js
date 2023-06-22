import React from "react";
import MovieCard from "./MovieCard";
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/scss";
import useSWR from "swr";
import { fetcher } from "../../config";
// https://api.themoviedb.org/3/movie/now_playing?api_key=3f26965121945eba60b1efde4a5856d9
const MovieList = ({ type = "now_playing" }) => {
  const { data } = useSWR(
    `https://api.themoviedb.org/3/movie/${type}?api_key=3f26965121945eba60b1efde4a5856d9`,
    fetcher
  );
  const movies = data?.results || [];
  // console.log("MovieList ~ movies:", movies);
  return (
    <div className="movie-list">
      <Swiper grabCursor={"true"} spaceBetween={40} slidesPerView={"auto"}>
        {movies.length > 0 &&
          movies.map((item) => (
            <SwiperSlide key={item.id}>
              <MovieCard item={item}></MovieCard>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default MovieList;
