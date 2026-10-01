"use client";
/** Static-site redirect for retired URLs (GitHub Pages has no server-side redirects). */
import { useEffect } from "react";

/** keepChapter: /story?chapter=ai → <to>/ai (deep link into the Evolution story) */
export function Redirect({ to, keepChapter = false }: { to: string; keepChapter?: boolean }) {
  useEffect(() => {
    let target = to;
    if (keepChapter) {
      const ch = new URLSearchParams(window.location.search).get("chapter") || window.location.hash.replace(/^#/, "");
      if (ch && /^[a-z]+$/.test(ch)) target = `${to}/${ch}`;
    }
    window.location.replace(target);
  }, [to, keepChapter]);
  return (
    <>
      {!keepChapter && <meta httpEquiv="refresh" content={`0;url=${to}`} />}
      <p style={{ padding: 32 }}>
        <a href={to}>Continue to SIENA</a>
      </p>
    </>
  );
}
