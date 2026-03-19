import { create } from "zustand";
import { tmdbInstance } from "@/services/tmdb";
import { Movie, TmdbResponse } from "@/types/movie";

interface MovieStore {
  trendingMovies: Movie[];
  popularMovies: Movie[];
  topRatedMovies: Movie[];
  trendingLoading: boolean;
  popularLoading: boolean;
  topRatedLoading: boolean;
  fetchTrendingMovies: () => Promise<void>;
  fetchPopularMovies: () => Promise<void>;
  fetchTopRatedMovies: () => Promise<void>;
}

export const useMovieStore = create<MovieStore>((set) => ({
  trendingMovies: [],
  popularMovies: [],
  topRatedMovies: [],
  trendingLoading: false,
  popularLoading: false,
  topRatedLoading: false,

  fetchTrendingMovies: async () => {
    try {
      set({ trendingLoading: true });

      const res = await tmdbInstance.get<TmdbResponse>("/movie/now_playing");

      set({
        trendingMovies: res.data.results,
      });
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    } finally {
      set({ trendingLoading: false });
    }
  },

  fetchPopularMovies: async () => {
    try {
      set({ popularLoading: true });

      const res = await tmdbInstance.get<TmdbResponse>("/movie/popular");

      set({ popularMovies: res.data.results });
    } catch (error) {
      console.error(error);
    } finally {
      set({ popularLoading: false });
    }
  },

  fetchTopRatedMovies: async () => {
    try {
      set({ topRatedLoading: true });

      const res = await tmdbInstance.get<TmdbResponse>("/movie/top_rated");
      set({ topRatedMovies: res.data.results });
    } catch (error) {
      console.error(error);
    } finally {
      set({ topRatedLoading: false });
    }
  },
}));
