"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { axiosInstance } from "@/services/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegistrationView() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegistration(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    try {
      await axiosInstance.post("/auth/registration", { name, email, password });

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        router.push("/login");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      setError("Gagal melakukan registrasi. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Registration</h1>

        <form onSubmit={handleRegistration} className="space-y-3">
          <input
            name="name"
            type="text"
            placeholder="Nama"
            required
            className="w-full rounded-md bg-[#424242] px-3 py-2 text-sm"
          />
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
            {loading ? "Loading..." : "Daftar"}
          </button>
        </form>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <p className="text-sm text-center">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
