"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Movie } from "@/types/movie";
import { addToWatchlist } from "@/services/watchlist";
import { useWatchlistStore } from "@/store/watchlistStore";

interface MovieCardProps {
  movie: Movie;
}

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

export default function MovieCard({ movie }: MovieCardProps) {
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

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "sinemaku-placeholder.png";

  const handleAddWatchlist = async () => {
    if (status !== "authenticated") {
      toast.warning("Anda perlu login untuk mengakses fitur ini.");
      router.push("/login?callbackUrl=%2Fwatchlist&reason=auth-required");
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
          poster: movie.poster_path ?? "",
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
    <article className="w-full my-4">
      <div className="relative mx-auto w-full max-w-50 aspect-2/3">
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
          src={imageUrl}
          alt={movie.title}
          fill
          sizes="200px"
          className="rounded-xl object-cover"
        />
      </div>

      <div className="mx-auto mt-3 w-full max-w-50">
        <h3 className="line-clamp-2 text-sm font-semibold text-white">
          {movie.title}
        </h3>
        <p className="mt-1 text-xs text-gray-400">
          {getReleaseYear(movie.release_date)}
        </p>
      </div>
    </article>
  );
}
