import type { Metadata } from "next";
import { Redirect } from "@/components/Redirect";
import { asset } from "@/lib/asset";

export const metadata: Metadata = { robots: { index: false } };

/** Direct link to the Evolution story, which opens on top of the homepage (/story?chapter=ai opens at 2026 AI). */
export default function Story() {
  return <Redirect to={asset("/#evolution")} keepChapter />;
}
