import { Movie } from "@/types/movie";
import Image from "next/image";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750";

  return (
    <div className="bg-gray-800 rounded-sm">
      <Image
        src={imageUrl}
        alt={movie.title}
        className=""
        width={200}
        height={300}
      />

      <div className="p-3">
        <h3 className="text-white font-semibold text-sm line-clamp-2">
          {movie.title}
        </h3>

        <p className="text-gray-400 text-xs mt-1">{movie.release_date}</p>
      </div>
    </div>
  );
}
