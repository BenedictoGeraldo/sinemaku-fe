"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginView() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCredentialsLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Email atau password salah.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <form onSubmit={handleCredentialsLogin} className="space-y-3">
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-md bg-[#424242] px-3 py-2 text-sm"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full rounded-md bg-[#424242] px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-yellow-500 py-2 font-semibold text-black disabled:opacity-60"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full rounded-md border border-white/30 py-2 font-semibold cursor-pointer hover:bg-white/5 flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-5 w-5 shrink-0"
            aria-hidden="true"
          >
            <path
              fill="#FFC107"
              d="M21.805 10.023h-9.18v3.955h5.285c-.228 1.252-.94 2.31-2.007 3.018v2.5h3.24c1.894-1.744 2.987-4.314 2.987-7.352 0-.666-.06-1.306-.325-1.92z"
            />
            <path
              fill="#FF3D00"
              d="M12.625 22c2.7 0 4.965-.893 6.62-2.504l-3.24-2.5c-.893.6-2.035.952-3.38.952-2.596 0-4.795-1.752-5.58-4.11H3.7v2.58A9.997 9.997 0 0 0 12.625 22z"
            />
            <path
              fill="#4CAF50"
              d="M7.045 13.838a5.996 5.996 0 0 1 0-3.675v-2.58H3.7A9.996 9.996 0 0 0 2.625 12c0 1.612.386 3.135 1.075 4.417l3.345-2.58z"
            />
            <path
              fill="#1976D2"
              d="M12.625 6.052c1.47 0 2.79.506 3.83 1.5l2.872-2.872C17.585 3.06 15.325 2 12.625 2A9.997 9.997 0 0 0 3.7 7.582l3.345 2.58c.785-2.357 2.984-4.11 5.58-4.11z"
            />
          </svg>
          <span>Login dengan Google</span>
        </button>

        {error && <p className="text-sm text-red-400 text-center">{error}</p>}

        <p className="text-sm text-center">
          Belum punya akun?{" "}
          <Link href="/registration" className="text-blue-500">
            Daftar disini
          </Link>
        </p>
      </div>
    </main>
  );
}
