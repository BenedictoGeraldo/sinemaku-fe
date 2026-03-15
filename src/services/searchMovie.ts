import axios from "axios";
import { tmdbInstance } from "@/services/tmdb";
import { Movie, TmdbResponse } from "@/types/movie";

export async function SearchMovies(query: string): Promise<Movie[]> {
  try {
    const res = await tmdbInstance.get<TmdbResponse>("/search/movie", {
      params: { query },
    });

    return res.data.results;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("TMDB API Error:", error.message);
    } else {
      console.error("Unknown search Error:", error);
    }

    throw new Error("Gagal menambil data film");
  }
}
