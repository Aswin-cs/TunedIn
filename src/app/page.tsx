"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  dateAdded: string;
  format: string;
  rate: string;
  genre: string;
}

const TRACKS_DATA: Track[] = [
  {
    id: 1,
    title: "Round Midnight (Live Master Session)",
    artist: "The Modern Acoustic Ensemble",
    album: "Verve & Velvet: Analog Sessions",
    duration: "05:42",
    dateAdded: "2 days ago",
    format: "FLAC",
    rate: "192kHz / 24-bit",
    genre: "Vinyl Classics",
  },
  {
    id: 2,
    title: "Symphony No. 5 in C Minor - Allegro con brio",
    artist: "Vienna Philharmonic Orchestra",
    album: "Beethoven: The Master Tapes",
    duration: "07:18",
    dateAdded: "1 week ago",
    format: "DSD",
    rate: "DSD128 Master",
    genre: "Acoustic Masters",
  },
  {
    id: 3,
    title: "Celestial Architecture (Spatial Mix)",
    artist: "Julianna Barwick & Eluvium",
    album: "Acoustic Chambers Vol. II",
    duration: "04:35",
    dateAdded: "3 weeks ago",
    format: "ATMOS",
    rate: "96kHz / 24-bit",
    genre: "Ambient & Spatial",
  },
  {
    id: 4,
    title: "Autumn in New York (Uncompressed Vinyl Rip)",
    artist: "Chet Baker Quartet",
    album: "Midnight Trumpet",
    duration: "03:59",
    dateAdded: "Aug 14, 2026",
    format: "FLAC",
    rate: "192kHz / 24-bit",
    genre: "Vinyl Classics",
  },
  {
    id: 5,
    title: "Kind of Blue (Master Cut Take 2)",
    artist: "Miles Davis Quintet",
    album: "Columbia Master Archives",
    duration: "09:22",
    dateAdded: "Jul 28, 2026",
    format: "FLAC",
    rate: "192kHz / 24-bit",
    genre: "Audiophile FLAC",
  },
  {
    id: 6,
    title: "Subterranean Harmonic Resonance",
    artist: "Nils Frahm",
    album: "Solo Piano in Solitude",
    duration: "06:14",
    dateAdded: "Jun 12, 2026",
    format: "FLAC",
    rate: "96kHz / 24-bit",
    genre: "Acoustic Masters",
  },
];

const SHELVES_DATA = [
  {
    id: "s1",
    title: "Verve & Velvet: Analog Sessions",
    artist: "The Modern Acoustic Ensemble",
    format: "HI-RES FLAC • 24/192",
    tag: "Master Tape",
  },
  {
    id: "s2",
    title: "Late Night Vinyl Chambers",
    artist: "Tokyo String Trio",
    format: "DSD64 STEREO",
    tag: "Audiophile",
  },
  {
    id: "s3",
    title: "Spatial Acoustic Horizon",
    artist: "Max Richter Orchestra",
    format: "DOLBY ATMOS",
    tag: "Studio Pure",
  },
  {
    id: "s4",
    title: "Blue Note Heritage Cut",
    artist: "Herbie Hancock & Wayne Shorter",
    format: "FLAC 192kHz",
    tag: "Master Reissue",
  },
];

