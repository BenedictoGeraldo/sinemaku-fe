import Navbar from "@/components/navbar";
import { SearchMovies } from "@/services/searchMovie";
import { SearchCardClient } from "./searchCard";

type SearchViewProps = {
  query: string;
};

interface MovieItem {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string | null;
  vote_average: number;
  overview: string | null;
}

function MovieSearchCard({ movie }: { movie: MovieItem }) {
  return <SearchCardClient movie={movie} />;
}

async function fetchMovies(query: string): Promise<MovieItem[]> {
  try {
    return await SearchMovies(query);
  } catch {
    throw new Error("Gagal mengambil data film");
  }
}

export default async function SearchView({ query }: SearchViewProps) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return (
      <>
        <Navbar />
        <main className="min-h-[calc(100vh-72px)] px-4 md:px-12 py-6 md:py-8">
          <section className="max-w-6xl mx-auto">
            <div className="mb-6 flex items-center gap-3">
              <span className="inline-block h-8 w-0.75 bg-yellow-400" />
              <h1 className="text-2xl md:text-3xl font-semibold tracking-wide">
                Search
              </h1>
            </div>

            <div className="rounded-md border border-white/10 bg-white/5 px-4 py-8 text-center text-white/70">
              Masukkan kata kunci untuk mencari film.
            </div>
          </section>
        </main>
      </>
    );
  }

  let movies: MovieItem[] = [];
  let hasError = false;

  try {
    movies = await fetchMovies(trimmedQuery);
  } catch {
    hasError = true;
  }

  if (hasError) {
    return (
      <>
        <Navbar />
        <main className="min-h-[calc(100vh-72px)] px-4 md:px-12 py-6 md:py-8">
          <section className="max-w-6xl mx-auto">
            <div className="rounded-md border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              Terjadi kesalahan saat mengambil data film. Silakan coba lagi.
            </div>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <SearchContent query={trimmedQuery} movies={movies} />
    </>
  );
}

function SearchContent({
  query,
  movies,
}: {
  query: string;
  movies: MovieItem[];
}) {
  return (
    <main className="min-h-[calc(100vh-72px)] px-4 md:px-12 py-6 md:py-8">
      <section className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center gap-3">
          <span className="inline-block h-8 w-0.75 bg-yellow-400" />
          <h1 className="text-2xl md:text-3xl font-semibold tracking-wide">
            Hasil Pencarian: {query}
          </h1>
        </div>

        {movies.length === 0 ? (
          <div className="rounded-md border border-white/10 bg-white/5 px-4 py-8 text-center text-white/70">
            Film dengan kata kunci &quot;{query}&quot; tidak ditemukan.
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {movies.map((movie) => (
              <MovieSearchCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
