"use client";
/** Static-site redirect for retired URLs (GitHub Pages has no server-side redirects). */
import { useEffect } from "react";

export function Redirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${to}`} />
      <p style={{ padding: 32 }}>
        <a href={to}>Continue to SIENA</a>
      </p>
    </>
  );
}
