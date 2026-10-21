"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import styles from "./profile.module.css";

interface UserProfile {
  name: string;
  handle: string;
  email: string;
  location: string;
  bio: string;
  tier: string;
  memberSince: string;
  losslessTag: string;
  avatarUrl: string;
}

interface FavoriteTrack {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  durationSeconds: number;
  imageUrl: string;
}

interface Playlist {
  id: string;
  title: string;
  curator: string;
  trackCount: number;
  duration: string;
  imageUrl: string;
}

const formatMemberSince = (dateStr?: string | Date | null) => {
  if (!dateStr) return "Oct 2026";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  } catch {
    return "Oct 2026";
  }
};

const INITIAL_TRACKS: FavoriteTrack[] = [
  {
    id: 1,
    title: "Resonance & Solitude",
    artist: "Hildur Guðnadóttir",
    album: "Orchestral Modulations",
    duration: "4:12",
    durationSeconds: 252,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCqVQlxAlnvizou3jVb1jz2tKoMIqObv98BTwSECYdm7pci1wzbzBfAks3f5aZ3lEi6It4kAIvv4JIxWn3iOo709XmRhhLPO--aCHtJYJH8Znm9f7_SasMeeaF5qaz-EhZdI5e-RsDvo-_6a1XVnT6JJip2hqUooo3ToQldHsrggjA5EqpgQwcEo-U6Y3T7T3VlPQdZMGT1VON5SXZxrtXv9Z85uFnNlsqd3NI_oyJGGCBQUFSPvaNh",
  },
  {
    id: 2,
    title: "Nostalgia Waves",
    artist: "The Midnight Sunset",
    album: "Synth Resonance 2025",
    duration: "3:15",
    durationSeconds: 195,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA4fzFnQ-iczeYyeYE-R3Q3TbPXDJ-c4rIPpp9cBFx0jJOG7MOuEMliVyVTjyp0oeh3km1ullVEZHg3BzyJ9-NDKKE2HtL9FBnfErtZ2I25KgRoXk51IEQPikfUBVk9wDMfh-oY8c7R-ypctkmlvDKQlqZvhgReJLR62sQ1tVi67bLKJ8gi9RWsNcozymE3ncyc_XXJFzF5zuNroD4XJ039mR-E6VxdNlfB3C3WeTI67lcPeKF0abvj",
  },
  {
    id: 3,
    title: "Solar Echoes",
    artist: "Nigel Stanford",
    album: "Cymatics Vol. II",
    duration: "5:28",
    durationSeconds: 328,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBVZE4H2SBZOqZirYqJbPn2_hgYyOK5nAEPJfoNwc0ZVVmdoLTN73BuDLrizaHiPT7VQjSIkB0L5rqpybf9c-aA4-cnSRY3Qv34GknmklS3i7dJ0p9UK6u6Adzh54617u9ZvT3UwMQ1cLb2ehlhYrEKDUjIl_zGK1Kwg2kP0kxxwG4HtosXmPEmwCf5iQyOETeS7zR_kRX7KQ_N1JLqzrfyj6OK3RmCDZTrwt-keL3pDowUQyK8wQ_o",
  },
  {
    id: 4,
    title: "Subterranean Pulse",
    artist: "Jon Hopkins",
    album: "Singularity Suite",
    duration: "6:04",
    durationSeconds: 364,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBHtPDn_uXJB6_CYBnd_K2iy15MbZ0-JaaBOcFxPV-ES_mXv_FZVJsDbvpk9OwAxwQCuiX4jzEGi2pI24Jk7WO4inF9uTIsorLk4Sm_dTTpBfpoVGiGTC1sJCj-LyksXfHiFYvXtyAq0Ecm1ysBr2lzzpBvt5ZpVPsYDIk0uMCNqcmbDI50qg7mvRNRsl2xoBIrAKPAwTbH9zwYfCuQYFUYuMSv0EOvKf9pd7QcQ1q5rSbHl1SqbeOb",
  },
  {
    id: 5,
    title: "Cascade & Flow",
    artist: "Nils Frahm",
    album: "Spaces & Resonance",
    duration: "4:45",
    durationSeconds: 285,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAF_eDKopfd2RrXf2gxaSEd-Iv6HmAEozlvPJeYr-AVt6e_Jf49vtD_Y9Nh6da9cs9HeQu2Z_sjO5KCljgAXOESo6ld7AK4fDcsRsH0nqI2Wa3aTU9HZ6RMM7HGJPqZ1DvPVhvets6mwhCKgxnHJQUw14BpqaeUJv4PB2nzIBWSEC6A-SkhY-QRgk4gaz5ndJlcGiFe6zUolB89-H6mxTJaYbrW2vOreznWsjyTPxW-Fz5oB-j02o32",
  },
  {
    id: 6,
    title: "Midnight Velocity",
    artist: "Tycho",
    album: "Epoch Remasters",
    duration: "3:52",
    durationSeconds: 232,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCMG1leEvmE5Q5uHzQR4GaJEuaAlBw9PcAaK2gd4Mo34tp2HXdqnmO-YdsrpaQwv9aatlD8DqSbUtbd3lapxK_-L5WhIDbZrUXpPxv2ms7EbF6r74EpXcAyEDzaq87BfwHR9E9V1_OeoiNKjDf7dwlQ1vFfeGgGGH2FYztgGstFrglRLoR7_mVFSX3Ep9dh29hXUdfUkLqrd_kYS0j-guZr9IPkHDEdRlEHI0tVJlisbv8TvBnia0hA",
  },
];

