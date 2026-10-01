import type { Metadata } from "next";
import { Redirect } from "@/components/Redirect";
import { asset } from "@/lib/asset";

export const metadata: Metadata = { robots: { index: false } };

/** Retired: the short version is now the home page. */
export default function Lite() {
  return <Redirect to={asset("/")} />;
}