export default function HomePage() {
  const [currentTrack, setCurrentTrack] = useState<Track>(TRACKS_DATA[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(34); // %
  const [volume, setVolume] = useState<number>(78);
  const [isLiked, setIsLiked] = useState<boolean>(true);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [activeChip, setActiveChip] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeNav, setActiveNav] = useState<string>("home");

  // Simulated live playback tick
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const filteredTracks = TRACKS_DATA.filter((track) => {
    const matchesSearch =
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.album.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesChip =
      activeChip === "All" || track.genre === activeChip;

    return matchesSearch && matchesChip;
  });

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
  };

  const handleNextTrack = () => {
    const currentIndex = TRACKS_DATA.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % TRACKS_DATA.length;
    handleTrackSelect(TRACKS_DATA[nextIndex]);
  };

  const handlePrevTrack = () => {
    const currentIndex = TRACKS_DATA.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + TRACKS_DATA.length) % TRACKS_DATA.length;
    handleTrackSelect(TRACKS_DATA[prevIndex]);
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.studioLayout}>
        {/* ============================================================== */}
        {/* 1. LEFT COLUMN: PRIMARY NAVIGATION & LIBRARY HUB               */}
        {/* ============================================================== */}
        <aside className={styles.leftSidebar}>
          {/* Brand Header */}
          <Link href="/" className={styles.brandHeader}>
            <div className={styles.brandIcon}>
              <Image
                src="/music-logo-orbit.svg"
                alt="TunedIn Logo"
                width={38}
                height={38}
                className={styles.brandLogoImage}
                priority
              />
            </div>
            <div className={styles.brandTitles}>
              <span className={styles.brandName}>
                TUNED<span className={styles.brandTitleAccent}>IN</span>
              </span>
              <span className={styles.brandTagline}>Architectural Acoustics</span>
            </div>
          </Link>

          {/* Primary Nav Menu */}
          <nav className={styles.navSection}>
            <span className={styles.navLabel}>Menu</span>
            <button
              type="button"
              className={`${styles.navItem} ${activeNav === "home" ? styles.navItemActive : ""}`}
              onClick={() => setActiveNav("home")}
            >
              <svg className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Home Studio</span>
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${activeNav === "explore" ? styles.navItemActive : ""}`}
              onClick={() => setActiveNav("explore")}
            >
              <svg className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Explore Masters</span>
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${activeNav === "radio" ? styles.navItemActive : ""}`}
              onClick={() => setActiveNav("radio")}
            >
              <svg className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <span>Acoustic Radio</span>
            </button>
          </nav>

          {/* Library Section */}
          <div className={styles.navSection}>
            <span className={styles.navLabel}>Library & Collections</span>
            <div className={styles.libraryDivider} />
            <div className={styles.playlistList}>
              <button
                type="button"
                className={`${styles.playlistItem} ${styles.playlistItemActive}`}
              >
                <span>Late Night Vinyl Sessions</span>
                <span className={styles.playlistCount}>34 tracks</span>
              </button>
              <button type="button" className={styles.playlistItem}>
                <span>Acoustic Chambers</span>
                <span className={styles.playlistCount}>18 tracks</span>
              </button>
              <button type="button" className={styles.playlistItem}>
                <span>Analog Warmth & Jazz</span>
                <span className={styles.playlistCount}>42 tracks</span>
              </button>
              <button type="button" className={styles.playlistItem}>
                <span>Hi-Res Lossless Vault</span>
                <span className={styles.playlistCount}>65 tracks</span>
              </button>
              <button type="button" className={styles.playlistItem}>
                <span>Spatial Master Tape Cuts</span>
                <span className={styles.playlistCount}>22 tracks</span>
              </button>
            </div>
          </div>

          {/* Telemetry Footer Badge */}
          <div className={styles.sidebarFooter}>
            <div className={styles.telemetryCard}>
              <div className={styles.telemetryDot} />
              <div className={styles.telemetryText}>
                <span className={styles.telemetryTitle}>DAC DIRECT STREAM</span>
                <span className={styles.telemetrySub}>192kHz • 24-bit • Lossless</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ============================================================== */}
        {/* 2. CENTER CANVAS: DYNAMIC STUDIO / STAGE (FLUID)                */}
        {/* ============================================================== */}
        <main className={styles.centerCanvas}>
          {/* Top Bar with Search & Login Link */}
          <div className={styles.stageTopBar}>
            <div className={styles.searchContainer}>
              <svg className={styles.searchIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search master recordings, artists, or acoustic albums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className={styles.topBarActions}>
              <Link href="/login" className={styles.authButton}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Sign In</span>
              </Link>
            </div>
          </div>

          {/* Genre & Format Filter Chips */}
          <div className={styles.chipsRow}>
            {["All", "Vinyl Classics", "Acoustic Masters", "Audiophile FLAC", "Ambient & Spatial"].map((chip) => (
              <button
                key={chip}
                type="button"
                className={`${styles.chip} ${activeChip === chip ? styles.chipActive : ""}`}
                onClick={() => setActiveChip(chip)}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Hero Featured Showcase Banner */}
          <div className={styles.heroBanner}>
            <div className={styles.heroContent}>
              <div className={styles.heroBadge}>
                <span>FEATURED MASTERWORK</span>
                <span>•</span>
                <span>24-BIT / 192kHz FLAC</span>
              </div>
              <h1 className={styles.heroTitle}>
                Verve &amp; Velvet: Analog Sessions
              </h1>
              <p className={styles.heroDescription}>
                Capturing authentic room acoustic reflections with ribbon microphones on vintage magnetic tape. Engineered for deep auditory depth and tactile warmth.
              </p>
              <div className={styles.heroActions}>
                <button
                  type="button"
                  className={styles.heroPlayBtn}
                  onClick={() => handleTrackSelect(TRACKS_DATA[0])}
                >
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>Play Full Album</span>
                </button>

                <button
                  type="button"
                  className={styles.heroSecondaryBtn}
                  onClick={() => setIsLiked(!isLiked)}
                  title="Save to favorites"
                >
                  <svg width="18" height="18" fill={isLiked ? "#E88C2B" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className={styles.heroArtWrap}>
              <div className={styles.vinylDisc}>
                <div className={styles.vinylCenter}>
                  TUNEDIN
                </div>
              </div>
            </div>
          </div>

          {/* Curated Media Shelves */}
          <section className={styles.shelfSection}>
            <div className={styles.shelfHeader}>
              <h2 className={styles.shelfTitle}>Audiophile Master Shelves</h2>
              <button type="button" className={styles.shelfSeeAll}>View All (28)</button>
            </div>

            <div className={styles.cardsGrid}>
              {SHELVES_DATA.map((item, idx) => (
                <div
                  key={item.id}
                  className={styles.mediaCard}
                  onClick={() => handleTrackSelect(TRACKS_DATA[idx % TRACKS_DATA.length])}
                >
                  <div className={styles.cardArtContainer}>
                    <div className={styles.cardArtPlaceholder}>
                      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                      </svg>
                      <span>{item.tag}</span>
                    </div>
                    <button
                      type="button"
                      className={styles.floatingPlayBtn}
                      aria-label={`Play ${item.title}`}
                    >
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardArtist}>{item.artist}</p>
                  <span className={styles.cardFormat}>{item.format}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Master Studio Tracklist / Table */}
          <section className={styles.shelfSection}>
            <div className={styles.shelfHeader}>
              <h2 className={styles.shelfTitle}>Studio Tracklist</h2>
              <span className={styles.playlistCount}>{filteredTracks.length} tracks available</span>
            </div>

            <table className={styles.tracklistTable}>
              <thead>
                <tr className={styles.tableHeaderRow}>
                  <th style={{ width: 48, textAlign: "center" }}>#</th>
                  <th>TITLE</th>
                  <th>ALBUM</th>
                  <th>DATE ADDED</th>
                  <th style={{ textAlign: "right" }}>DURATION</th>
                </tr>
              </thead>
              <tbody>
                {filteredTracks.map((track, index) => {
                  const isActive = currentTrack.id === track.id;
                  return (
                    <tr
                      key={track.id}
                      className={`${styles.trackRow} ${isActive ? styles.trackRowActive : ""}`}
                      onClick={() => handleTrackSelect(track)}
                    >
                      <td>
                        {isActive && isPlaying ? (
                          <div className={styles.playingAnim}>
                            <div className={styles.playingBar} />
                            <div className={styles.playingBar} />
                            <div className={styles.playingBar} />
                          </div>
                        ) : (
                          <span className={styles.trackIndex}>{index + 1}</span>
                        )}
                      </td>
                      <td>
                        <div className={styles.trackTitleCell}>
                          <span className={styles.trackTitleText}>{track.title}</span>
                          <span className={styles.trackArtistText}>{track.artist}</span>
                        </div>
                      </td>
                      <td>{track.album}</td>
                      <td>{track.dateAdded}</td>
                      <td style={{ textAlign: "right" }}>
                        <span className={styles.trackDuration}>{track.duration}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        </main>

        {/* ============================================================== */}
        {/* 3. RIGHT COLUMN: CONTEXTUAL STUDIO INSPECTOR                   */}
        {/* ============================================================== */}
        <aside className={styles.rightInspector}>
          <div className={styles.inspectorHeader}>
            <span className={styles.inspectorHeading}>Acoustic Telemetry</span>
            <span className={styles.specValue}>{currentTrack.format}</span>
          </div>

          <div className={styles.inspectorArt}>
            <div className={styles.inspectorArtOverlay}>
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#E88C2B">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
          </div>

          <div>
            <h3 className={styles.inspectorTrackTitle}>{currentTrack.title}</h3>
            <p className={styles.inspectorArtist}>{currentTrack.artist}</p>
          </div>

          {/* Telemetry Hardware Specs Card */}
          <div className={styles.specsCard}>
            <div className={styles.specRow}>
              <span className={styles.specLabel}>Sample Rate</span>
              <span className={styles.specValue}>{currentTrack.rate}</span>
            </div>
            <div className={styles.specRow}>
              <span className={styles.specLabel}>Audio Codec</span>
              <span className={styles.specValue}>{currentTrack.format} Lossless</span>
            </div>
            <div className={styles.specRow}>
              <span className={styles.specLabel}>Dynamic Range</span>
              <span className={styles.specValue}>DR14 High Fidelity</span>
            </div>
            <div className={styles.specRow}>
              <span className={styles.specLabel}>Output Destination</span>
              <span className={styles.specValue}>Tube DAC (Direct)</span>
            </div>
          </div>

          {/* Liner Notes & Synchronized Lyrics */}
          <div className={styles.navSection}>
            <span className={styles.navLabel}>Liner Notes &amp; Acoustic Details</span>
            <div className={styles.lyricsSnippet}>
              &ldquo;Recorded at 30 ips onto 2-inch tape with Neumann U47 microphones. Preserves natural room reverberation without artificial limiter compression.&rdquo;
            </div>
          </div>
        </aside>
      </div>

      {/* ============================================================== */}
      {/* 4. FIXED PERSISTENT BOTTOM DOCK (PLAYER CONTROL: 84px)          */}
      {/* ============================================================== */}
      <footer className={styles.bottomDock}>
        {/* Left: Track Info & Favorite Heart */}
        <div className={styles.dockLeft}>
          <div className={styles.dockThumbnail}>
            <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
          <div className={styles.dockTrackInfo}>
            <span className={styles.dockTrackTitle}>{currentTrack.title}</span>
            <span className={styles.dockArtist}>{currentTrack.artist}</span>
          </div>
          <button
            type="button"
            className={`${styles.likeBtn} ${isLiked ? styles.likeBtnActive : ""}`}
            onClick={() => setIsLiked(!isLiked)}
            aria-label="Toggle favorite"
          >
            <svg width="18" height="18" fill={isLiked ? "#E88C2B" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Center: Transport Controls & Audio Scrubber */}
        <div className={styles.dockCenter}>
          <div className={styles.transportRow}>
            {/* Shuffle */}
            <button
              type="button"
              className={`${styles.dockIconBtn} ${isShuffle ? styles.dockIconBtnActive : ""}`}
              onClick={() => setIsShuffle(!isShuffle)}
              title="Shuffle"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H4m0 0l4 4m-4-4l4-4m8 0h4m0 0l-4-4m4 4l-4 4" />
              </svg>
            </button>

            {/* Previous */}
            <button
              type="button"
              className={styles.dockIconBtn}
              onClick={handlePrevTrack}
              title="Previous"
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>

            {/* Master Play / Pause */}
            <button
              type="button"
              className={styles.playPauseCircle}
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Next */}
            <button
              type="button"
              className={styles.dockIconBtn}
              onClick={handleNextTrack}
              title="Next"
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>

            {/* Repeat */}
            <button
              type="button"
              className={`${styles.dockIconBtn} ${isRepeat ? styles.dockIconBtnActive : ""}`}
              onClick={() => setIsRepeat(!isRepeat)}
              title="Repeat"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Interactive Progress Rail */}
          <div className={styles.scrubberRow}>
            <span className={styles.timecode}>02:18</span>
            <div
              className={styles.scrubberTrack}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                setProgress(Math.max(0, Math.min(100, (clickX / rect.width) * 100)));
              }}
            >
              <div
                className={styles.scrubberProgress}
                style={{ width: `${progress}%` }}
              />
              <div
                className={styles.scrubberThumb}
                style={{ left: `${progress}%` }}
              />
            </div>
            <span className={styles.timecode}>{currentTrack.duration}</span>
          </div>
        </div>

        {/* Right: Volume & Aux Tools */}
        <div className={styles.dockRight}>
          <button
            type="button"
            className={styles.dockIconBtn}
            onClick={() => setVolume((v) => (v === 0 ? 75 : 0))}
            title={volume === 0 ? "Unmute" : "Mute"}
          >
            {volume === 0 ? (
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
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              setVolume(Math.max(0, Math.min(100, Math.round((clickX / rect.width) * 100))));
            }}
          >
            <div
              className={styles.volumeProgress}
              style={{ width: `${volume}%` }}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
