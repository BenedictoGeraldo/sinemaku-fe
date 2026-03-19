"use client";

export default function MovieCardSkeleton() {
  return (
    <article className="w-full my-4 animate-pulse">
      <div className="mx-auto w-full max-w-50 aspect-2/3 rounded-xl bg-white/10" />

      <div className="mx-auto mt-3 w-full max-w-50">
        <div className="h-4 w-5/6 rounded bg-white/10" />
        <div className="mt-2 h-3 w-1/3 rounded bg-white/10" />
      </div>
    </article>
  );
}
