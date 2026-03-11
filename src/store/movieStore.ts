import { create } from "zustand";
import { tmdbInstance } from "@/services/tmdb";
import { Movie, TmdbResponse } from "@/types/movie";

interface MovieStore {
  trendingMovies: Movie[];
  popularMovies: Movie[];
  topRatedMovies: Movie[];
  loading: boolean;
  fetchTrendingMovies: () => Promise<void>;
  fetchPopularMovies: () => Promise<void>;
  fetchTopRatedMovies: () => Promise<void>;
  // fetchAllMovies: () => Promise<void>;
}

export const useMovieStore = create<MovieStore>((set) => ({
  trendingMovies: [],
  popularMovies: [],
  topRatedMovies: [],
  loading: false,

  fetchTrendingMovies: async () => {
    try {
      set({ loading: true });

      const res = await tmdbInstance.get<TmdbResponse>("/movie/now_playing");

      set({
        trendingMovies: res.data.results,
      });
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchPopularMovies: async () => {
    try {
      set({ loading: true });

      const res = await tmdbInstance.get<TmdbResponse>("/movie/popular");

      set({ popularMovies: res.data.results });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  fetchTopRatedMovies: async () => {
    try {
      set({ loading: true });

      const res = await tmdbInstance.get<TmdbResponse>("/movie/top_rated");
      set({ topRatedMovies: res.data.results });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },
}));
