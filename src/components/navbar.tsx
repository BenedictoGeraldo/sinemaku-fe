"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  const initials = useMemo(() => {
    const name = session?.user?.name?.trim() || session?.user?.email || "U";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }, [session?.user?.name, session?.user?.email]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!search.trim()) return;

    router.push(`/search?query=${encodeURIComponent(search)}`);
  };

  const handleWatchlistClick = () => {
    if (status !== "authenticated") {
      toast.warning("Anda perlu login untuk mengakses fitur ini.");
      router.push("/login?callbackUrl=%2Fwatchlist&reason=auth-required");
      return;
    } else {
      router.push("/watchlist");
    }
  };

  return (
    <div className="min-w-full h-18 bg-[#2222] flex justify-between items-center p-5 border-b-1 border-white ">
      <Link href="/">
        <Image src={"/logo.png"} alt="Sinemaku" width={200} height={100} />
      </Link>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleWatchlistClick}
          className="cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
          >
            <path
              fill="#A29C1C"
              d="m12 18l-4.2 1.8q-1 .425-1.9-.162T5 17.975V5q0-.825.588-1.412T7 3h10q.825 0 1.413.588T19 5v12.975q0 1.075-.9 1.663t-1.9.162zm0-2.2l5 2.15V5H7v12.95zM12 5H7h10z"
            />
          </svg>
        </button>
        <div>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-md h-8 bg-[#424242] px-3 text-xs w-45 "
              placeholder="Cari film..."
            />
          </form>
        </div>

        {status === "authenticated" ? (
          <div className="flec items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-yellow-500 text-black font-bold grid place-items-center">
              {initials}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-xs px-3 py-2 rounded-md border border-white/30"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="text-xs px-3 py-2 rounded-md border-white/30"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
