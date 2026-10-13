import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OCTAVE - Sound Sanctuary | Specification & Authentication Experience",
  description: "Listen to millions of tracks, curated playlists, and spatial podcasts. Free on Octave.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
