import Link from "next/link";
import BrandMark from "./BrandMark";

export default function Brand({ href = "/", label = "RahulVerse home" }: { href?: string; label?: string }) {
  return <Link href={href} className="brand" aria-label={label}>
    <BrandMark />
    <span className="brand-copy">
      <span className="brand-name">RAHUL<span>VERSE</span></span>
      <small>BUILD · RESEARCH · EVOLVE</small>
    </span>
  </Link>;
}
