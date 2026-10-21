import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { TRACKS_DATA, Track } from "@/data/tracks";
import { connectDb } from "@/config/connectDb";
import { Song, ISong } from "@/models/song.model";
import { mapSongToTrack } from "@/lib/songAdapter";
import mongoose from "mongoose";
import SongPlayerClient from "./SongPlayerClient";
import styles from "./song.module.css";

interface SongPageProps {
  params: Promise<{ id: string }>;
}

async function getTrackById(id: string): Promise<Track> {
  const numericId = parseInt(id, 10);
  if (!isNaN(numericId) && numericId.toString() === id) {
    const staticTrack = TRACKS_DATA.find((t) => t.id === numericId);
    if (staticTrack) return staticTrack;
  }

  try {
    await connectDb();
    if (mongoose.Types.ObjectId.isValid(id)) {
      const songDoc = await Song.findById(id)
        .populate("uploadUser", "name username email avatar")
        .lean();
      if (songDoc) {
        return mapSongToTrack(songDoc as unknown as ISong);
      }
    }
  } catch (error) {
    console.error("Failed to load song from database:", error);
  }

  return TRACKS_DATA[0];
}

export async function generateMetadata({
  params,
}: SongPageProps): Promise<Metadata> {
  await connection();
  const { id } = await params;
  const track = await getTrackById(id);

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
  await connection();
  const { id } = await params;
  const selectedTrack = await getTrackById(id);
  const plainTrack: Track = JSON.parse(JSON.stringify(selectedTrack));

  return <SongPlayerClient initialTrack={plainTrack} />;
}

export default function SongPage({ params }: SongPageProps) {
  return (
    <Suspense fallback={<div className={styles.pageContainer} />}>
      <SongContent params={params} />
    </Suspense>
  );
}
