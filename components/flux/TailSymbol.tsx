import type { CSSProperties } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { asset } from "@/lib/asset";
import t from "./tailSymbol.module.css";

/**
 * Header symbol with the hero's pink tail: the official SIENA symbol, with a pink gradient laid over its lower
 * tail and cut to the symbol's own shape (the asset is used as the mask, so the mark itself is never redrawn).
 */
export function TailSymbol({ className = "" }: { className?: string }) {
  return (
    <span className={`${t.wrap} ${className}`} style={{ "--sym": `url(${asset("/brand/siena-symbol-160.webp")})` } as CSSProperties}>
      <BrandLogo variant="symbol" alt="" className={t.img} sizes="32px" priority />
      <span className={t.tail} aria-hidden="true" />
    </span>
  );
}
