"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Track, TRACKS_DATA } from "@/data/tracks";
import styles from "./song.module.css";

interface SongPlayerClientProps {
  initialTrack: Track;
}

export default function SongPlayerClient({ initialTrack }: SongPlayerClientProps) {
  const router = useRouter();
  const [currentTrack, setCurrentTrack] = useState<Track>(initialTrack);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(34);
  const [volume, setVolume] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Adjust state during render when initialTrack prop changes (e.g., URL navigation)
  const [prevTrackId, setPrevTrackId] = useState<number>(initialTrack.id);
  if (initialTrack.id !== prevTrackId) {
    setPrevTrackId(initialTrack.id);
    setCurrentTrack(initialTrack);
    setCurrentTimeSec(0);
  }


  // Audio timer ticker
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTimeSec((prev) => {
        if (prev >= currentTrack.durationSeconds) {
          if (isRepeat) return 0;
          return currentTrack.durationSeconds;
        }
        return prev + 1;
      });
    }, 1000 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, currentTrack.durationSeconds, playbackSpeed, isRepeat]);



  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`;
  };

  // Track switching
  const handleSelectTrack = (track: Track) => {
    setCurrentTrack(track);
    setCurrentTimeSec(0);
    setIsPlaying(true);
    router.push(`/song/${track.id}`);
  };

  const handleNextTrack = () => {
    const currentIndex = TRACKS_DATA.findIndex((t) => t.id === currentTrack.id);
    let nextIndex: number;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * TRACKS_DATA.length);
    } else {
      nextIndex = (currentIndex + 1) % TRACKS_DATA.length;
    }
    handleSelectTrack(TRACKS_DATA[nextIndex]);
  };

  const handlePrevTrack = () => {
    const currentIndex = TRACKS_DATA.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + TRACKS_DATA.length) % TRACKS_DATA.length;
    handleSelectTrack(TRACKS_DATA[prevIndex]);
  };

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSeconds = Math.round(ratio * currentTrack.durationSeconds);
    setCurrentTimeSec(targetSeconds);
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    setVolume(Math.round(ratio * 100));
    setIsMuted(false);
  };

  const cycleSpeed = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
    showToast(`Playback speed set to ${nextSpeed}x`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard! Share the acoustic master.");
    }
  };


  const progressPercent = Math.min(
    100,
    (currentTimeSec / (currentTrack.durationSeconds || 1)) * 100
  );

  const currentTheme = currentTrack.theme || {
    name: "Warm Amber & Honey Ivory",
    accent: "#D97706",
    accentHover: "#B45309",
    accentGlow: "rgba(217, 119, 6, 0.28)",
    accentSubtle: "rgba(217, 119, 6, 0.10)",
    ambientTop: "rgba(245, 158, 11, 0.18)",
    ambientBottom: "rgba(232, 140, 43, 0.10)",
    canvas: "#FAF8F5",
    surfaceGlass: "rgba(255, 255, 255, 0.90)",
    cardBg: "linear-gradient(155deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 244, 237, 0.88) 100%)",
    vinylLabel: "radial-gradient(circle, #F59E0B 0%, #D97706 60%, #92400E 100%)",
    vinylBorder: "#FFFFFF",
    highlightText: "#B45309",
    textHigh: "#1C120C",
    textMedium: "#5C4A42",
    textMuted: "#8C776D",
  };

  const dynamicThemeStyles = {
    "--theme-accent": currentTheme.accent,
    "--theme-accent-hover": currentTheme.accentHover,
    "--theme-accent-glow": currentTheme.accentGlow,
    "--theme-accent-subtle": currentTheme.accentSubtle,
    "--theme-ambient-top": currentTheme.ambientTop,
    "--theme-ambient-bottom": currentTheme.ambientBottom,
    "--theme-canvas": currentTheme.canvas,
    "--theme-surface-glass": currentTheme.surfaceGlass,
    "--theme-card-bg": currentTheme.cardBg,
    "--theme-vinyl-label": currentTheme.vinylLabel,
    "--theme-vinyl-border": currentTheme.vinylBorder,
    "--theme-highlight-text": currentTheme.highlightText,
    "--theme-text-high": currentTheme.textHigh,
    "--theme-text-medium": currentTheme.textMedium,
    "--theme-text-muted": currentTheme.textMuted,
  } as React.CSSProperties;

  return (
    <div className={styles.pageContainer} style={dynamicThemeStyles}>
      {/* ============================================================== */}
      {/* 1. ATMOSPHERIC AMBIENT BACKDROP                                */}
      {/* ============================================================== */}
      <div className={styles.ambientBackdrop} aria-hidden="true">
        <div className={styles.ambientGlowPrimary} />
        <div className={styles.ambientGlowSecondary} />
      </div>

      {/* ============================================================== */}
      {/* 2. TOP STICKY HEADER                                           */}
      {/* ============================================================== */}
      <header className={styles.topHeader}>
        <div className={styles.topHeaderLeft}>
          <Link href="/" className={styles.backBtn}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Studio</span>
          </Link>

          <Link href="/" className={styles.brandLink}>
            <Image
              src="/music-logo-orbit.svg"
              alt="TunedIn Logo"
              width={32}
              height={32}
              className={styles.brandLogo}
              priority
            />
            <span className={styles.brandTitle}>
              TUNED<span className={styles.brandAccent}>IN</span>
            </span>
          </Link>
        </div>

        <div className={styles.topHeaderCenter}>
          <div className={styles.themeMoodBadge}>
            <div className={styles.themeMoodDot} />
            <span>MOOD • {currentTheme.name}</span>
          </div>
          <div className={styles.badgeLiveSession}>
            <div className={styles.liveDot} />
            <span>DIRECT STREAM • {currentTrack.rate}</span>
          </div>
        </div>

        <div className={styles.topHeaderRight}>
          <button
            type="button"
            className={`${styles.actionIconBtn} ${isLiked ? styles.actionIconBtnActive : ""}`}
            onClick={() => {
              setIsLiked(!isLiked);
              showToast(isLiked ? "Removed from Library favorites" : "Added to Library favorites");
            }}
            title={isLiked ? "Remove Favorite" : "Save to Favorites"}
            aria-label="Toggle favorite"
          >
            <svg width="18" height="18" fill={isLiked ? currentTheme.accent : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          <button
            type="button"
            className={styles.actionIconBtn}
            onClick={handleShare}
            title="Share track"
            aria-label="Share track"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>

          <Link href="/profile" className={styles.actionIconBtn} title="My Acoustic Profile" aria-label="My Acoustic Profile">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 3. MAIN STAGE CONTENT (2 COLUMNS)                              */}
      {/* ============================================================== */}
      <main className={styles.mainStage}>
        {/* ============================================================ */}
        {/* LEFT COLUMN: TURNTABLE & HERO AUDIO CONTROLS                 */}
        {/* ============================================================ */}
        <section className={styles.playerStageCard}>
          {/* Turntable Platter Deck */}
          <div className={styles.turntableDeck}>
            <div className={styles.platterBase}>
              {/* Rotating Vinyl Record */}
              <div
                className={`${styles.vinylDisc} ${isPlaying ? styles.vinylDiscPlaying : ""}`}
              >
                <div className={styles.vinylSheen} />
                <div className={styles.vinylCenterLabel}>
                  <div className={styles.vinylSpindleHole} />
                  <span className={styles.labelBrand}>TUNEDIN</span>
                  <span className={styles.labelTrack}>{currentTrack.title}</span>
                  <span className={styles.labelRpm}>33⅓ RPM • {currentTrack.format}</span>
                </div>
              </div>
            </div>

            {/* Realistic Tonearm */}
            <div className={styles.tonearmAssembly}>
              <div className={styles.tonearmPivot}>
                <div className={styles.tonearmPivotCap} />
              </div>
              <div
                className={`${styles.tonearmRod} ${isPlaying ? styles.tonearmRodPlaying : ""}`}
              >
                <div className={styles.tonearmHead}>
                  <div className={styles.tonearmCartridge} />
                </div>
              </div>
            </div>

            {/* Sound Waveform / Visualizer Overlay Badge */}
            <div className={`${styles.visualizerOverlay} ${isPlaying ? styles.visualizerPlaying : ""}`}>
              <div className={styles.spectrumBar} />
              <div className={styles.spectrumBar} />
              <div className={styles.spectrumBar} />
              <div className={styles.spectrumBar} />
              <div className={styles.spectrumBar} />
              <div className={styles.spectrumBar} />
              <div className={styles.spectrumBar} />
              <div className={styles.spectrumBar} />
              <span className={styles.visualizerLabel}>
                {isPlaying ? "ACTIVE ANALOG VU" : "PAUSED"}
              </span>
            </div>
          </div>

          {/* Track Metadata Header */}
          <div className={styles.trackMetadataSection}>
            <h1 className={styles.songTitle}>{currentTrack.title}</h1>
            <div className={styles.artistRow}>
              <span className={styles.artistName}>{currentTrack.artist}</span>
              <span className={styles.metaDot}>•</span>
              <span className={styles.albumName}>{currentTrack.album}</span>
              <span className={styles.metaDot}>•</span>
              <span className={styles.releaseYear}>{currentTrack.releaseYear}</span>
            </div>
          </div>

          {/* Interactive Progress Timeline / Scrubber */}
          <div className={styles.scrubberContainer}>
            <div
              className={styles.scrubberTrack}
              onClick={handleScrubberClick}
              role="slider"
              aria-label="Audio progress scrubber"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progressPercent)}
            >
              <div
                className={styles.scrubberFill}
                style={{ width: `${progressPercent}%` }}
              />
              <div
                className={styles.scrubberThumb}
                style={{ left: `${progressPercent}%` }}
              />
            </div>

            <div className={styles.timecodesRow}>
              <span className={styles.timecodeCurrent}>{formatTime(currentTimeSec)}</span>
              <span>{currentTrack.duration}</span>
            </div>
          </div>

          {/* Primary Transport Controls */}
          <div className={styles.transportSection}>
            <div className={styles.transportMain}>
              <button
                type="button"
                className={`${styles.transportIconBtn} ${isShuffle ? styles.transportIconBtnActive : ""}`}
                onClick={() => {
                  setIsShuffle(!isShuffle);
                  showToast(isShuffle ? "Shuffle disabled" : "Shuffle enabled");
                }}
                title={isShuffle ? "Disable Shuffle" : "Enable Shuffle"}
                aria-label="Shuffle"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H4m0 0l4 4m-4-4l4-4m8 0h4m0 0l-4-4m4 4l-4 4" />
                </svg>
                {isShuffle && <span className={styles.activeIndicatorPip} />}
              </button>

              <button
                type="button"
                className={styles.transportIconBtn}
                onClick={handlePrevTrack}
                title="Previous Track"
                aria-label="Previous Track"
              >
                <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </button>

              {/* Master Play / Pause */}
              <button
                type="button"
                className={styles.masterPlayBtn}
                onClick={() => setIsPlaying(!isPlaying)}
                title={isPlaying ? "Pause Track" : "Play Track"}
                aria-label={isPlaying ? "Pause Track" : "Play Track"}
              >
                {isPlaying ? (
                  <svg width="26" height="26" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg width="26" height="26" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              <button
                type="button"
                className={styles.transportIconBtn}
                onClick={handleNextTrack}
                title="Next Track"
                aria-label="Next Track"
              >
                <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
              </button>

              <button
                type="button"
                className={`${styles.transportIconBtn} ${isRepeat ? styles.transportIconBtnActive : ""}`}
                onClick={() => {
                  setIsRepeat(!isRepeat);
                  showToast(isRepeat ? "Repeat disabled" : "Repeat enabled");
                }}
                title={isRepeat ? "Disable Repeat" : "Enable Repeat"}
                aria-label="Repeat"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {isRepeat && <span className={styles.activeIndicatorPip} />}
              </button>
            </div>

            {/* Bottom Secondary Utility Controls: Speed & Volume */}
            <div className={styles.auxControlsRow}>
              <button
                type="button"
                className={styles.speedSelector}
                onClick={cycleSpeed}
                title="Change Playback Speed"
              >
                {playbackSpeed}x SPEED
              </button>

              <div className={styles.volumeContainer}>
                <button
                  type="button"
                  className={styles.volumeIconBtn}
                  onClick={() => setIsMuted(!isMuted)}
                  title={isMuted ? "Unmute" : "Mute"}
                  aria-label="Mute toggle"
                >
                  {isMuted || volume === 0 ? (
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  )}
                </button>

                <div
                  className={styles.volumeTrack}
                  onClick={handleVolumeClick}
                  role="slider"
                  aria-label="Volume slider"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={isMuted ? 0 : volume}
                >
                  <div
                    className={styles.volumeFill}
                    style={{ width: `${isMuted ? 0 : volume}%` }}
                  />
                  <div
                    className={styles.volumeThumb}
                    style={{ left: `${isMuted ? 0 : volume}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

        </section>
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className={styles.toast} role="status">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={currentTheme.accent}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
