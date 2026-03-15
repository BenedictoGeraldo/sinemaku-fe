"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [search, setSearch] = useState("");

  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!search.trim()) return;

    router.push(`/search?query=${encodeURIComponent(search)}`);
  };

  return (
    <div className="min-w-full h-18 bg-[#2222] flex justify-between items-center p-5 border-b-1 border-white ">
      <Link href={"/"}>
        <Image src={"/logo.png"} alt="Sinemaku" width={200} height={100} />
      </Link>
      <div className="flex gap-1">
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
      </div>
    </div>
  );
}
