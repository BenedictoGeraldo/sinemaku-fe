"use client";

import Image from "next/image";
import type { WatchlistItemWithMeta } from "@/features/watchlist/types";

type WatchlistViewProps = {
  loading: boolean;
  error: string;
  busyId: string | null;
  items: WatchlistItemWithMeta[];
  onToggleWatched: (item: WatchlistItemWithMeta) => Promise<void>;
  onDelete: (item: WatchlistItemWithMeta) => Promise<void>;
};

const posterUrl = (poster: string) => {
  if (!poster || poster === "/sinemaku-placeholder.png") {
    return "/sinemaku-placeholder.png";
  }
  if (poster.startsWith("http")) return poster;
  return `https://image.tmdb.org/t/p/w500${poster}`;
};

const releaseYear = (releaseDate: string | null) =>
  releaseDate ? releaseDate.slice(0, 4) : "-";

const ratingLabel = (voteAverage: number | null) =>
  voteAverage === null ? "IMDb -" : `IMDb ${voteAverage.toFixed(1)}`;

export default function WatchlistView({
  loading,
  error,
  busyId,
  items,
  onToggleWatched,
  onDelete,
}: WatchlistViewProps) {
  return (
    <main className="min-h-[calc(100vh-72px)] px-4 md:px-12 py-6 md:py-8">
      <section className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center gap-3">
          <span className="inline-block h-8 w-0.75 bg-yellow-400" />
          <h1 className="text-2xl md:text-3xl font-semibold tracking-wide">
            Watchlist
          </h1>
        </div>

        {loading && (
          <div className="text-sm text-white/70">Memuat watchlist...</div>
        )}

        {!loading && error && (
          <div className="rounded-md border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="mt-5 rounded-md border border-white/10 bg-white/5 px-4 py-8 text-center text-white/70">
            Watchlist kamu masih kosong. Jelajahi film dan tambahkan ke dalam
            watchlist.
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="divide-y divide-white/10">
            {items.map((item) => (
              <article key={item.id} className="py-5 md:py-6">
                <div className="grid grid-cols-[88px_1fr] gap-3 md:grid-cols-[96px_1fr_auto] md:gap-5">
                  <div className="h-32 w-22 md:h-36 md:w-24 overflow-hidden rounded bg-white/10">
                    <Image
                      src={posterUrl(item.poster)}
                      alt={item.title}
                      width={96}
                      height={144}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-base md:text-xl font-semibold leading-tight wrap-break-word">
                      {item.title} ({releaseYear(item.release_date)})
                    </h2>

                    <p className="mt-2 inline-flex rounded bg-black px-2 py-1 text-[11px] md:text-xs text-white/80">
                      {ratingLabel(item.vote_average)}
                    </p>

                    <p className="mt-2 md:mt-3 text-xs md:text-sm text-white/60 line-clamp-4">
                      {item.overview}
                    </p>
                  </div>

                  <div className="col-span-2 md:col-span-1 mt-2 md:mt-0 flex flex-wrap gap-2 md:justify-end md:self-start">
                    <button
                      type="button"
                      onClick={() => void onToggleWatched(item)}
                      disabled={busyId === item.id}
                      className={[
                        "rounded px-3 py-2 text-xs font-semibold disabled:opacity-50 border transition-colors",
                        item.watched
                          ? "border-emerald-900 bg-emerald-950/70 text-emerald-200"
                          : "border-emerald-500 text-emerald-400 hover:bg-emerald-500/10",
                      ].join(" ")}
                    >
                      {item.watched ? "Sudah Ditonton" : "Tandai Ditonton"}
                    </button>

                    <button
                      type="button"
                      onClick={() => void onDelete(item)}
                      disabled={busyId === item.id}
                      className="rounded border border-red-500 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
