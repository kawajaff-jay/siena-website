import type { Metadata } from "next";
import { LogoBar } from "./LogoBar";

/** Logo-interlude previews — kept apart from the other design previews. Not linked from the site, not indexed. */
export const metadata: Metadata = {
  title: "SIENA — logo interlude previews",
  robots: { index: false, follow: false },
};

export default function LogoPreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <LogoBar />
    </>
  );
}
