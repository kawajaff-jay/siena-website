import type { Metadata } from "next";
import { CoreBar } from "./CoreBar";

/** Energy-core previews — kept apart from the other design previews. Not linked from the site, not indexed. */
export const metadata: Metadata = {
  title: "SIENA — energy core previews",
  robots: { index: false, follow: false },
};

export default function CorePreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CoreBar />
    </>
  );
}
