import { SearchMovies } from "@/services/searchMovie";
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

  try {
    const movies = await SearchMovies(trimmedQuery);

    if (movies.length === 0) {
      return (
        <>
          <Navbar />
          <div className="p-3">
            Hasil pencarian untuk <strong>{trimmedQuery}</strong> tidak
            ditemukan.
          </div>
        </>
      );
    }
    return (
      <>
        <Navbar />
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 p-3">
          <h1 className="col-span-full">
            Hasil Pencarian untuk {trimmedQuery}
          </h1>

          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </>
    );
  } catch {
    return (
      <>
        <Navbar />
        <div className="p-3">
          Terjadi kesalahan saat mengambil data film. Silahkan coba lagi
        </div>
      </>
    );
  }
}
