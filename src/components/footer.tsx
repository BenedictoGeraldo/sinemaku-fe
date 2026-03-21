import Link from "next/link";

export default function Footer() {
  return (
    <p className="text-center mt-auto text-xs">
      Build By
      <span className="font-bold text-white text-sm">
        <Link href="https://benedicto-geraldo.vercel.app/" target="_blank">
          {" "}
          Benedicto Geraldo
        </Link>
      </span>
    </p>
  );
}
