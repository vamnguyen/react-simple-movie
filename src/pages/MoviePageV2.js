import React, { useEffect, useState } from "react";
import { fetcher, tmdbAPI } from "../apiConfig/config";
import MovieCard, { MovieCardSkeleton } from "components/movie/MovieCard";
import useDebounce from "hooks/useDebounce";
import { v4 } from "uuid";
import useSWRInfinite from "swr/infinite";
import Button from "components/button/Button";

const itemsPerPage = 20; // which determines the number of items to display per page.
const MoviePageV2 = () => {
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [nextPage, setNextPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [url, setUrl] = useState(tmdbAPI.getMovieList("popular", nextPage));
  const filterDebounce = useDebounce(filter, 500);
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };
  const { data, isLoading, size, setSize } = useSWRInfinite(
    (index) => url.replace("page=1", `page=${index + 1}`),
    fetcher
  );
  const movies = data
    ? data.reduce(
        (accumulator, currentValue) => accumulator.concat(currentValue.results),
        []
      )
    : [];
  const isEmpty = data?.[0].results?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.results.length < itemsPerPage);

  useEffect(() => {
    if (filterDebounce) {
      setUrl(tmdbAPI.getMovieSearch(filterDebounce, nextPage));
    } else {
      setUrl(tmdbAPI.getMovieList("popular", nextPage));
    }
  }, [filterDebounce, nextPage]);

  useEffect(() => {
    if (!data || !data.total_results) return;
    setPageCount(Math.ceil(data.total_results / itemsPerPage));
  }, [data, itemOffset]);

  return (
    <div className="py-10 px-10 page-container">
      <div className="flex mb-10">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Type here to search..."
            className="w-full p-4 bg-slate-800 text-white outline-none"
            onChange={handleFilterChange}
          />
        </div>
        <button className="p-4 bg-primary text-white rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
      </div>
      {/* {isLoading && (
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent border-t-4 mx-auto animate-spin"></div>
      )} */}
      {isLoading && (
        <div className="grid grid-cols-4 gap-10">
          {new Array(itemsPerPage).fill(0).map(() => (
            <MovieCardSkeleton key={v4()}></MovieCardSkeleton>
          ))}
        </div>
      )}
      <div className="grid grid-cols-4 gap-10">
        {!isLoading &&
          movies.length > 0 &&
          movies.map((item) => (
            <MovieCard key={item.id} item={item}></MovieCard>
          ))}
      </div>
      <div className="mt-10 text-center">
        <Button
          onClick={() => setSize(size + 1)}
          disabled={isReachingEnd}
          className={`${isReachingEnd ? "bg-slate-800" : ""}`}
        >
          Load more
        </Button>
      </div>
      {/* <div className="mt-10">
        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          className="pagination"
        />
      </div> */}
    </div>
  );
};

export default MoviePageV2;
