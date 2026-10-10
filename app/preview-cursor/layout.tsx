import type { Metadata } from "next";
import { CursorBar } from "./CursorBar";

/** Cursor previews — kept apart from the other design previews. Not linked from the site, not indexed. */
export const metadata: Metadata = {
  title: "SIENA — cursor previews",
  robots: { index: false, follow: false },
};

export default function CursorPreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CursorBar />
    </>
  );
}
