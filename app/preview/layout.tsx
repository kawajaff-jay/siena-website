import type { Metadata } from "next";
import { PreviewBar } from "./PreviewBar";

/** Design previews — not linked from the site, not indexed. */
export const metadata: Metadata = {
  title: "SIENA — design previews",
  robots: { index: false, follow: false },
};

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <PreviewBar />
    </>
  );
}