const PLAYLISTS_DATA: Playlist[] = [
  {
    id: "p1",
    title: "Late Night Synthwave",
    curator: "Curated by Studio Ensemble",
    trackCount: 32,
    duration: "2 hr 14 min",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA4fzFnQ-iczeYyeYE-R3Q3TbPXDJ-c4rIPpp9cBFx0jJOG7MOuEMliVyVTjyp0oeh3km1ullVEZHg3BzyJ9-NDKKE2HtL9FBnfErtZ2I25KgRoXk51IEQPikfUBVk9wDMfh-oY8c7R-ypctkmlvDKQlqZvhgReJLR62sQ1tVi67bLKJ8gi9RWsNcozymE3ncyc_XXJFzF5zuNroD4XJ039mR-E6VxdNlfB3C3WeTI67lcPeKF0abvj",
  },
  {
    id: "p2",
    title: "Deep Focus Ambient",
    curator: "TunedIn Studio Official",
    trackCount: 45,
    duration: "3 hr 40 min",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCqVQlxAlnvizou3jVb1jz2tKoMIqObv98BTwSECYdm7pci1wzbzBfAks3f5aZ3lEi6It4kAIvv4JIxWn3iOo709XmRhhLPO--aCHtJYJH8Znm9f7_SasMeeaF5qaz-EhZdI5e-RsDvo-_6a1XVnT6JJip2hqUooo3ToQldHsrggjA5EqpgQwcEo-U6Y3T7T3VlPQdZMGT1VON5SXZxrtXv9Z85uFnNlsqd3NI_oyJGGCBQUFSPvaNh",
  },
  {
    id: "p3",
    title: "Acoustic Resonance",
    curator: "Curated by Master Wave",
    trackCount: 28,
    duration: "1 hr 52 min",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAF_eDKopfd2RrXf2gxaSEd-Iv6HmAEozlvPJeYr-AVt6e_Jf49vtD_Y9Nh6da9cs9HeQu2Z_sjO5KCljgAXOESo6ld7AK4fDcsRsH0nqI2Wa3aTU9HZ6RMM7HGJPqZ1DvPVhvets6mwhCKgxnHJQUw14BpqaeUJv4PB2nzIBWSEC6A-SkhY-QRgk4gaz5ndJlcGiFe6zUolB89-H6mxTJaYbrW2vOreznWsjyTPxW-Fz5oB-j02o32",
  },
  {
    id: "p4",
    title: "Analog Master Remasters",
    curator: "SoundLab Curations",
    trackCount: 19,
    duration: "1 hr 38 min",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBVZE4H2SBZOqZirYqJbPn2_hgYyOK5nAEPJfoNwc0ZVVmdoLTN73BuDLrizaHiPT7VQjSIkB0L5rqpybf9c-aA4-cnSRY3Qv34GknmklS3i7dJ0p9UK6u6Adzh54617u9ZvT3UwMQ1cLb2ehlhYrEKDUjIl_zGK1Kwg2kP0kxxwG4HtosXmPEmwCf5iQyOETeS7zR_kRX7KQ_N1JLqzrfyj6OK3RmCDZTrwt-keL3pDowUQyK8wQ_o",
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Profile data (Initialized with accurate session/fallback defaults)
  const [profile, setProfile] = useState<UserProfile>({
    name: "Curator Studio",
    handle: "@curator",
    email: "curator@tunedin.audio",
    location: "Sunset Sound • Studio 2",
    bio: "Master audio quality favorites curated for analytical listening & discrete analog signal chains.",
    tier: "PRO TIER",
    memberSince: "Oct 2026",
    losslessTag: "TunedIn Studio Member (Lossless 24-bit)",
    avatarUrl: "",
  });

  // Navigation and view tabs
  const [activeNav, setActiveNav] = useState<"overview" | "favorites" | "playlists" | "rig" | "account">("account");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(profile.name);
  const [editHandle, setEditHandle] = useState(profile.handle);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editLocation, setEditLocation] = useState(profile.location);
  const [editBio, setEditBio] = useState(profile.bio);

  // Synchronize authenticated user profile with NextAuth session and MongoDB
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const u = session.user as any;
      const initialName = u.name || session.user.name || "Curator Studio";
      const initialHandle = `@${u.username || (session.user.email ? session.user.email.split("@")[0] : "curator")}`;
      const initialEmail = session.user.email || "";
      const initialAvatar = u.avatar || session.user.image || "";
      const initialLocation = u.location || "Sunset Sound • Studio 2";
      const initialBio = u.bio || "Master audio quality favorites curated for analytical listening & discrete analog signal chains.";
      const initialMemberSince = formatMemberSince(u.createdAt);

      setProfile({
        name: initialName,
        handle: initialHandle,
        email: initialEmail,
        location: initialLocation,
        bio: initialBio,
        tier: "PRO TIER",
        memberSince: initialMemberSince,
        losslessTag: "TunedIn Studio Member (Lossless 24-bit)",
        avatarUrl: initialAvatar,
      });

      setEditName(initialName);
      setEditHandle(initialHandle);
      setEditEmail(initialEmail);
      setEditLocation(initialLocation);
      setEditBio(initialBio);

      // Fetch latest MongoDB user document to guarantee 100% accuracy
      fetch("/api/user/profile")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.user) {
            const db = data.user;
            const dbName = db.name || initialName;
            const dbHandle = `@${db.username || (session.user as any).username || "curator"}`;
            const dbLocation = db.location || initialLocation;
            const dbBio = db.bio || initialBio;
            const dbAvatar = db.avatar || initialAvatar;
            const dbMemberSince = formatMemberSince(db.createdAt);

            setProfile((prev) => ({
              ...prev,
              name: dbName,
              handle: dbHandle,
              email: db.email || initialEmail,
              location: dbLocation,
              bio: dbBio,
              avatarUrl: dbAvatar,
              memberSince: dbMemberSince,
            }));

            setEditName(dbName);
            setEditHandle(dbHandle);
            setEditLocation(dbLocation);
            setEditBio(dbBio);
          }
        })
        .catch((err) => {
          console.error("Could not fetch DB profile:", err);
        });
    }
  }, [session, status]);

  // Tracks & Playlists state
  const [tracks, setTracks] = useState<FavoriteTrack[]>(INITIAL_TRACKS);
  const [currentTrack, setCurrentTrack] = useState<FavoriteTrack>(INITIAL_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progressSec, setProgressSec] = useState<number>(84); // 01:24
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(75);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Audiophile Gear toggles
  const [gearToggles, setGearToggles] = useState({
    bitPerfect: true,
    volumeBypass: true,
    wasapiExclusive: true,
    dspCorrection: false,
  });

  // Simulated live progress increment when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgressSec((prev) => {
        if (prev >= currentTrack.durationSeconds) {
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack.durationSeconds]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          bio: editBio,
          location: editLocation,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.user) {
          setProfile((prev) => ({
            ...prev,
            name: data.user.name || editName,
            location: data.user.location || editLocation,
            bio: data.user.bio || editBio,
          }));
        }
        setIsEditing(false);
        showToast("Profile settings saved successfully");
      } else {
        setProfile((prev) => ({
          ...prev,
          name: editName,
          location: editLocation,
          bio: editBio,
        }));
        setIsEditing(false);
        showToast("Profile updated");
      }
    } catch (err) {
      setProfile((prev) => ({
        ...prev,
        name: editName,
        location: editLocation,
        bio: editBio,
      }));
      setIsEditing(false);
      showToast("Profile saved");
    }
  };

  const handleToggleFavorite = (trackId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const target = tracks.find((t) => t.id === trackId);
    if (!target) return;

    setTracks((prev) => prev.filter((t) => t.id !== trackId));
    showToast(`Removed "${target.title}" from favorites`);
  };

  const handlePlayTrack = (track: FavoriteTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgressSec(0);
    showToast(`Now playing "${track.title}"`);
  };

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      setCurrentTrack(tracks[0]);
      setIsPlaying(true);
      setProgressSec(0);
      showToast(`Playing all ${tracks.length} favorite tracks`);
    }
  };

  const handleNextTrack = () => {
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % tracks.length;
    setCurrentTrack(tracks[nextIndex]);
    setProgressSec(0);
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrack(tracks[prevIndex]);
    setProgressSec(0);
    setIsPlaying(true);
  };

  const handleSortTracks = () => {
    const sorted = [...tracks].reverse();
    setTracks(sorted);
    showToast("Favorites order updated");
  };

  const handleSignOut = () => {
    showToast("Signing out of TunedIn Studio...");
    signOut({ callbackUrl: "/" });
  };

  const toggleGear = (key: keyof typeof gearToggles) => {
    setGearToggles((prev) => {
      const nextVal = !prev[key];
      showToast(`${key} ${nextVal ? "enabled" : "disabled"}`);
      return { ...prev, [key]: nextVal };
    });
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${rem.toString().padStart(2, "0")}`;
  };

  const scrollToSection = (id: string, navKey: "overview" | "favorites" | "playlists" | "rig" | "account") => {
    setActiveNav(navKey);
    setIsMobileMenuOpen(false);
    if (navKey === "rig") return;
    if (navKey === "account") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const elem = document.getElementById(id);
    if (elem) {
      const topOffset = elem.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Mobile Sidebar Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          className={styles.sidebarOverlay}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ============================================================== */}
      {/* 1. LEFT SIDEBAR NAVIGATION (Google Stitch Spec: w-64)          */}
      {/* ============================================================== */}
      <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen : ""}`}>
        <div>
          {/* Brand Header */}
          <Link href="/" className={styles.sidebarBrand}>
            <Image
              src="/music-logo-orbit.svg"
              alt="TunedIn Logo"
              width={40}
              height={40}
              className={styles.brandLogoImage}
              priority
            />
            <div className={styles.brandText}>
              <span className={styles.brandTitle}>TunedIn</span>
              <span className={styles.brandSubtitle}>Studio Wave</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className={styles.sidebarNav}>
            <button
              type="button"
              className={`${styles.navItem} ${activeNav === "overview" ? styles.navItemActive : ""}`}
              onClick={() => scrollToSection("profile-header", "overview")}
            >
              <span className={`material-symbols-outlined ${styles.navIcon}`}>person</span>
              <span>Overview</span>
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${activeNav === "favorites" ? styles.navItemActive : ""}`}
              onClick={() => scrollToSection("favorites-section", "favorites")}
            >
              <span className={`material-symbols-outlined ${styles.navIcon}`}>favorite</span>
              <span>Favorites</span>
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${activeNav === "playlists" ? styles.navItemActive : ""}`}
              onClick={() => scrollToSection("playlists-section", "playlists")}
            >
              <span className={`material-symbols-outlined ${styles.navIcon}`}>queue_music</span>
              <span>Playlists</span>
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${activeNav === "rig" ? styles.navItemActive : ""}`}
              onClick={() => {
                setActiveNav("rig");
                setIsMobileMenuOpen(false);
              }}
            >
              <span className={`material-symbols-outlined ${styles.navIcon}`}>tune</span>
              <span>Acoustic Rig</span>
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${activeNav === "account" ? styles.navItemActive : ""}`}
              onClick={() => scrollToSection("profile-header", "account")}
            >
              <span className={`material-symbols-outlined ${styles.navIcon}`}>manage_accounts</span>
              <span>Account</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Indicator */}
        <div className={styles.sidebarFooter}>
          <div className={styles.telemetryBadge}>
            <div className={styles.telemetryPulse} />
            <div className={styles.telemetryLabel}>
              <span className={styles.telemetryTitle}>Studio Stream</span>
              <span className={styles.telemetrySub}>24-Bit / 192kHz Lossless</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* 2. TOP STICKY HEADER (Offset left-64)                          */}
      {/* ============================================================== */}
      <header className={styles.topHeader}>
        <div className={styles.headerLeft}>
          <button
            type="button"
            className={styles.mobileMenuBtn}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          <Link href="/" className={styles.backBtn}>
            <span className="material-symbols-outlined">arrow_back</span>
            <span>Back</span>
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>User Profile</span>
        </div>

        <div className={styles.headerRight}>
          <button
            type="button"
            className={styles.editToggleBtn}
            onClick={() => setIsEditing(!isEditing)}
            title="Toggle Profile Editor"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
              {isEditing ? "close" : "edit"}
            </span>
            <span>{isEditing ? "Close" : "Edit Profile"}</span>
          </button>

          <div className={styles.userAvatarPill} title={profile.name}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
              person
            </span>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 3. MAIN CONTENT CONTAINER                                       */}
      {/* ============================================================== */}
      <main className={styles.mainContainer}>
        <div className={styles.contentWrapper}>
          {/* Guest Notice Ribbon if unauthenticated */}
          {status === "unauthenticated" && (
            <div className={styles.guestNoticeRibbon} role="status">
              <div className={styles.guestNoticeContent}>
                <span className={`material-symbols-outlined ${styles.guestNoticeIcon}`}>info</span>
                <div>
                  <strong>Guest Session:</strong> You are currently viewing a guest preview profile. Sign in with Google to sync your personal profile, favorite tracks, and audio rig presets.
                </div>
              </div>
              <Link href="/login" className={styles.guestNoticeCta}>
                Sign In with Google
              </Link>
            </div>
          )}

          {/* ============================================================ */}
          {/* PROFILE HEADER CARD (Stitch Spec)                            */}
          {/* ============================================================ */}
          <section id="profile-header" className={styles.profileHeaderCard}>
            <div className={styles.profileHeaderLeft}>
              {/* Avatar with Gradient Ring & Studio Lossless Active Badge */}
              <div className={styles.avatarRing}>
                <div className={styles.avatarGradientWrapper}>
                  <div className={styles.avatarImageWrapper}>
                    {profile.avatarUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={profile.avatarUrl}
                        alt={profile.name}
                        className={styles.avatarImage}
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className={styles.avatarInitials}>
                        {profile.name ? profile.name[0] : (profile.handle ? profile.handle.replace("@", "")[0] : "T")}
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.badgeLosslessActive} title="Studio Lossless Active">
                  <span className="material-symbols-outlined">high_quality</span>
                </div>
              </div>

              {/* Identity & Metadata */}
              <div className={styles.identityInfo}>
                <div className={styles.nameRow}>
                  <h1 className={styles.profileName}>{profile.name}</h1>
                  <span className={styles.tierBadge}>{profile.tier}</span>
                </div>

                <div className={styles.handleRow}>
                  <span className={styles.handleName}>{profile.handle}</span>
                  <span className={styles.bulletDot}>•</span>
                  <span className={styles.studioMemberLabel}>{profile.losslessTag}</span>
                </div>

                {profile.bio && (
                  <p
                    style={{
                      marginTop: "0.45rem",
                      marginBottom: "0.45rem",
                      color: "#565D63",
                      fontSize: "0.85rem",
                      lineHeight: "1.45",
                    }}
                  >
                    {profile.bio}
                  </p>
                )}

                <div className={styles.attributesGrid}>
                  <div className={styles.attributeItem}>
                    <span className={`material-symbols-outlined ${styles.attributeIcon}`}>mail</span>
                    <span>{profile.email}</span>
                  </div>
                  {profile.location && (
                    <div className={styles.attributeItem}>
                      <span className={`material-symbols-outlined ${styles.attributeIcon}`}>location_on</span>
                      <span>{profile.location}</span>
                    </div>
                  )}
                  <div className={styles.attributeItem}>
                    <span className={`material-symbols-outlined ${styles.attributeIcon}`}>
                      calendar_today
                    </span>
                    <span>Member since {profile.memberSince}</span>
                  </div>
                  <div className={styles.attributeItem}>
                    <span className={`material-symbols-outlined ${styles.attributeIconHighlight}`}>
                      favorite
                    </span>
                    <span className={styles.attributeCountText}>{tracks.length} Saved Tracks</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Action: Sign Out */}
            <div className={styles.profileHeaderRight}>
              <button
                type="button"
                className={styles.signOutBtn}
                onClick={handleSignOut}
                id="signout-header-btn"
                title="Sign out of TunedIn Studio"
              >
                <span className={`material-symbols-outlined ${styles.signOutIcon}`}>logout</span>
                <span>Sign Out</span>
              </button>
            </div>
          </section>

          {/* ============================================================ */}
          {/* INLINE PROFILE EDITOR (COLLAPSIBLE)                          */}
          {/* ============================================================ */}
          {isEditing && (
            <section className={styles.editorCard}>
              <div className={styles.editorHeader}>
                <h2 className={styles.editorTitle}>Edit Studio Profile</h2>
                <p className={styles.editorSubtitle}>
                  Customize your audiophile credentials, curator handle, and acoustics bio
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className={styles.editorForm}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="edit-name" className={styles.formLabel}>
                      Full Name
                    </label>
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
                    <label htmlFor="edit-handle" className={styles.formLabel}>
                      Handle
                    </label>
                    <input
                      id="edit-handle"
                      type="text"
                      className={styles.formInput}
                      value={editHandle}
                      disabled
                      style={{ opacity: 0.7, cursor: "not-allowed" }}
                      title="Your verified handle cannot be changed"
                    />
                    <span className={styles.readOnlyFieldNote}>Verified unique handle</span>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="edit-email" className={styles.formLabel}>
                      Email Address
                    </label>
                    <input
                      id="edit-email"
                      type="email"
                      className={styles.formInput}
                      value={editEmail}
                      disabled
                      style={{ opacity: 0.7, cursor: "not-allowed" }}
                      title="Email is synced to your Google account"
                    />
                    <span className={styles.readOnlyFieldNote}>Synced with Google authentication</span>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="edit-location" className={styles.formLabel}>
                      Studio / Listening Room Location
                    </label>
                    <input
                      id="edit-location"
                      type="text"
                      className={styles.formInput}
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      placeholder="e.g. Sunset Sound • Studio 2"
                    />
                  </div>

                  <div className={styles.formGroupFull}>
                    <label htmlFor="edit-bio" className={styles.formLabel}>
                      Curator Bio
                    </label>
                    <textarea
                      id="edit-bio"
                      rows={3}
                      className={styles.formTextarea}
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      placeholder="Describe your acoustic setup or musical focus..."
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

          {/* ============================================================ */}
          {/* VIEW: ACOUSTIC RIG (When 'Acoustic Rig' tab is active)       */}
          {/* ============================================================ */}
          {activeNav === "rig" ? (
            <section className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionHeaderLeft}>
                  <div className={styles.headerIconBadge}>
                    <span className="material-symbols-outlined">tune</span>
                  </div>
                  <div className={styles.sectionTitleGroup}>
                    <h2 className={styles.sectionTitle}>Calibrated Acoustic Rig &amp; DAC</h2>
                    <p className={styles.sectionSubtitle}>
                      Hardware endpoints and bit-perfect DAC configuration
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.gearCardGrid}>
                <div className={styles.gearEndpointCard}>
                  <span className={styles.gearCategoryLabel}>DIGITAL-TO-ANALOG CONVERTER</span>
                  <h3 className={styles.gearTitle}>Chord Hugo TT 2 + M Scaler</h3>
                  <p className={styles.gearDesc}>
                    Dual-BNC 705.6kHz FPGA million-tap pulse array upsampler with discrete class-A buffer.
                  </p>
                  <span className={styles.gearTagPill}>Bit-Perfect Master</span>
                </div>

                <div className={styles.gearEndpointCard}>
                  <span className={styles.gearCategoryLabel}>STUDIO REFERENCE MONITORS</span>
                  <h3 className={styles.gearTitle}>Neumann KH 120 II DSP + KH 750</h3>
                  <p className={styles.gearDesc}>
                    Mathematically Modeled Dispersion waveguide (MMD) with FIR phase alignment across 16Hz - 22kHz.
                  </p>
                  <span className={styles.gearTagPill}>Linear Phase</span>
                </div>

                <div className={styles.gearEndpointCard}>
                  <span className={styles.gearCategoryLabel}>REFERENCE HEADPHONES</span>
                  <h3 className={styles.gearTitle}>Sennheiser HD 800 S</h3>
                  <p className={styles.gearDesc}>
                    56mm Ring Radiator transducer with patented acoustic absorber system. 4.4mm balanced silver cable.
                  </p>
                  <span className={styles.gearTagPill}>Diffuse Field</span>
                </div>

                <div className={styles.gearEndpointCard}>
                  <span className={styles.gearCategoryLabel}>AUDIO DRIVER &amp; TRANSPORT</span>
                  <h3 className={styles.gearTitle}>ASIO Native Direct Stream</h3>
                  <p className={styles.gearDesc}>
                    Zero-copy Kernel bypass protocol with hardware clock synchronization and automatic DSD over PCM.
                  </p>
                  <span className={styles.gearTagPill}>Zero Jitter</span>
                </div>
              </div>

              {/* Hardware Toggles Matrix */}
              <div className={styles.toggleRowList}>
                <div className={styles.toggleRowItem}>
                  <div className={styles.toggleTextGroup}>
                    <span className={styles.toggleTitle}>Bit-Perfect Output Protocol</span>
                    <span className={styles.toggleSub}>
                      Bypasses OS sound mixers to ensure 100% bit-accurate delivery to DAC
                    </span>
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

                <div className={styles.toggleRowItem}>
                  <div className={styles.toggleTextGroup}>
                    <span className={styles.toggleTitle}>Hardware Volume Control Bypass</span>
                    <span className={styles.toggleSub}>
                      Locks digital volume slider to 100% to preserve full dynamic bit depth
                    </span>
                  </div>
                  <button
                    type="button"
                    className={`${styles.toggleSwitch} ${gearToggles.volumeBypass ? styles.toggleSwitchActive : ""}`}
                    onClick={() => toggleGear("volumeBypass")}
                    aria-label="Toggle volume control bypass"
                  >
                    <div className={styles.toggleKnob} />
                  </button>
                </div>

                <div className={styles.toggleRowItem}>
                  <div className={styles.toggleTextGroup}>
                    <span className={styles.toggleTitle}>WASAPI Exclusive Stream Locking</span>
                    <span className={styles.toggleSub}>
                      Grants TunedIn solitary access to endpoint, muting all OS notifications
                    </span>
                  </div>
                  <button
                    type="button"
                    className={`${styles.toggleSwitch} ${gearToggles.wasapiExclusive ? styles.toggleSwitchActive : ""}`}
                    onClick={() => toggleGear("wasapiExclusive")}
                    aria-label="Toggle WASAPI exclusive stream"
                  >
                    <div className={styles.toggleKnob} />
                  </button>
                </div>

                <div className={styles.toggleRowItem}>
                  <div className={styles.toggleTextGroup}>
                    <span className={styles.toggleTitle}>DSP Acoustic Room Correction</span>
                    <span className={styles.toggleSub}>
                      Injects 64-bit floating point convolution filters for non-linear room reflections
                    </span>
                  </div>
                  <button
                    type="button"
                    className={`${styles.toggleSwitch} ${gearToggles.dspCorrection ? styles.toggleSwitchActive : ""}`}
                    onClick={() => toggleGear("dspCorrection")}
                    aria-label="Toggle DSP Room correction"
                  >
                    <div className={styles.toggleKnob} />
                  </button>
                </div>
              </div>
            </section>
          ) : (
            <>
              {/* ============================================================ */}
              {/* FAVORITE TRACKS SECTION (Stitch Spec)                        */}
              {/* ============================================================ */}
              <section id="favorites-section" className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionHeaderLeft}>
                    <div className={styles.headerIconBadge}>
                      <span className="material-symbols-outlined">favorite</span>
                    </div>
                    <div className={styles.sectionTitleGroup}>
                      <div className={styles.titleWithPill}>
                        <h2 className={styles.sectionTitle}>Favorite Tracks</h2>
                        <span className={styles.countPill}>{tracks.length} songs</span>
                      </div>
                      <p className={styles.sectionSubtitle}>
                        Master audio quality favorites curated for analytical listening
                      </p>
                    </div>
                  </div>

                  <div className={styles.sectionHeaderActions}>
                    <button
                      type="button"
                      className={styles.playAllBtn}
                      onClick={handlePlayAll}
                    >
                      <span className="material-symbols-outlined">play_arrow</span>
                      <span>Play All</span>
                    </button>
                    <button
                      type="button"
                      className={styles.sortBtn}
                      onClick={handleSortTracks}
                      title="Sort Favorites"
                    >
                      <span className="material-symbols-outlined">sort</span>
                    </button>
                  </div>
                </div>

                {/* Track Table Header */}
                <div className={styles.trackTableHeader}>
                  <span>#</span>
                  <span>Title</span>
                  <span className={styles.trackAlbumCol}>Album</span>
                  <span style={{ textAlign: "right" }}>Time</span>
                </div>

                {/* Tracklist Items */}
                <div className={styles.trackList} id="track-list">
                  {tracks.map((track, idx) => {
                    const isCurrentPlaying = currentTrack.id === track.id && isPlaying;
                    return (
                      <div
                        key={track.id}
                        className={`${styles.trackRow} ${currentTrack.id === track.id ? styles.trackRowActive : ""}`}
                        onClick={() => handlePlayTrack(track)}
                      >
                        {/* Index / Play button on hover */}
                        <div className={styles.trackIndexCol}>
                          <span className={styles.trackNumber}>{idx + 1}</span>
                          <button
                            type="button"
                            className={styles.trackPlayIcon}
                            title={`Play ${track.title}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayTrack(track);
                            }}
                          >
                            <span className="material-symbols-outlined">
                              {isCurrentPlaying ? "pause_circle" : "play_circle"}
                            </span>
                          </button>
                        </div>

                        {/* Title & Artist & Album Cover */}
                        <div className={styles.trackInfoCol}>
                          <div className={styles.trackThumb}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={track.imageUrl}
                              alt={track.title}
                              className={styles.trackThumbImg}
                            />
                          </div>
                          <div className={styles.trackMeta}>
                            <span className={styles.trackTitle}>{track.title}</span>
                            <span className={styles.trackArtist}>{track.artist}</span>
                          </div>
                        </div>

                        {/* Album Column */}
                        <div className={styles.trackAlbumCol}>{track.album}</div>

                        {/* Duration & Favorite Action */}
                        <div className={styles.trackActionsCol}>
                          <span className={styles.trackDuration}>{track.duration}</span>
                          <button
                            type="button"
                            className={styles.heartBtn}
                            onClick={(e) => handleToggleFavorite(track.id, e)}
                            title="Remove from favorites"
                          >
                            <span className="material-symbols-outlined">favorite</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* ============================================================ */}
              {/* FAVORITE PLAYLISTS SECTION (Stitch Spec)                     */}
              {/* ============================================================ */}
              <section id="playlists-section" className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionHeaderLeft}>
                    <div className={styles.headerIconBadge}>
                      <span className="material-symbols-outlined">queue_music</span>
                    </div>
                    <div className={styles.sectionTitleGroup}>
                      <div className={styles.titleWithPill}>
                        <h2 className={styles.sectionTitle}>Favorite Playlists</h2>
                        <span className={styles.countPill}>
                          {PLAYLISTS_DATA.length} collections
                        </span>
                      </div>
                      <p className={styles.sectionSubtitle}>
                        Personal and studio-curated rotations for focused sound design
                      </p>
                    </div>
                  </div>

                  <Link href="/" className={styles.viewAllLink}>
                    <span>View All</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </Link>
                </div>

                <div className={styles.playlistsGrid}>
                  {PLAYLISTS_DATA.map((playlist) => (
                    <div
                      key={playlist.id}
                      className={styles.playlistCard}
                      onClick={() => {
                        showToast(`Selected playlist "${playlist.title}"`);
                        handlePlayAll();
                      }}
                    >
                      <div className={styles.playlistCoverWrapper}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={playlist.imageUrl}
                          alt={playlist.title}
                          className={styles.playlistCoverImg}
                        />
                        <button
                          type="button"
                          className={styles.playlistPlayHoverBtn}
                          title={`Play ${playlist.title}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            showToast(`Playing playlist "${playlist.title}"`);
                            handlePlayAll();
                          }}
                        >
                          <span className="material-symbols-outlined">play_arrow</span>
                        </button>
                      </div>

                      <h3 className={styles.playlistTitle}>{playlist.title}</h3>
                      <p className={styles.playlistCurator}>{playlist.curator}</p>

                      <div className={styles.playlistFooter}>
                        <span>{playlist.trackCount} tracks</span>
                        <span>{playlist.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      {/* ============================================================== */}
      {/* 4. PERSISTENT MINI PLAYER BAR (Stitch Spec: Bottom Bar)         */}
      {/* ============================================================== */}
      <footer className={styles.playerBar}>
        {/* Left: Track Information */}
        <div className={styles.playerTrackCol}>
          <div className={styles.playerThumb}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentTrack.imageUrl}
              alt={currentTrack.title}
              className={styles.playerThumbImg}
            />
          </div>
          <div className={styles.playerTrackDetails}>
            <span className={styles.playerTrackName}>{currentTrack.title}</span>
            <span className={styles.playerTrackSub}>
              {currentTrack.artist} • {currentTrack.album}
            </span>
          </div>
          <button
            type="button"
            className={styles.heartBtn}
            onClick={() => showToast(`Saved "${currentTrack.title}"`)}
            title="Favorite Track"
          >
            <span className="material-symbols-outlined">favorite</span>
          </button>
        </div>

        {/* Center: Controls & Playback Slider */}
        <div className={styles.playerCenterControls}>
          <div className={styles.controlButtonsRow}>
            <button
              type="button"
              className={`${styles.playerIconButton} ${isShuffle ? styles.playerIconButtonActive : ""}`}
              onClick={() => {
                setIsShuffle(!isShuffle);
                showToast(`Shuffle ${!isShuffle ? "on" : "off"}`);
              }}
              title="Shuffle"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                shuffle
              </span>
            </button>

            <button
              type="button"
              className={styles.playerIconButton}
              onClick={handlePrevTrack}
              title="Previous Track"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>
                skip_previous
              </span>
            </button>

            <button
              type="button"
              className={styles.playPausePillBtn}
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? "Pause" : "Play"}
            >
              <span className="material-symbols-outlined">
                {isPlaying ? "pause" : "play_arrow"}
              </span>
            </button>

            <button
              type="button"
              className={styles.playerIconButton}
              onClick={handleNextTrack}
              title="Next Track"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>
                skip_next
              </span>
            </button>

            <button
              type="button"
              className={`${styles.playerIconButton} ${isRepeat ? styles.playerIconButtonActive : ""}`}
              onClick={() => {
                setIsRepeat(!isRepeat);
                showToast(`Repeat ${!isRepeat ? "on" : "off"}`);
              }}
              title="Repeat"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                repeat
              </span>
            </button>
          </div>

          <div className={styles.progressBarContainer}>
            <span className={styles.timeText}>{formatSeconds(progressSec)}</span>
            <div
              className={styles.progressTrack}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                setProgressSec(Math.round(ratio * currentTrack.durationSeconds));
              }}
            >
              <div
                className={styles.progressFill}
                style={{
                  width: `${Math.min(100, (progressSec / currentTrack.durationSeconds) * 100)}%`,
                }}
              />
            </div>
            <span className={styles.timeText}>{currentTrack.duration}</span>
          </div>
        </div>

        {/* Right: Queue & Volume */}
        <div className={styles.playerRightCol}>
          <button
            type="button"
            className={styles.playerIconButton}
            onClick={() => showToast("Opening Studio Queue")}
            title="Studio Queue"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
              playlist_play
            </span>
          </button>

          <div className={styles.volumeControlGroup}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#5c4037" }}>
              {volume === 0 ? "volume_off" : volume < 50 ? "volume_down" : "volume_up"}
            </span>
            <div
              className={styles.volumeSliderTrack}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newVol = Math.round(Math.max(0, Math.min(1, clickX / rect.width)) * 100);
                setVolume(newVol);
              }}
              title={`Volume: ${volume}%`}
            >
              <div
                className={styles.volumeSliderFill}
                style={{ width: `${volume}%` }}
              />
            </div>
          </div>
        </div>
      </footer>

      {/* ============================================================== */}
      {/* 5. TOAST NOTIFICATION                                           */}
      {/* ============================================================== */}
      {toastMessage && (
        <div className={styles.toastPill} role="status">
          <span className="material-symbols-outlined">info</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
