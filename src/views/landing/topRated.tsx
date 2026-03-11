"use client";

import { useEffect } from "react";
import { useMovieStore } from "@/store/movieStore";
import MovieCard from "@/components/movieCard";

export default function TopRatedView() {
  const { topRatedMovies, fetchTopRatedMovies } = useMovieStore();

  useEffect(() => {
    fetchTopRatedMovies();
  }, [fetchTopRatedMovies]);

  return (
    <main className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 p-3">
      <h1 className="text-3xl col-span-full text-center">Top Rated Movies</h1>
      {topRatedMovies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </main>
  );
}
