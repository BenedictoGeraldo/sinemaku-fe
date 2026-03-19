"use client";

import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { useWatchlistStore } from "@/store/watchlistStore";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Get unwatched count from store
  const unwatchedCount = useWatchlistStore((s) => s.unwatchedCount);
  const loadForUser = useWatchlistStore((s) => s.loadForUser);
  const accessToken = session?.accessToken;

  useEffect(() => {
    if (status !== "authenticated" || !accessToken) return;
    void loadForUser(accessToken);
  }, [status, accessToken, loadForUser]);

  const initials = useMemo(() => {
    const name = session?.user?.name?.trim() || session?.user?.email || "U";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }, [session?.user?.name, session?.user?.email]);

  const handleSearch = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!search.trim()) return;

    router.push(`/search?query=${encodeURIComponent(search)}`);
    setSearch("");
    setMobileSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const handleWatchlistClick = () => {
    if (status !== "authenticated") {
      toast.warning("Anda perlu login untuk mengakses fitur ini.");
      router.push("/login?callbackUrl=%2Fwatchlist&reason=auth-required");
      return;
    }
    router.push("/watchlist");
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 w-full max-w-full bg-black/80 backdrop-blur-sm border-b border-white/10">
      <div className="box-border w-full px-3 sm:px-4 md:px-6 lg:px-8 h-16 md:h-18 flex items-center justify-between">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Sinemaku"
            width={150}
            height={60}
            className="w-[120px] sm:w-[140px] md:w-[150px] h-auto"
          />
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-white/10 rounded-lg px-3 py-2 focus-within:ring-1 focus-within:ring-yellow-400/50"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari film..."
              className="bg-transparent text-sm outline-none text-white placeholder-white/50 w-48"
            />
            <button
              type="submit"
              className="ml-2 text-white/70 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </form>

          <button
            type="button"
            onClick={handleWatchlistClick}
            className="relative p-2 text-yellow-400 hover:bg-white/10 rounded-lg transition-colors"
            title="Watchlist"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17 3H7a2 2 0 0 0-2 2v16l7-3l7 3V5a2 2 0 0 0-2-2z" />
            </svg>
            {unwatchedCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                {unwatchedCount > 9 ? "9+" : unwatchedCount}
              </span>
            )}
          </button>

          {status === "authenticated" ? (
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="h-8 w-8 rounded-full bg-yellow-400 text-black text-xs font-bold flex items-center justify-center">
                {initials}
              </div>
              <span className="text-xs text-white/80 max-w-32 truncate hidden lg:block">
                {session?.user?.name || session?.user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs px-3 py-1.5 rounded-md border border-white/30 hover:bg-white/10 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-xs px-6 py-1.5 rounded-md border border-white/30 hover:bg-white/10 transition-colors border-l"
            >
              Login
            </Link>
          )}
        </div>

        <div className="md:hidden flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => {
              setMobileSearchOpen(!mobileSearchOpen);
              setMobileMenuOpen(false);
            }}
            className="p-2 text-white/70 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>

          {/* Mobile Hamburger Menu */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setMobileSearchOpen(false);
            }}
            className="p-2 text-white/70 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="md:hidden w-full bg-gradient-to-b from-black/50 to-black/30 border-t border-white/10 p-3 animate-in fade-in duration-200 overflow-x-hidden">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari film..."
              autoFocus
              className="flex-1 min-w-0 bg-white/10 text-sm rounded-lg px-3 py-2 text-white placeholder-white/50 outline-none border border-white/20"
            />
            <button
              type="submit"
              className="flex-shrink-0 p-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu (Dropdown) */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full bg-gradient-to-b from-black/50 to-black/30 border-t border-white/10 p-3 space-y-2 animate-in fade-in duration-200 overflow-x-hidden">
          {/* Bookmark in Menu */}
          <button
            type="button"
            onClick={handleWatchlistClick}
            className="w-full flex items-center justify-between text-sm px-3 py-2 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            <span>Watchlist</span>
            {unwatchedCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                {unwatchedCount > 9 ? "9+" : unwatchedCount}
              </span>
            )}
          </button>

          <div className="border-t border-white/10" />

          {status === "authenticated" ? (
            <>
              <div className="flex items-center gap-3 py-2 px-1">
                <div className="h-10 w-10 rounded-full bg-yellow-400 text-black text-sm font-bold flex items-center justify-center flex-shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {session?.user?.name || session?.user?.email}
                  </p>
                  <p className="text-xs text-white/50 truncate">
                    {session?.user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left text-sm px-3 py-2 rounded-lg text-white hover:bg-white/10 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="block w-full text-center text-sm px-3 py-2 rounded-lg bg-yellow-500 text-black font-semibold hover:bg-yellow-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
