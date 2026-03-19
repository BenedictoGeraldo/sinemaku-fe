"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { tmdbInstance } from "@/services/tmdb";
import {
  deleteWatchlist,
  getWatchlist,
  updateWatchlist,
} from "@/services/watchlist";
import type { WatchlistItemWithMeta } from "./types";

type TmdbMovieDetail = {
  vote_average?: number;
  overview?: string;
  release_date?: string;
};

export function useWatchlistController() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [items, setItems] = useState<WatchlistItemWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const accessToken = useMemo(
    () => session?.accessToken,
    [session?.accessToken],
  );

  const loadWatchlist = useCallback(async () => {
    if (!accessToken) return;

    setLoading(true);
    setError("");

    try {
      const watchlistData = await getWatchlist(accessToken);

      const withMovieMeta = await Promise.all(
        watchlistData.map(async (item) => {
          try {
            const { data } = await tmdbInstance.get<TmdbMovieDetail>(
              `/movie/${item.movieId}`,
            );

            return {
              ...item,
              vote_average:
                typeof data.vote_average === "number"
                  ? data.vote_average
                  : null,
              overview:
                typeof data.overview === "string" && data.overview.trim()
                  ? data.overview
                  : "Deskripsi tidak tersedia.",
              release_date:
                typeof data.release_date === "string"
                  ? data.release_date
                  : null,
            };
          } catch {
            return {
              ...item,
              vote_average: null,
              overview: "Deskripsi tidak tersedia.",
              release_date: null,
            };
          }
        }),
      );

      setItems(withMovieMeta);
    } catch {
      setError("Gagal memuat watchlist. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (status === "loading") return;

    if (status !== "authenticated") {
      router.push("/login?callbackUrl=%2Fwatchlist&reason=auth-required");
      return;
    }

    void loadWatchlist();
  }, [status, router, loadWatchlist]);

  const handleToggleWatched = useCallback(
    async (item: WatchlistItemWithMeta) => {
      if (!accessToken) return;

      setBusyId(item.id);

      try {
        const updatedBase = await updateWatchlist(
          item.id,
          { watched: !item.watched },
          accessToken,
        );

        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id
              ? {
                  ...it,
                  watched: updatedBase.watched,
                  updatedAt: updatedBase.updatedAt,
                }
              : it,
          ),
        );

        toast.success(
          updatedBase.watched
            ? "Film ditandai sudah ditonton."
            : "Film ditandai belum ditonton.",
        );
      } catch {
        toast.error("Gagal mengubah status ditonton.");
      } finally {
        setBusyId(null);
      }
    },
    [accessToken],
  );

  const handleDelete = useCallback(
    async (item: WatchlistItemWithMeta) => {
      if (!accessToken) return;

      const result = await Swal.fire({
        title: "Hapus film?",
        text: `"${item.title}" akan dihapus dari watchlist.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus",
        cancelButtonText: "Batal",
        reverseButtons: true,
        background: "#111827",
        color: "#f9fafb",
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#374151",
      });

      if (!result.isConfirmed) return;

      setBusyId(item.id);

      try {
        await deleteWatchlist(item.id, accessToken);
        setItems((prev) => prev.filter((it) => it.id !== item.id));
        toast.success("Item berhasil dihapus.");
      } catch {
        toast.error("Gagal menghapus item.");
      } finally {
        setBusyId(null);
      }
    },
    [accessToken],
  );

  return {
    items,
    loading,
    busyId,
    error,
    handleToggleWatched,
    handleDelete,
  };
}
