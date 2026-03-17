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
          className="w-full rounded-md border border-white/30 py-2 font-semibold"
        >
          Login dengan Google
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
