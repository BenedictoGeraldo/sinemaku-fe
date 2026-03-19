import type { WatchlistItem } from "@/services/watchlist";

export type WatchlistItemWithMeta = WatchlistItem & {
  vote_average: number | null;
  overview: string;
  release_date: string | null;
};
