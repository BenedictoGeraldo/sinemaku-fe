import axios from "axios";

export const tmdbInstance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: process.env.NEXT_PUBLIC_API_KEY_TMDB,
  },
});
