import Link from "next/link";

export default function Footer() {
  return (
    <p className="text-center mt-auto">
      Build By
      <span className="font-bold text-white">
        <Link href="https://github.com/BenedictoGeraldo" target="_blank">
          {" "}
          Benedicto Geraldo
        </Link>
      </span>
    </p>
  );
}
