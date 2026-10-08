import type { Metadata } from "next";
import { Redirect } from "@/components/Redirect";
import { asset } from "@/lib/asset";

export const metadata: Metadata = { robots: { index: false } };

/** Direct link to the Evolution story, which now lives on the classic home (/story?chapter=ai opens at 2026 AI). */
export default function Story() {
  return <Redirect to={asset("/preview/classic.html#evolution")} keepChapter />;
}
