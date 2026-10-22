"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Track, TRACKS_DATA } from "@/data/tracks";
import { ISong } from "@/models/song.model";
import { mapSongToTrack } from "@/lib/songAdapter";
import { useMusicPlayer } from "@/context/MusicPlayerContext";
import styles from "./page.module.css";

export default function HomePage() {
  const { data: session, status } = useSession();

  const {
    currentTrack,
    isPlaying,
    currentTimeSec,
    progress,
    volume,
    isMuted,
    isShuffle,
    isRepeat,
    isLiked,
    playTrack,
    togglePlay,
    seekPercent,
    nextTrack,
    prevTrack,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    setQueue,
  } = useMusicPlayer();

  // Songs fetched from MongoDB (song.model.ts)
  const [dbSongs, setDbSongs] = useState<Track[]>([]);
  const [isLoadingSongs, setIsLoadingSongs] = useState<boolean>(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [navAvatarFailed, setNavAvatarFailed] = useState<boolean>(false);
  const [activeChip, setActiveChip] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeNav, setActiveNav] = useState<string>("home");

  // 1. Fetch songs and their details from /api/songs (models/song.model.ts)
  useEffect(() => {
    let isMounted = true;

    async function fetchSongs() {
      try {
        setIsLoadingSongs(true);
        const res = await fetch("/api/songs");
        if (!res.ok) {
          throw new Error(`Failed to fetch songs: status ${res.status}`);
        }
        const data = await res.json();
        if (data.success && Array.isArray(data.songs) && isMounted) {
          const mappedTracks: Track[] = data.songs.map((s: ISong) =>
            mapSongToTrack(s)
          );
          setDbSongs(mappedTracks);
        }
      } catch (err) {
        console.error("Error fetching songs from MongoDB:", err);
        if (isMounted) {
          setDbError(err instanceof Error ? err.message : "Error fetching songs");
        }
      } finally {
        if (isMounted) {
          setIsLoadingSongs(false);
        }
      }
    }

    fetchSongs();

    return () => {
      isMounted = false;
    };
  }, []);

  // Combine DB songs with static audiophile masters (DB songs first!)
  const combinedTracks = useMemo(() => {
    if (dbSongs.length === 0) return TRACKS_DATA;
    // Put MongoDB songs first, followed by curated tracks that don't clash by ID
    return [...dbSongs, ...TRACKS_DATA];
  }, [dbSongs]);

  // Keep global player queue synced with combinedTracks
  useEffect(() => {
    if (combinedTracks.length > 0) {
      setQueue(combinedTracks);
    }
  }, [combinedTracks, setQueue]);

  // Extract all unique genres for filter chips
  const dynamicChips = useMemo(() => {
    const genresSet = new Set<string>(["All"]);
    // Add genres from DB songs
    dbSongs.forEach((t) => {
      if (t.genre) {
        t.genre.split(" • ").forEach((g) => {
          if (g.trim()) genresSet.add(g.trim());
        });
      }
    });
    // Add default genres
    genresSet.add("Vinyl Classics");
    genresSet.add("Acoustic Masters");
    genresSet.add("Audiophile FLAC");
    genresSet.add("Ambient & Spatial");
    return Array.from(genresSet).slice(0, 8);
  }, [dbSongs]);

  // Filtered tracks based on search query and active genre chip
  const filteredTracks = useMemo(() => {
    return combinedTracks.filter((track) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        track.title.toLowerCase().includes(q) ||
        track.artist.toLowerCase().includes(q) ||
        track.album.toLowerCase().includes(q);

      const matchesChip =
        activeChip === "All" ||
        track.genre.toLowerCase().includes(activeChip.toLowerCase());

      return matchesSearch && matchesChip;
    });
  }, [combinedTracks, searchQuery, activeChip]);

  // Track select handler
  const handleTrackSelect = (track: Track) => {
    playTrack(track, true);
  };

  const handleNextTrack = () => {
    if (filteredTracks.length > 1) {
      const currentIndex = filteredTracks.findIndex((t) => t.id === currentTrack.id);
      let nextIndex = (currentIndex + 1) % filteredTracks.length;
      if (isShuffle) {
        nextIndex = Math.floor(Math.random() * filteredTracks.length);
      }
      playTrack(filteredTracks[nextIndex], true);
    } else {
      nextTrack();
    }
  };

  const handlePrevTrack = () => {
    if (filteredTracks.length > 1) {
      const currentIndex = filteredTracks.findIndex((t) => t.id === currentTrack.id);
      const prevIndex = (currentIndex - 1 + filteredTracks.length) % filteredTracks.length;
      playTrack(filteredTracks[prevIndex], true);
    } else {
      prevTrack();
    }
  };

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    seekPercent(ratio * 100);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
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
                Tuned<span className={styles.brandTitleAccent}>In</span>
              </span>
              <span className={styles.brandTagline}>Studio Wave</span>
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
            <span className={styles.navLabel}>Library &amp; Collections</span>
            <div className={styles.libraryDivider} />
            <div className={styles.playlistList}>
              <button
                type="button"
                className={`${styles.playlistItem} ${styles.playlistItemActive}`}
              >
                <span>Live MongoDB Songs</span>
                <span className={styles.playlistCount}>{dbSongs.length} tracks</span>
              </button>
              <button type="button" className={styles.playlistItem}>
                <span>Late Night Vinyl Sessions</span>
                <span className={styles.playlistCount}>34 tracks</span>
              </button>
              <button type="button" className={styles.playlistItem}>
                <span>Acoustic Chambers</span>
                <span className={styles.playlistCount}>18 tracks</span>
              </button>
              <button type="button" className={styles.playlistItem}>
                <span>Analog Warmth &amp; Jazz</span>
                <span className={styles.playlistCount}>42 tracks</span>
              </button>
              <button type="button" className={styles.playlistItem}>
                <span>Hi-Res Lossless Vault</span>
                <span className={styles.playlistCount}>65 tracks</span>
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
              {/* Database sync status badge */}
              <div className={styles.dbBadge} title="Real-time MongoDB Song Feed">
                <span className={styles.dbDot} />
                <span>
                  {isLoadingSongs
                    ? "Syncing DB..."
                    : `${dbSongs.length} Cloud Masters Active`}
                </span>
              </div>

              {status === "authenticated" && session?.user ? (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Link href="/profile" className={styles.profileBadgeLink} title="Curator Profile">
                    <div className={styles.avatarMini}>
                      {((session.user as any).avatar || session.user.image) && !navAvatarFailed ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={((session.user as any).avatar || session.user.image) as string}
                          alt="Profile"
                          className={styles.avatarMiniImg}
                          referrerPolicy="no-referrer"
                          onError={() => setNavAvatarFailed(true)}
                        />
                      ) : (session.user as any).username ? (
                        (session.user as any).username.slice(0, 2).toUpperCase()
                      ) : session.user.name ? (
                        session.user.name.slice(0, 2).toUpperCase()
                      ) : (
                        "TI"
                      )}
                    </div>
                    <span className={styles.profileNameMini}>
                      @{(session.user as any).username || session.user.name || "Curator"}
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className={styles.profileBadgeLink}
                    title="Sign Out"
                    style={{ cursor: "pointer", border: "none" }}
                  >
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : status === "unauthenticated" ? (
                <Link href="/login" className={styles.authButton}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign In</span>
                </Link>
              ) : null}
            </div>
          </div>

          {/* Unauthenticated / Guest Notification Banner */}
          {status === "unauthenticated" && (
            <div className={styles.guestNoticeRibbon} role="status">
              <div className={styles.guestNoticeContent}>
                <span className={styles.guestNoticeIcon}>⚡</span>
                <div className={styles.guestNoticeText}>
                  <strong>Guest Mode:</strong> You are listening to direct cloud recordings. Sign in to curate your studio queue, upload master stems, and sync lossless presets.
                </div>
              </div>
              <Link href="/login" className={styles.guestNoticeCta}>
                Sign In
              </Link>
            </div>
          )}

          {/* Dynamic Genre & Format Filter Chips */}
          <div className={styles.chipsRow}>
            {dynamicChips.map((chip) => (
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

          {/* Hero Featured Showcase Banner (Highlights currently selected or top DB master) */}
          <div className={styles.heroBanner}>
            <div className={styles.heroContent}>
              <div className={styles.heroBadge}>
                <span>FEATURED MASTERWORK</span>
                <span>•</span>
                <span>{currentTrack.rate}</span>
                {currentTrack.verified && (
                  <>
                    <span>•</span>
                    <span style={{ color: "#34D399" }}>VERIFIED MASTER</span>
                  </>
                )}
              </div>
              <h1 className={styles.heroTitle}>{currentTrack.title}</h1>
              <p className={styles.heroDescription}>
                {currentTrack.album} • {currentTrack.artist}. {currentTrack.telemetry?.linerNotes || "Engineered for deep auditory depth and tactile warmth."}
              </p>
              <div className={styles.heroActions}>
                <button
                  type="button"
                  className={styles.heroPlayBtn}
                  onClick={() => (isPlaying ? togglePlay() : handleTrackSelect(currentTrack))}
                >
                  {isPlaying ? (
                    <>
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                      <span>Playing Master</span>
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <span>Play Master</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className={styles.heroSecondaryBtn}
                  onClick={toggleLike}
                  title="Save to favorites"
                >
                  <svg width="18" height="18" fill={isLiked ? "#E88C2B" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

                <Link
                  href={`/song/${currentTrack.id}`}
                  className={styles.heroSecondaryBtn}
                  title="Open Dedicated Song Player"
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className={styles.heroArtWrap}>
              {currentTrack.poster_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={currentTrack.poster_url}
                  alt={currentTrack.title}
                  className={styles.heroPosterImg}
                />
              ) : (
                <div className={styles.vinylDisc}>
                  <div className={styles.vinylCenter}>TUNEDIN</div>
                </div>
              )}
            </div>
          </div>

          {/* Curated Media Shelves (Showcases fetched songs & masters) */}
          <section className={styles.shelfSection}>
            <div className={styles.shelfHeader}>
              <h2 className={styles.shelfTitle}>Cloud Studio Shelves</h2>
              <span className={styles.playlistCount}>
                {combinedTracks.length} recordings curated
              </span>
            </div>

            <div className={styles.cardsGrid}>
              {combinedTracks.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className={styles.mediaCard}
                  onClick={() => handleTrackSelect(item)}
                >
                  <div className={styles.cardArtContainer}>
                    {item.poster_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={item.poster_url}
                        alt={item.title}
                        className={styles.cardPosterImage}
                      />
                    ) : (
                      <div className={styles.cardArtPlaceholder}>
                        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                        </svg>
                        <span>{item.format}</span>
                      </div>
                    )}
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
                  <span className={styles.cardFormat}>
                    {item.format} • {item.rate}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Master Studio Tracklist / Table */}
          <section className={styles.shelfSection}>
            <div className={styles.shelfHeader}>
              <h2 className={styles.shelfTitle}>Studio Tracklist</h2>
              <span className={styles.playlistCount}>
                {filteredTracks.length} tracks available
              </span>
            </div>

            {isLoadingSongs && dbSongs.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "#8C7370" }}>
                <span>Loading songs and acoustic details from database...</span>
              </div>
            ) : filteredTracks.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "#8C7370" }}>
                <span>No recordings found matching &ldquo;{searchQuery}&rdquo;.</span>
              </div>
            ) : (
              <table className={styles.tracklistTable}>
                <thead>
                  <tr className={styles.tableHeaderRow}>
                    <th style={{ width: 48, textAlign: "center" }}>#</th>
                    <th>TITLE &amp; ARTIST</th>
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
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            {track.poster_url ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={track.poster_url}
                                alt={track.title}
                                className={styles.trackCoverThumb}
                              />
                            ) : (
                              <div className={styles.trackCoverPlaceholder}>
                                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                                </svg>
                              </div>
                            )}

                            <div className={styles.trackTitleCell}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <Link
                                  href={`/song/${track.id}`}
                                  className={styles.trackTitleText}
                                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                  title="Open dedicated song player"
                                >
                                  {track.title}
                                </Link>

                                {track.verified && (
                                  <span className={`${styles.verifiedPill} ${styles.verifiedPillTrue}`} title="Verified Master">
                                    ✓ Verified
                                  </span>
                                )}

                                <Link
                                  href={`/song/${track.id}`}
                                  className={styles.openSongLink}
                                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                  title="Open Song View"
                                >
                                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </Link>
                              </div>
                              <span className={styles.trackArtistText}>{track.artist}</span>
                            </div>
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
            )}
          </section>
        </main>

        {/* ============================================================== */}
        {/* 3. RIGHT COLUMN: CONTEXTUAL STUDIO INSPECTOR (DETAILS & AI OBS) */}
        {/* ============================================================== */}
        <aside className={styles.rightInspector}>
          <div className={styles.inspectorHeader}>
            <span className={styles.inspectorHeading}>Acoustic Telemetry</span>
            <span className={styles.specValue}>{currentTrack.format}</span>
          </div>

          {/* Artwork Display */}
          <div className={styles.inspectorArt}>
            {currentTrack.poster_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={currentTrack.poster_url}
                alt={currentTrack.title}
                className={styles.inspectorCoverImg}
              />
            ) : (
              <div className={styles.inspectorArtOverlay}>
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#E88C2B">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
            )}
          </div>

          <div>
            <h3 className={styles.inspectorTrackTitle}>{currentTrack.title}</h3>
            <p className={styles.inspectorArtist}>{currentTrack.artist}</p>
          </div>

          {/* Telemetry Hardware & Song Details Specs Card */}
          <div className={styles.specsCard}>
            <div className={styles.specRow}>
              <span className={styles.specLabel}>Sample Rate</span>
              <span className={styles.specValue}>{currentTrack.rate}</span>
            </div>
            <div className={styles.specRow}>
              <span className={styles.specLabel}>Audio Codec</span>
              <span className={styles.specValue}>{currentTrack.format}</span>
            </div>
            <div className={styles.specRow}>
              <span className={styles.specLabel}>Verification</span>
              <span
                className={styles.specValue}
                style={{
                  color: currentTrack.verified ? "#059669" : "#D97706",
                  textTransform: "capitalize",
                }}
              >
                {currentTrack.verified ? "Verified Master" : (currentTrack.verificationStatus || "Pending")}
              </span>
            </div>
            <div className={styles.specRow}>
              <span className={styles.specLabel}>Curator / Uploader</span>
              <span className={styles.specValue}>
                {typeof currentTrack.uploadUser === "object" &&
                currentTrack.uploadUser &&
                "username" in (currentTrack.uploadUser as any)
                  ? `@${(currentTrack.uploadUser as any).username}`
                  : "@Curator"}
              </span>
            </div>
            <div className={styles.specRow}>
              <span className={styles.specLabel}>Streams / Plays</span>
              <span className={styles.specValue}>{currentTrack.plays || 0} plays</span>
            </div>
            <div className={styles.specRow}>
              <span className={styles.specLabel}>Genre</span>
              <span className={styles.specValue}>{currentTrack.genre}</span>
            </div>
          </div>

          {/* AI Observation Card if present on ISong */}
          {currentTrack.aiObservation && typeof currentTrack.aiObservation === "object" && (
            <div className={styles.aiObservationCard}>
              <div className={styles.aiObsHeader}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>AI Master Observation</span>
              </div>
              <div className={styles.aiObsGrid}>
                {Object.entries(currentTrack.aiObservation).map(([key, val]) => (
                  <div key={key} className={styles.aiObsRow}>
                    <span className={styles.aiObsKey}>{key}:</span>
                    <span className={styles.aiObsVal}>{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Liner Notes & Synchronized Lyrics */}
          <div className={styles.navSection}>
            <span className={styles.navLabel}>Liner Notes &amp; Acoustic Details</span>
            <div className={styles.lyricsSnippet}>
              &ldquo;{currentTrack.telemetry?.linerNotes ||
                "Recorded with pristine analog warmth. Preserves natural acoustic reflections without artificial limiter compression."}&rdquo;
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
          <Link
            href={`/song/${currentTrack.id}`}
            className={styles.dockThumbnail}
            title="Open dedicated song player"
          >
            {currentTrack.poster_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={currentTrack.poster_url}
                alt={currentTrack.title}
                className={styles.dockCoverThumb}
              />
            ) : (
              <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            )}
          </Link>
          <div className={styles.dockTrackInfo}>
            <Link
              href={`/song/${currentTrack.id}`}
              className={styles.dockTrackTitle}
              title="Open dedicated song player"
            >
              {currentTrack.title}
            </Link>
            <span className={styles.dockArtist}>{currentTrack.artist}</span>
          </div>
          <button
            type="button"
            className={`${styles.likeBtn} ${isLiked ? styles.likeBtnActive : ""}`}
            onClick={toggleLike}
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
              onClick={toggleShuffle}
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
              onClick={togglePlay}
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
              onClick={toggleRepeat}
              title="Repeat"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Interactive Progress Rail */}
          <div className={styles.scrubberRow}>
            <span className={styles.timecode}>{formatSeconds(currentTimeSec)}</span>
            <div
              className={styles.scrubberTrack}
              onClick={handleScrubberClick}
              role="slider"
              aria-label="Track progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
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
            onClick={toggleMute}
            title={isMuted || volume === 0 ? "Unmute" : "Mute"}
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
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              setVolume(Math.max(0, Math.min(100, Math.round((clickX / rect.width) * 100))));
            }}
          >
            <div
              className={styles.volumeProgress}
              style={{ width: `${isMuted ? 0 : volume}%` }}
            />
          </div>

          {/* Fullscreen Expand to dedicated song page */}
          <Link
            href={`/song/${currentTrack.id}`}
            className={styles.dockIconBtn}
            title="Open Dedicated Song Player"
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </Link>
        </div>
      </footer>
    </div>
  );
}
