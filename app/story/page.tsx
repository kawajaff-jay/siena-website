import type { Metadata } from "next";
import { Redirect } from "@/components/Redirect";
import { asset } from "@/lib/asset";

export const metadata: Metadata = { robots: { index: false } };

/** Direct link to the Evolution story: the home page, with the story opened full-screen. */
export default function Story() {
  return <Redirect to={asset("/#evolution")} />;
}
