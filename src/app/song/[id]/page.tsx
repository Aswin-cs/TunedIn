import type { Metadata } from "next";
import { TRACKS_DATA, Track } from "@/data/tracks";
import SongPlayerClient from "./SongPlayerClient";


interface SongPageProps {
  params: Promise<{ id: string }>;
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

export default async function SongPage({ params }: SongPageProps) {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  // Find corresponding track or fallback to first
  const track: Track | undefined = TRACKS_DATA.find((t) => t.id === numericId);

  // If not found in numeric id, check if default track or 404
  const selectedTrack = track || TRACKS_DATA[0];

  return <SongPlayerClient initialTrack={selectedTrack} />;
}
