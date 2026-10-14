import type { Metadata } from "next";
import { Suspense } from "react";
import { TRACKS_DATA, Track } from "@/data/tracks";
import SongPlayerClient from "./SongPlayerClient";
import styles from "./song.module.css";

interface SongPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return TRACKS_DATA.map((t) => ({ id: t.id.toString() }));
}

export async function generateMetadata({
  params,
}: SongPageProps): Promise<Metadata> {
  const { id } = await params;
  const numericId = parseInt(id, 10);
  const track = TRACKS_DATA.find((t) => t.id === numericId) || TRACKS_DATA[0];

  return {
    title: `${track.title} • ${track.artist} | TunedIn Sound Sanctuary`,
    description: `Listen to "${track.title}" from "${track.album}" by ${track.artist}. Mastered in ${track.format} (${track.rate}) with full analog dynamics.`,
    openGraph: {
      title: `${track.title} - ${track.artist}`,
      description: `${track.album} • ${track.rate} ${track.format}`,
    },
  };
}

async function SongContent({ params }: SongPageProps) {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  // Find corresponding track or fallback to first
  const track: Track | undefined = TRACKS_DATA.find((t) => t.id === numericId);
  const selectedTrack = track || TRACKS_DATA[0];

  return <SongPlayerClient initialTrack={selectedTrack} />;
}

export default function SongPage({ params }: SongPageProps) {
  return (
    <Suspense fallback={<div className={styles.pageContainer} />}>
      <SongContent params={params} />
    </Suspense>
  );
}

