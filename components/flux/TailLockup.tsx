import type { CSSProperties } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { asset } from "@/lib/asset";
import t from "./tailSymbol.module.css";

/**
 * The official SIENA lockup with the pink tail on the S, as in the header and hero. The tail is a pink gradient cut to
 * the symbol asset's own shape and laid exactly over the symbol inside the lockup (the symbol image maps into the
 * 904 × 850 lockup at 150, 10 at the same scale), so the mark itself is never redrawn.
 */
export function TailLockup({ className = "", sizes, alt }: { className?: string; sizes?: string; alt?: string }) {
  return (
    <span className={`${t.wrap} ${className}`} style={{ "--sym": `url(${asset("/brand/siena-symbol.webp")})` } as CSSProperties}>
      <BrandLogo variant="lockup" sizes={sizes} alt={alt} />
      <span className={`${t.tail} ${t.onLockup}`} aria-hidden="true" />
    </span>
  );
}
