import React from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { fetcher, tmdbAPI } from "apiConfig/config";
import { SwiperSlide, Swiper } from "swiper/react";
import MovieCard from "components/movie/MovieCard";

const MovieDetailPage = () => {
  const { movieId } = useParams();
  const { data } = useSWR(tmdbAPI.getMovieDetail(movieId), fetcher);
  // console.log("MovieDetailPage ~ data:", data);
  if (!data) return null;
  const { backdrop_path, poster_path, title, genres, overview } = data;

  return (
    <div className="py-10 px-10">
      <div className="w-full h-[600px] relative mb-10">
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div
          className="w-full h-full bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${tmdbAPI.imageOriginal(backdrop_path)})`,
          }}
        ></div>
      </div>
      <div className="w-full max-w-[800px] h-[400px] mx-auto -mt-[200px] z-10 relative pb-10">
        <img
          src={tmdbAPI.imageOriginal(poster_path)}
          alt=""
          className="w-full h-full object-cover rounded-xl"
        />
      </div>
      <h1 className="text-white text-center text-4xl font-bold mb-10">
        {title}
      </h1>
      <div className="flex justify-center items-center gap-x-5 mb-10">
        {genres.length > 0 &&
          genres.map((item) => (
            <span
              key={item.id}
              className="py-2 px-4 border border-primary text-primary rounded"
            >
              {item.name}
            </span>
          ))}
      </div>
      <p className="text-center leading-relaxed max-w-[600px] mx-auto mb-10">
        {overview}
      </p>
      <MovieMeta type="credits"></MovieMeta>
      <MovieMeta type="videos"></MovieMeta>
      <MovieMeta type="similar"></MovieMeta>
    </div>
  );
};

function MovieMeta({ type }) {
  const { movieId } = useParams();
  const { data } = useSWR(tmdbAPI.getMovieMeta(movieId, type), fetcher);
  if (!data) return null;

  if (type === "credits") {
    const { cast } = data;
    if (!cast || cast.length <= 0) return null;

    return (
      <>
        <h2 className="text-center text-3xl mb-10">Casts</h2>
        <div className="grid grid-cols-4 gap-6 mb-14">
          {cast.slice(0, 4).map((item) => (
            <div className="cast-item" key={item.id}>
              <img
                src={tmdbAPI.imageOriginal(item.profile_path)}
                alt=""
                className="w-full h-[350px] object-cover rounded-lg mb-3"
              />
              <h3 className="font-medium text-xl text-center">{item.name}</h3>
            </div>
          ))}
        </div>
      </>
    );
  } else {
    const { results } = data;
    if (!results || results.length <= 0) return null;
    if (type === "videos") {
      return (
        <div className="py-10 px-10">
          <div className="flex flex-col gap-10">
            {results.slice(0, 2).map((item) => (
              <div className="mb-7" key={item.id}>
                <h3 className="mb-4 text-xl font-medium p-3 bg-secondary inline-block">
                  {item.name}
                </h3>
                <div key={item.id} className="w-full aspect-video">
                  <iframe
                    width="996"
                    height="498"
                    src={`https://www.youtube.com/embed/${item.key}`}
                    title="Youtube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full object-fill"
                  ></iframe>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (type === "similar") {
      return (
        <div className="py-10">
          <h2 className="text-3xl font-medium mb-10">Similar movies</h2>
          <div className="movie-list">
            <Swiper
              grabCursor={"true"}
              spaceBetween={40}
              slidesPerView={"auto"}
            >
              {results.length > 0 &&
                results.map((item) => (
                  <SwiperSlide key={item.id}>
                    <MovieCard item={item}></MovieCard>
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        </div>
      );
    }
    return null;
  }
}

// function MovieCredits() {
//   const { movieId } = useParams();
//   const { data } = useSWR(tmdbAPI.getMovieMeta(movieId, "credits"), fetcher);

//   if (!data) return null;
//   const { cast } = data;
//   if (!cast || cast.length <= 0) return null;

//   return (
//     <>
//       <h2 className="text-center text-3xl mb-10">Casts</h2>
//       <div className="grid grid-cols-4 gap-6 mb-14">
//         {cast.slice(0, 4).map((item) => (
//           <div className="cast-item" key={item.id}>
//             <img
//               src={tmdbAPI.imageOriginal(item.profile_path)}
//               alt=""
//               className="w-full h-[350px] object-cover rounded-lg mb-3"
//             />
//             <h3 className="font-medium text-xl text-center">{item.name}</h3>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }

// function MovieVideos() {
//   const { movieId } = useParams();
//   const { data } = useSWR(tmdbAPI.getMovieMeta(movieId, "videos"), fetcher);
//   if (!data) return null;
//   const { results } = data;
//   if (!results || results.length <= 0) return null;

//   return (
//     <div className="py-10 px-10">
//       <div className="flex flex-col gap-10">
//         {results.slice(0, 2).map((item) => (
//           <div className="mb-7" key={item.id}>
//             <h3 className="mb-4 text-xl font-medium p-3 bg-secondary inline-block">
//               {item.name}
//             </h3>
//             <div key={item.id} className="w-full aspect-video">
//               <iframe
//                 width="996"
//                 height="498"
//                 src={`https://www.youtube.com/embed/${item.key}`}
//                 title="Youtube video player"
//                 frameBorder="0"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//                 allowFullScreen
//                 className="w-full h-full object-fill"
//               ></iframe>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function MovieSimilar() {
//   const { movieId } = useParams();
//   const { data } = useSWR(tmdbAPI.getMovieMeta(movieId, "similar"), fetcher);
//   if (!data) return null;
//   const { results } = data;
//   if (!results || results.length <= 0) return null;

//   return (
//     <div className="py-10">
//       <h2 className="text-3xl font-medium mb-10">Similar movies</h2>
//       <div className="movie-list">
//         <Swiper grabCursor={"true"} spaceBetween={40} slidesPerView={"auto"}>
//           {results.length > 0 &&
//             results.map((item) => (
//               <SwiperSlide key={item.id}>
//                 <MovieCard item={item}></MovieCard>
//               </SwiperSlide>
//             ))}
//         </Swiper>
//       </div>
//     </div>
//   );
// }

export default MovieDetailPage;
