"use client";

import Navbar from "@/components/navbar";
import WatchlistView from "@/views/watchlist";
import { useWatchlistController } from "@/features/watchlist/useWatchlistController";
import Footer from "@/components/footer";

export default function WatchlistContainer() {
  const controller = useWatchlistController();

  return (
    <>
      <Navbar />
      <WatchlistView
        loading={controller.loading}
        error={controller.error}
        items={controller.items}
        busyId={controller.busyId}
        onToggleWatched={controller.handleToggleWatched}
        onDelete={controller.handleDelete}
      />
      <Footer />
    </>
  );
}
