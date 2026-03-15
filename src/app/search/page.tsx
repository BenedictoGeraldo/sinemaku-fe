import { tmdbInstance } from "@/services/tmdb";
import { TmdbResponse, Movie } from "@/types/movie";
import MovieCard from "@/components/movieCard";
import Navbar from "@/components/navbar";

type SearchPageProps = {
  searchParams: Promise<{ query?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { query = "" } = await searchParams;
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return (
      <>
        <Navbar />
        <div>Masukan Kata kunci </div>
      </>
    );
  }

  let movies: Movie[] = [];

  try {
    const res = await tmdbInstance.get<TmdbResponse>("/search/movie", {
      params: { query: trimmedQuery },
    });
    movies = res.data.results;
  } catch (error) {
    console.error("API Error:", error);
  }

  if (movies.length === 0) {
    return (
      <>
        <Navbar />
        <div className="mt-2">
          Hasil pencarian untuk {trimmedQuery} tidak ditemukan
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 p-3">
        <h1 className="col-span-full">Hasil Pencarian untuk {trimmedQuery}</h1>

        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </>
  );
}
