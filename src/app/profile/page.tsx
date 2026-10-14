"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { TRACKS_DATA, Track } from "@/data/tracks";
import styles from "./profile.module.css";

interface UserProfile {
  name: string;
  handle: string;
  location: string;
  bio: string;
  avatarText: string;
  tier: string;
  memberSince: string;
  bitPerfectScore: string;
  hoursListened: number;
}

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile>({
    name: "Julian Vance",
    handle: "@julian.vance",
    location: "Sunset Sound • Studio 2",
    bio: "Mastering engineer & acoustic curator. Calibrated for 24-bit/192kHz uncompressed studio feeds and discrete analog signal chains.",
    avatarText: "JV",
    tier: "STUDIO ARCHITECT • MASTER TIER",
    memberSince: "October 2024",
    bitPerfectScore: "99.8%",
    hoursListened: 1420,
  });

  const [activeTab, setActiveTab] = useState<"library" | "gear" | "analytics" | "settings">("library");
  const [favoriteTracks, setFavoriteTracks] = useState<Track[]>(TRACKS_DATA.slice(0, 5));
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit form state
  const [editName, setEditName] = useState(profile.name);
  const [editHandle, setEditHandle] = useState(profile.handle);
  const [editLocation, setEditLocation] = useState(profile.location);
  const [editBio, setEditBio] = useState(profile.bio);

  // Audio gear toggle state
  const [gearToggles, setGearToggles] = useState({
    bitPerfect: true,
    volumeBypass: true,
    dspCorrection: false,
    exclusiveMode: true,
  });

  // Streaming quality settings
  const [streamingQuality, setStreamingQuality] = useState<"studio" | "lossless" | "standard">("studio");
  const [cacheSize, setCacheSize] = useState<string>("14.2 GB");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile((prev) => ({
      ...prev,
      name: editName,
      handle: editHandle,
      location: editLocation,
      bio: editBio,
      avatarText: editName
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "JV",
    }));
    setIsEditing(false);
    showToast("Profile settings saved successfully");
  };

  const handleRemoveFavorite = (trackId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteTracks((prev) => prev.filter((t) => t.id !== trackId));
    showToast("Track removed from favorites");
  };

  const toggleGear = (key: keyof typeof gearToggles) => {
    setGearToggles((prev) => {
      const next = !prev[key];
      showToast(`${key} ${next ? "enabled" : "disabled"}`);
      return { ...prev, [key]: next };
    });
  };

  const handleClearCache = () => {
    setCacheSize("0.0 GB");
    showToast("Audiophile buffer cache purged");
  };

  return (
    <div className={styles.pageContainer}>
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
          <div className={styles.tierBadge}>
            <div className={styles.tierDot} />
            <span>{profile.tier}</span>
          </div>
        </div>

        <div className={styles.topHeaderRight}>
          <button
            type="button"
            className={styles.actionBtnOutline}
            onClick={() => setIsEditing(!isEditing)}
          >
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span>{isEditing ? "Close Editor" : "Edit Profile"}</span>
          </button>

          <Link href="/login" className={styles.signOutBtn} title="Sign Out">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign Out</span>
          </Link>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 3. PROFILE STAGE HERO CARD                                     */}
      {/* ============================================================== */}
      <main className={styles.mainContainer}>
        <section className={styles.profileHeroCard}>
          {/* Cover Vinyl Waveform Banner */}
          <div className={styles.heroBanner}>
            <div className={styles.bannerWavePattern} />
            <div className={styles.bannerTag}>DAC BIT-PERFECT: {profile.bitPerfectScore}</div>
          </div>

          {/* Profile Identity Row */}
          <div className={styles.profileIdentityRow}>
            <div className={styles.avatarAssembly}>
              <div className={styles.avatarGroove}>
                <div className={styles.avatarInner}>
                  <span>{profile.avatarText}</span>
                </div>
              </div>
              <div className={styles.avatarStatusBadge} title="Audio Stream Online">
                <div className={styles.statusPulse} />
              </div>
            </div>

            <div className={styles.identityMeta}>
              <div className={styles.nameRow}>
                <h1 className={styles.profileName}>{profile.name}</h1>
                <span className={styles.verifiedBadge} title="Verified Acoustic Curator">
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Calibrated</span>
                </span>
              </div>

              <div className={styles.handleRow}>
                <span className={styles.handleText}>{profile.handle}</span>
                <span className={styles.dotSeparator}>•</span>
                <span className={styles.locationText}>{profile.location}</span>
                <span className={styles.dotSeparator}>•</span>
                <span className={styles.memberSinceText}>Curating since {profile.memberSince}</span>
              </div>

              <p className={styles.bioText}>{profile.bio}</p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className={styles.metricsBar}>
            <div className={styles.metricItem}>
              <span className={styles.metricValue}>{profile.hoursListened.toLocaleString()}</span>
              <span className={styles.metricLabel}>Hours Listened</span>
            </div>
            <div className={styles.metricDivider} />
            <div className={styles.metricItem}>
              <span className={styles.metricValue}>328</span>
              <span className={styles.metricLabel}>Lossless Masters Saved</span>
            </div>
            <div className={styles.metricDivider} />
            <div className={styles.metricItem}>
              <span className={styles.metricValue}>18</span>
              <span className={styles.metricLabel}>Curated Vaults</span>
            </div>
            <div className={styles.metricDivider} />
            <div className={styles.metricItem}>
              <span className={styles.metricValue}>DR15.2</span>
              <span className={styles.metricLabel}>Avg. Dynamic Range</span>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 4. INLINE PROFILE EDITOR (COLLAPSIBLE)                         */}
        {/* ============================================================== */}
        {isEditing && (
          <section className={styles.editorCard}>
            <div className={styles.editorHeader}>
              <h2 className={styles.editorTitle}>Edit Studio Profile</h2>
              <p className={styles.editorSubtitle}>Customize your public audiophile identity and acoustics bio</p>
            </div>

            <form onSubmit={handleSaveProfile} className={styles.editorForm}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="edit-name" className={styles.formLabel}>Curator Name</label>
                  <input
                    id="edit-name"
                    type="text"
                    className={styles.formInput}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="edit-handle" className={styles.formLabel}>Handle</label>
                  <input
                    id="edit-handle"
                    type="text"
                    className={styles.formInput}
                    value={editHandle}
                    onChange={(e) => setEditHandle(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroupFull}>
                  <label htmlFor="edit-location" className={styles.formLabel}>Studio / Listening Room Location</label>
                  <input
                    id="edit-location"
                    type="text"
                    className={styles.formInput}
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                  />
                </div>

                <div className={styles.formGroupFull}>
                  <label htmlFor="edit-bio" className={styles.formLabel}>Acoustics Bio</label>
                  <textarea
                    id="edit-bio"
                    rows={3}
                    className={styles.formTextarea}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Save Changes
                </button>
              </div>
            </form>
          </section>
        )}

        {/* ============================================================== */}
        {/* 5. TABS NAVIGATION                                             */}
        {/* ============================================================== */}
        <div className={styles.tabsContainer} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "library"}
            className={`${styles.tabItem} ${activeTab === "library" ? styles.tabItemActive : ""}`}
            onClick={() => setActiveTab("library")}
          >
            <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>Saved Masters ({favoriteTracks.length})</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "gear"}
            className={`${styles.tabItem} ${activeTab === "gear" ? styles.tabItemActive : ""}`}
            onClick={() => setActiveTab("gear")}
          >
            <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            <span>Acoustic Rig &amp; DAC</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "analytics"}
            className={`${styles.tabItem} ${activeTab === "analytics" ? styles.tabItemActive : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Listening Analytics</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "settings"}
            className={`${styles.tabItem} ${activeTab === "settings" ? styles.tabItemActive : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Audio Stream Settings</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* 6. TAB CONTENT PANELS                                          */}
        {/* ============================================================== */}
        <div className={styles.tabContentArea}>

          {/* TAB 1: SAVED MASTERS / FAVORITES */}
          {activeTab === "library" && (
            <div className={styles.libraryGrid}>
              <div className={styles.sectionHeaderRow}>
                <div>
                  <h2 className={styles.sectionHeading}>Favorite Master Tapes</h2>
                  <p className={styles.sectionSubheading}>Audiophile cuts saved to your primary high-fidelity archive</p>
                </div>
                <Link href="/" className={styles.exploreLink}>
                  <span>Explore More</span>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {favoriteTracks.length === 0 ? (
                <div className={styles.emptyState}>
                  <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <p className={styles.emptyTitle}>No saved tracks in your vault yet</p>
                  <p className={styles.emptySub}>Explore the master archives and click the heart icon on any player to save it here.</p>
                  <Link href="/" className={styles.btnPrimary}>Browse Catalog</Link>
                </div>
              ) : (
                <div className={styles.tracksList}>
                  {favoriteTracks.map((track, idx) => (
                    <div
                      key={track.id}
                      className={styles.trackCard}
                      onClick={() => router.push(`/song/${track.id}`)}
                    >
                      <div className={styles.trackCardLeft}>
                        <span className={styles.trackIndex}>{(idx + 1).toString().padStart(2, "0")}</span>

                        <div
                          className={styles.trackThumb}
                          style={{
                            background: `radial-gradient(circle, ${track.theme?.accent || track.coverAccent} 0%, #1A0D08 100%)`,
                          }}
                        >
                          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                          </svg>
                        </div>

                        <div className={styles.trackMeta}>
                          <span className={styles.trackTitle}>{track.title}</span>
                          <span className={styles.trackArtist}>{track.artist} • <span className={styles.trackAlbum}>{track.album}</span></span>
                        </div>
                      </div>

                      <div className={styles.trackCardRight}>
                        <span className={styles.formatBadgePill}>{track.format} • {track.rate}</span>
                        <span className={styles.durationText}>{track.duration}</span>

                        <button
                          type="button"
                          className={styles.playMiniBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/song/${track.id}`);
                          }}
                          title="Play Track"
                        >
                          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          className={styles.removeBtn}
                          onClick={(e) => handleRemoveFavorite(track.id, e)}
                          title="Remove from favorites"
                        >
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AUDIOPHILE GEAR RIG & DAC */}
          {activeTab === "gear" && (
            <div className={styles.gearSection}>
              <div className={styles.sectionHeaderRow}>
                <div>
                  <h2 className={styles.sectionHeading}>Calibrated Acoustic Rig</h2>
                  <p className={styles.sectionSubheading}>Hardware endpoints and bit-perfect DAC configuration</p>
                </div>
                <div className={styles.dacStatusBadge}>
                  <div className={styles.dacDot} />
                  <span>HARDWARE LOCKED</span>
                </div>
              </div>

              <div className={styles.gearGrid}>
                <div className={styles.gearCard}>
                  <div className={styles.gearCardIcon}>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <div className={styles.gearCardContent}>
                    <span className={styles.gearCategory}>DIGITAL-TO-ANALOG CONVERTER</span>
                    <h3 className={styles.gearTitle}>Chord Hugo TT 2 + M Scaler</h3>
                    <p className={styles.gearDesc}>Dual-BNC 705.6kHz FPGA million-tap pulse array upsampler with discrete discrete class-A buffer.</p>
                  </div>
                  <div className={styles.gearTag}>Bit-Perfect Master</div>
                </div>

                <div className={styles.gearCard}>
                  <div className={styles.gearCardIcon}>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  </div>
                  <div className={styles.gearCardContent}>
                    <span className={styles.gearCategory}>STUDIO REFERENCE MONITORS</span>
                    <h3 className={styles.gearTitle}>Neumann KH 120 II DSP + KH 750</h3>
                    <p className={styles.gearDesc}>Mathematically Modeled Dispersion waveguide (MMD) with FIR phase alignment across 16Hz - 22kHz.</p>
                  </div>
                  <div className={styles.gearTag}>Linear Phase</div>
                </div>

                <div className={styles.gearCard}>
                  <div className={styles.gearCardIcon}>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className={styles.gearCardContent}>
                    <span className={styles.gearCategory}>REFERENCE HEADPHONES</span>
                    <h3 className={styles.gearTitle}>Sennheiser HD 800 S</h3>
                    <p className={styles.gearDesc}>56mm Ring Radiator transducer with patented acoustic absorber system. 4.4mm balanced silver cable.</p>
                  </div>
                  <div className={styles.gearTag}>Diffuse Field Equalized</div>
                </div>

                <div className={styles.gearCard}>
                  <div className={styles.gearCardIcon}>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className={styles.gearCardContent}>
                    <span className={styles.gearCategory}>AUDIO DRIVER &amp; TRANSPORT</span>
                    <h3 className={styles.gearTitle}>ASIO Native Direct Stream</h3>
                    <p className={styles.gearDesc}>Zero-copy Kernel bypass protocol with hardware clock synchronization and automatic DSD over PCM (DoP).</p>
                  </div>
                  <div className={styles.gearTag}>Zero Jitter</div>
                </div>
              </div>

              {/* Hardware Toggles Matrix */}
              <div className={styles.toggleMatrix}>
                <h3 className={styles.toggleMatrixHeading}>Acoustic Stream Drivers &amp; Bypass Flags</h3>

                <div className={styles.toggleRow}>
                  <div>
                    <div className={styles.toggleTitle}>Bit-Perfect Output Protocol</div>
                    <div className={styles.toggleSub}>Bypasses OS sound mixers to ensure 100% bit-accurate delivery to DAC</div>
                  </div>
                  <button
                    type="button"
                    className={`${styles.toggleSwitch} ${gearToggles.bitPerfect ? styles.toggleSwitchActive : ""}`}
                    onClick={() => toggleGear("bitPerfect")}
                    aria-label="Toggle bit-perfect mode"
                  >
                    <div className={styles.toggleKnob} />
                  </button>
                </div>

                <div className={styles.toggleRow}>
                  <div>
                    <div className={styles.toggleTitle}>Hardware Volume Control Bypass</div>
                    <div className={styles.toggleSub}>Locks digital volume slider to 100% to preserve full dynamic bit depth</div>
                  </div>
                  <button
                    type="button"
                    className={`${styles.toggleSwitch} ${gearToggles.volumeBypass ? styles.toggleSwitchActive : ""}`}
                    onClick={() => toggleGear("volumeBypass")}
                    aria-label="Toggle volume bypass"
                  >
                    <div className={styles.toggleKnob} />
                  </button>
                </div>

                <div className={styles.toggleRow}>
                  <div>
                    <div className={styles.toggleTitle}>WASAPI Exclusive Stream Locking</div>
                    <div className={styles.toggleSub}>Grants TunedIn solitary access to the endpoint, muting all system alerts</div>
                  </div>
                  <button
                    type="button"
                    className={`${styles.toggleSwitch} ${gearToggles.exclusiveMode ? styles.toggleSwitchActive : ""}`}
                    onClick={() => toggleGear("exclusiveMode")}
                    aria-label="Toggle exclusive mode"
                  >
                    <div className={styles.toggleKnob} />
                  </button>
                </div>

                <div className={styles.toggleRow}>
                  <div>
                    <div className={styles.toggleTitle}>DSP Acoustic Room Correction</div>
                    <div className={styles.toggleSub}>Injects 64-bit floating point convolution filters for non-linear room reflections</div>
                  </div>
                  <button
                    type="button"
                    className={`${styles.toggleSwitch} ${gearToggles.dspCorrection ? styles.toggleSwitchActive : ""}`}
                    onClick={() => toggleGear("dspCorrection")}
                    aria-label="Toggle DSP room correction"
                  >
                    <div className={styles.toggleKnob} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LISTENING ANALYTICS */}
          {activeTab === "analytics" && (
            <div className={styles.analyticsSection}>
              <div className={styles.sectionHeaderRow}>
                <div>
                  <h2 className={styles.sectionHeading}>Acoustic Telemetry Analytics</h2>
                  <p className={styles.sectionSubheading}>Listener habits, dynamic range preferences, and resolution distribution</p>
                </div>
                <div className={styles.periodBadge}>LAST 90 DAYS</div>
              </div>

              <div className={styles.analyticsGrid}>
                {/* Resolution Distribution */}
                <div className={styles.analyticsCard}>
                  <h3 className={styles.analyticsCardTitle}>Sample Rate Distribution</h3>
                  <div className={styles.statList}>
                    <div className={styles.statRow}>
                      <span className={styles.statLabel}>192,000 Hz (Audiophile Master)</span>
                      <span className={styles.statValue}>68%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: "68%" }} />
                    </div>

                    <div className={styles.statRow}>
                      <span className={styles.statLabel}>96,000 Hz (High Resolution)</span>
                      <span className={styles.statValue}>22%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: "22%" }} />
                    </div>

                    <div className={styles.statRow}>
                      <span className={styles.statLabel}>DSD64 / DSD128 (Direct Stream)</span>
                      <span className={styles.statValue}>10%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: "10%" }} />
                    </div>
                  </div>
                </div>

                {/* Genre & Vibe Breakdown */}
                <div className={styles.analyticsCard}>
                  <h3 className={styles.analyticsCardTitle}>Curated Genres &amp; Vibes</h3>
                  <div className={styles.statList}>
                    <div className={styles.statRow}>
                      <span className={styles.statLabel}>Vinyl Classics &amp; Analog Warmth</span>
                      <span className={styles.statValue}>48%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: "48%" }} />
                    </div>

                    <div className={styles.statRow}>
                      <span className={styles.statLabel}>Acoustic Masters &amp; Orchestral</span>
                      <span className={styles.statValue}>32%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: "32%" }} />
                    </div>

                    <div className={styles.statRow}>
                      <span className={styles.statLabel}>Ambient &amp; Spatial Sanctuary</span>
                      <span className={styles.statValue}>20%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: "20%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Range Reference Card */}
              <div className={styles.drScoreBanner}>
                <div className={styles.drLeft}>
                  <div className={styles.drBadge}>DR 15.2</div>
                  <div>
                    <h4 className={styles.drTitle}>Audiophile Reference Dynamic Range</h4>
                    <p className={styles.drDesc}>Your vault tracks have an average crest factor of 15.2 dB, preserving natural acoustic transients with zero loudness war compression or brickwall limiting.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STREAM SETTINGS */}
          {activeTab === "settings" && (
            <div className={styles.settingsSection}>
              <div className={styles.sectionHeaderRow}>
                <div>
                  <h2 className={styles.sectionHeading}>Audio Stream &amp; Cache Configuration</h2>
                  <p className={styles.sectionSubheading}>Manage buffer memory, transport fidelity, and studio streaming protocols</p>
                </div>
              </div>

              <div className={styles.settingsCard}>
                <h3 className={styles.settingsGroupTitle}>Streaming Quality Protocol</h3>
                <div className={styles.qualitySelectorGrid}>
                  <div
                    className={`${styles.qualityOption} ${streamingQuality === "studio" ? styles.qualityOptionActive : ""}`}
                    onClick={() => {
                      setStreamingQuality("studio");
                      showToast("Audio fidelity set to Studio Master (FLAC 24/192)");
                    }}
                  >
                    <div className={styles.qualityHeader}>
                      <span className={styles.qualityName}>Studio Master FLAC</span>
                      <span className={styles.qualityPill}>24-BIT / 192kHz</span>
                    </div>
                    <p className={styles.qualityDesc}>Uncompressed original bitstream. Direct tape &amp; console transfers with complete dynamic fidelity.</p>
                  </div>

                  <div
                    className={`${styles.qualityOption} ${streamingQuality === "lossless" ? styles.qualityOptionActive : ""}`}
                    onClick={() => {
                      setStreamingQuality("lossless");
                      showToast("Audio fidelity set to Lossless CD Standard (16/44.1)");
                    }}
                  >
                    <div className={styles.qualityHeader}>
                      <span className={styles.qualityName}>Lossless CD Standard</span>
                      <span className={styles.qualityPill}>16-BIT / 44.1kHz</span>
                    </div>
                    <p className={styles.qualityDesc}>Bit-perfect Red Book CD audio standard. Zero loss of audible frequency spectrum.</p>
                  </div>

                  <div
                    className={`${styles.qualityOption} ${streamingQuality === "standard" ? styles.qualityOptionActive : ""}`}
                    onClick={() => {
                      setStreamingQuality("standard");
                      showToast("Audio fidelity set to Compressed Mobile Stream");
                    }}
                  >
                    <div className={styles.qualityHeader}>
                      <span className={styles.qualityName}>High-Efficiency AAC</span>
                      <span className={styles.qualityPill}>320 KBPS</span>
                    </div>
                    <p className={styles.qualityDesc}>Optimized for constrained bandwidth or mobile cellular network conditions.</p>
                  </div>
                </div>

                <div className={styles.cacheRow}>
                  <div>
                    <h4 className={styles.cacheTitle}>Lossless Offline Audio Buffer</h4>
                    <p className={styles.cacheSub}>Allocated disk buffer for zero-latency local PCM playback: <strong>{cacheSize}</strong></p>
                  </div>
                  <button
                    type="button"
                    className={styles.btnClearCache}
                    onClick={handleClearCache}
                  >
                    Purge Cache
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ============================================================== */}
      {/* 7. TOAST NOTIFICATIONS                                         */}
      {/* ============================================================== */}
      {toastMessage && (
        <div className={styles.toast} role="status">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#D97706">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
