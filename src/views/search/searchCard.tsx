"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { addToWatchlist } from "@/services/watchlist";
import { useWatchlistStore } from "@/store/watchlistStore";

function getErrorStatus(error: unknown): number | null {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: unknown }).response === "object" &&
    (error as { response?: { status?: unknown } }).response !== null
  ) {
    const status = (error as { response?: { status?: unknown } }).response
      ?.status;
    return typeof status === "number" ? status : null;
  }

  return null;
}

function getReleaseYear(releaseDate: string | null): string {
  if (!releaseDate) return "-";
  return releaseDate.slice(0, 4);
}

function getRatingLabel(voteAverage: number): string {
  if (!Number.isFinite(voteAverage)) return "IMDb -";
  return `IMDb ${voteAverage.toFixed(1)}`;
}

function getPosterUrl(posterPath: string | null): string {
  if (!posterPath) return "/sinemaku-placeholder.png";
  if (posterPath.startsWith("http")) return posterPath;
  return `https://image.tmdb.org/t/p/w500${posterPath}`;
}

interface MovieItem {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string | null;
  vote_average: number;
  overview: string | null;
}

export function SearchCardClient({ movie }: { movie: MovieItem }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [saving, setSaving] = useState(false);

  const movieIdMap = useWatchlistStore((s) => s.movieIdMap);
  const loadForUser = useWatchlistStore((s) => s.loadForUser);
  const markAsInWatchlist = useWatchlistStore((s) => s.markAsInWatchlist);

  const accessToken = session?.accessToken;
  const movieId = String(movie.id);

  const added = useMemo(
    () => Boolean(movieIdMap[movieId]),
    [movieIdMap, movieId],
  );

  useEffect(() => {
    if (status !== "authenticated") return;
    if (!accessToken) return;

    void loadForUser(accessToken);
  }, [status, accessToken, loadForUser]);

  const handleAddWatchlist = async () => {
    if (status !== "authenticated") {
      toast.warning("Anda perlu login untuk mengakses fitur ini.");
      router.push("/login?callbackUrl=%2Fsearch&reason=auth-required");
      return;
    }

    if (!accessToken) {
      toast.error("Sesi login tidak valid. Silakan login kembali.");
      return;
    }

    setSaving(true);

    try {
      await addToWatchlist(
        {
          movieId,
          title: movie.title,
          poster: movie.poster_path || "/sinemaku-placeholder.png",
          watched: false,
        },
        accessToken,
      );

      markAsInWatchlist(movieId);
      toast.success("Film telah ditambahkan ke watchlist.");
    } catch (error) {
      const statusCode = getErrorStatus(error);

      if (statusCode === 409) {
        markAsInWatchlist(movieId);
        toast.message("Film ini sudah ada di watchlist anda.");
      } else {
        toast.error("Gagal menambahkan film ke watchlist.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="py-5 md:py-6">
      <div className="grid grid-cols-[120px_1fr] gap-3 md:grid-cols-[144px_1fr] md:gap-5">
        <div className="relative h-48 w-[120px] md:h-56 md:w-36 overflow-hidden rounded bg-white/10">
          <button
            type="button"
            onClick={() => void handleAddWatchlist()}
            disabled={saving}
            className="absolute left-2 top-2 z-10 cursor-pointer rounded-full border border-white/20 bg-black/60 p-2 hover:bg-black/80 disabled:opacity-50"
            aria-label="Tambah ke watchlist"
            title="Tambah ke watchlist"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
            >
              <path
                d="M17 3H7a2 2 0 0 0-2 2v16l7-3l7 3V5a2 2 0 0 0-2-2z"
                fill={added ? "#facc15" : "none"}
                stroke={added ? "#facc15" : "#ffffff"}
                strokeWidth="1.7"
              />
            </svg>
          </button>

          <Image
            src={getPosterUrl(movie.poster_path)}
            alt={movie.title}
            fill
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0">
          <h2 className="text-base md:text-xl font-semibold leading-tight">
            {movie.title} ({getReleaseYear(movie.release_date)})
          </h2>

          <p className="mt-2 inline-flex rounded bg-black px-2 py-1 text-[11px] md:text-xs text-white/80">
            {getRatingLabel(movie.vote_average)}
          </p>

          <p className="mt-2 md:mt-3 text-xs md:text-sm text-white/60 line-clamp-4">
            {movie.overview || "Deskripsi tidak tersedia."}
          </p>
        </div>
      </div>
    </article>
  );
}
