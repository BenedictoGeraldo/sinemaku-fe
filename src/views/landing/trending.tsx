"use client";

import { useEffect } from "react";
import { useMovieStore } from "@/store/movieStore";
import MovieCard from "@/components/movieCard";
import MovieCardSkeleton from "@/components/movieCardSkeleton";

export default function TrendingView() {
  const { trendingMovies, trendingLoading, fetchTrendingMovies } =
    useMovieStore();

  useEffect(() => {
    void fetchTrendingMovies();
  }, [fetchTrendingMovies]);

  return (
    <main className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 p-3">
      <div className="mt-8 flex items-center gap-3 col-span-full">
        <span className="inline-block h-8 w-0.75 bg-yellow-400" />
        <h1 className="text-xl md:text-2xl font-semibold tracking-wide">
          Trending Movies
        </h1>
      </div>

      {trendingLoading
        ? Array.from({ length: 12 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))
        : trendingMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
    </main>
  );
}
