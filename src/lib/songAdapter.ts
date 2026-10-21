import { ISong } from "@/models/song.model";
import { Track } from "@/data/tracks";

/**
 * Format raw duration in seconds to standard MM:SS string.
 */
export function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Maps an ISong MongoDB document to the Track interface used across the studio UI.
 */
export function mapSongToTrack(song: ISong): Track {
  const songId = song._id ? song._id.toString() : String(Math.random());
  const artistText = Array.isArray(song.artist)
    ? song.artist.join(", ")
    : typeof song.artist === "string"
    ? song.artist
    : "Independent Artist";

  const genreText = Array.isArray(song.genre) && song.genre.length > 0
    ? song.genre.join(" • ")
    : "Studio Acoustic";

  const durationSec = typeof song.duration === "number" && song.duration > 0
    ? song.duration
    : 180;

  const isFlac = song.audio_url?.toLowerCase().includes(".flac");
  const isWav = song.audio_url?.toLowerCase().includes(".wav");

  const formatText = isFlac ? "FLAC" : isWav ? "WAV" : "MASTER MP3";
  const rateText = isFlac ? "192kHz / 24-bit" : "48kHz / 320kbps";

  // Format date added
  let dateAdded = "Recently Added";
  if (song.createdAt || song.releasedDate) {
    try {
      const d = new Date(song.createdAt || song.releasedDate);
      dateAdded = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      dateAdded = "Recently Added";
    }
  }

  // Sanitize uploadUser to ensure it is a plain serializable object for Client Components
  let cleanUploadUser:
    | {
        _id?: string;
        username?: string;
        name?: string;
        email?: string;
        avatar?: string;
      }
    | string
    | undefined = undefined;

  if (typeof song.uploadUser === "object" && song.uploadUser !== null) {
    const u = song.uploadUser as Record<string, unknown>;
    cleanUploadUser = {
      _id: u._id ? String(u._id) : undefined,
      username: u.username ? String(u.username) : undefined,
      name: u.name ? String(u.name) : undefined,
      email: u.email ? String(u.email) : undefined,
      avatar: u.avatar ? String(u.avatar) : undefined,
    };
  } else if (typeof song.uploadUser === "string") {
    cleanUploadUser = song.uploadUser;
  }

  // Sanitize aiObservation to plain JSON object
  const cleanAiObservation =
    song.aiObservation && typeof song.aiObservation === "object"
      ? JSON.parse(JSON.stringify(song.aiObservation))
      : undefined;

  // Extract uploader display name
  const uploaderName =
    typeof cleanUploadUser === "object" && cleanUploadUser?.username
      ? `@${cleanUploadUser.username}`
      : typeof cleanUploadUser === "string"
      ? `@user_${cleanUploadUser.slice(-4)}`
      : "@Curator";

  // Build AI liner notes
  let linerNotes = "Recorded in high fidelity with full dynamic acoustics.";
  if (cleanAiObservation && typeof cleanAiObservation === "object") {
    const obsEntries = Object.entries(cleanAiObservation)
      .map(([k, v]) => `${k.toUpperCase()}: ${v}`)
      .join(" • ");
    if (obsEntries) {
      linerNotes = `AI Studio Observation — ${obsEntries}. Preserves authentic uncompressed dynamics.`;
    }
  }

  return {
    id: songId,
    _id: songId,
    title: song.title || "Untitled Master",
    artist: artistText,
    album: song.album || "Studio Single",
    duration: formatDuration(durationSec),
    durationSeconds: durationSec,
    dateAdded,
    format: formatText,
    rate: rateText,
    genre: genreText,
    releaseYear: song.releasedDate
      ? new Date(song.releasedDate).getFullYear().toString()
      : new Date().getFullYear().toString(),
    coverAccent: "#E88C2B",
    coverSecondary: "#FAF8F5",
    vibe: Array.isArray(song.genre) && song.genre[0] ? `${song.genre[0]} Acoustic Master` : "Studio Master Recording",
    poster_url: song.poster_url,
    poster_Id: song.poster_Id,
    audio_url: song.audio_url,
    audio_Id: song.audio_Id,
    verified: song.verified ?? true,
    verificationStatus: song.verificationStatus || "verified",
    plays: song.plays || 0,
    likes: song.likes || 0,
    aiObservation: cleanAiObservation,
    uploadUser: cleanUploadUser,
    lyrics: [
      { time: 0, text: `♪ [Direct Stream: "${song.title}" - ${artistText}] ♪` },
      { time: Math.max(5, Math.floor(durationSec * 0.2)), text: `♪ [Album: ${song.album} • Genre: ${genreText}] ♪` },
      { time: Math.max(15, Math.floor(durationSec * 0.5)), text: `♪ [Curated by ${uploaderName} • Status: ${song.verificationStatus || "verified"}] ♪` },
      { time: Math.max(25, Math.floor(durationSec * 0.8)), text: `♪ [Analog direct stream master on TunedIn] ♪` },
    ],
    telemetry: {
      sampleRate: isFlac ? "192,000 Hz Linear PCM" : "48,000 Hz High Definition",
      bitDepth: isFlac ? "24-bit Studio Master" : "High Bitrate 320kbps Lossless Container",
      dynamicRange: "DR14 High Dynamic Range",
      codec: isFlac ? "FLAC Audiophile Reference" : "MPEG-4 Audio / Lossless Container",
      channels: "2.0 True Stereo Studio Stream",
      recordingStudio: "TunedIn Cloud Vault",
      tapeMachine: "Direct Digital Master Session",
      microphones: "Ribbon & Condenser Reference Pairs",
      masterEngineer: uploaderName,
      linerNotes,
    },
    theme: {
      name: "Studio Amber & Linen",
      accent: "#ffb86d",
      accentHover: "#e88c2b",
      accentGlow: "rgba(255, 184, 109, 0.40)",
      accentSubtle: "rgba(255, 184, 109, 0.14)",
      ambientTop: "rgba(255, 184, 109, 0.18)",
      ambientBottom: "rgba(255, 220, 189, 0.15)",
      canvas: "#FFFFFF",
      surfaceGlass: "rgba(255, 255, 255, 0.85)",
      cardBg: "rgba(255, 255, 255, 0.92)",
      vinylLabel: "radial-gradient(circle, #ffdcbd 0%, #ffb86d 55%, #d97706 100%)",
      vinylBorder: "rgba(255, 255, 255, 0.90)",
      highlightText: "#C2410C",
      textHigh: "#2A1608",
      textMedium: "#6E5343",
      textMuted: "#9C8172",
    },
  };
}
