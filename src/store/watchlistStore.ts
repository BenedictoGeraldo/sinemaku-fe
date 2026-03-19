import { create } from "zustand";
import { getWatchlist } from "@/services/watchlist";

interface WatchlistItem {
  id: string;
  movieId: string;
  title: string;
  poster: string;
  watched: boolean;
}

interface WatchlistState {
  movieIdMap: Record<string, boolean>;
  items: WatchlistItem[];
  unwatchedCount: number;
  loadedForToken: string | null;
  loading: boolean;
  loadForUser: (accessToken: string) => Promise<void>;
  markAsInWatchlist: (movieId: string) => void;
  updateItems: (items: WatchlistItem[]) => void;
}

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  movieIdMap: {},
  items: [],
  unwatchedCount: 0,
  loadedForToken: null,
  loading: false,

  loadForUser: async (accessToken: string) => {
    const state = get();

    // Skip kalau sudah load untuk token yang sama
    if (state.loadedForToken === accessToken && state.items.length > 0) {
      return;
    }

    set({ loading: true });

    try {
      const data = await getWatchlist(accessToken);
      const movieIdMap: Record<string, boolean> = {};
      let unwatchedCount = 0;

      data.forEach((item) => {
        movieIdMap[item.movieId] = true;
        if (!item.watched) unwatchedCount++;
      });

      set({
        items: data,
        movieIdMap,
        unwatchedCount,
        loadedForToken: accessToken,
      });
    } catch (error) {
      console.error("Failed to load watchlist:", error);
    } finally {
      set({ loading: false });
    }
  },

  markAsInWatchlist: (movieId: string) => {
    set((state) => {
      const isNew = !state.movieIdMap[movieId];
      return {
        movieIdMap: {
          ...state.movieIdMap,
          [movieId]: true,
        },
        unwatchedCount: isNew ? state.unwatchedCount + 1 : state.unwatchedCount,
      };
    });
  },

  updateItems: (items: WatchlistItem[]) => {
    const movieIdMap: Record<string, boolean> = {};
    let unwatchedCount = 0;

    items.forEach((item) => {
      movieIdMap[item.movieId] = true;
      if (!item.watched) unwatchedCount++;
    });

    set({
      items,
      movieIdMap,
      unwatchedCount,
    });
  },
}));
