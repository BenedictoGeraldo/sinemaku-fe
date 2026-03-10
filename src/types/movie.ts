export interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  vote_average: number;
}

export interface TmdbResponse {
  page: number;
  result: Movie[];
  total_pages: number;
  total_results: number;
}
