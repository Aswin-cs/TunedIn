"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useDebounce } from "@/hooks/useDebounce";
import styles from "./login.module.css";

interface UsernameCheckResult {
  available: boolean;
  message: string;
}

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

export default function LoginPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sign-up exclusive username state & debouncing
  const [username, setUsername] = useState<string>("");
  const debouncedUsername = useDebounce<string>(username.trim(), 350);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [availability, setAvailability] = useState<UsernameCheckResult | null>(null);

  // Validate username availability on MongoDB when signing up
  useEffect(() => {
    if (activeTab !== "signup") {
      setAvailability(null);
      setIsChecking(false);
      return;
    }

    const trimmed = debouncedUsername.trim();

    if (!trimmed) {
      setAvailability(null);
      setIsChecking(false);
      return;
    }

    if (trimmed.length < 3) {
      setAvailability({
        available: false,
        message: "Username must be at least 3 characters long.",
      });
      setIsChecking(false);
      return;
    }

    if (trimmed.length > 20) {
      setAvailability({
        available: false,
        message: "Username must not exceed 20 characters.",
      });
      setIsChecking(false);
      return;
    }

    if (!USERNAME_REGEX.test(trimmed)) {
      setAvailability({
        available: false,
        message: "Only alphanumeric characters and underscores are allowed.",
      });
      setIsChecking(false);
      return;
    }

    const controller = new AbortController();
    setIsChecking(true);

    fetch(`/api/auth/check-username?username=${encodeURIComponent(trimmed)}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data: UsernameCheckResult) => {
        setAvailability(data);
        setIsChecking(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Failed to check username:", err);
          setAvailability({
            available: false,
            message: "Unable to verify username. Please try again.",
          });
          setIsChecking(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [debouncedUsername, activeTab]);

  // Is OAuth signup unlocked? (Only allowed if username is verified available)
  const isSignupDisabled =
    activeTab === "signup" &&
    (!availability?.available || isChecking || username.trim().length < 3);

  const handleGoogleAuth = async () => {
    try {
      if (activeTab === "signup") {
        if (isSignupDisabled) return;

        // Persist chosen username into cookie so NextAuth syncs this exact handle in MongoDB
        const cleanUsername = username.trim();
        document.cookie = `tunedin_pending_username=${encodeURIComponent(
          cleanUsername
        )}; path=/; max-age=600; SameSite=Lax`;
        try {
          localStorage.setItem("tunedin_pending_username", cleanUsername);
        } catch {
          // ignore localStorage access limits
        }
      }

      setIsLoading(true);
      await signIn("google", { callbackUrl: "/" });
    } catch (err) {
      console.error("Google authentication error:", err);
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      {/* ============================================================== */}
      {/* AMBIENT BOKEH LIGHTING & ACOUSTIC BACKGROUND                   */}
      {/* ============================================================== */}
      <div className={styles.ambientContainer} aria-hidden="true">
        <div className={styles.ambientOrb1} />
        <div className={styles.ambientOrb2} />
        <div className={styles.ambientOrb3} />

        {/* Concentric Music-Sync Pulse Rings */}
        <svg
          className={styles.acousticRings}
          viewBox="0 0 1000 1000"
          fill="none"
        >
          <circle
            className={styles.ring1}
            cx="500"
            cy="500"
            r="240"
            stroke="#E88C2B"
            strokeWidth="2"
            strokeDasharray="6 10"
          />
          <circle
            className={styles.ring2}
            cx="500"
            cy="500"
            r="410"
            stroke="#FFA73F"
            strokeWidth="1.8"
            strokeDasharray="5 9"
          />
        </svg>
      </div>

      {/* ============================================================== */}
      {/* TOP NAVIGATION HEADER                                          */}
      {/* ============================================================== */}
      <header className={styles.header}>
        {/* Left: Brand Logo + Identity */}
        <Link href="/" className={styles.brandLink}>
          <div className={styles.brandIconContainer}>
            <Image
              src="/music-logo-orbit.svg"
              alt="TunedIn Logo"
              width={42}
              height={42}
              className={styles.brandLogoImage}
              priority
            />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandTitle}>
              Tuned<span className={styles.brandTitleAccent}>In</span>
            </span>
            <span className={styles.brandSubtitle}>Studio Wave</span>
          </div>
        </Link>

        {/* Right: Telemetry / Back to Studio */}
        <div className={styles.headerActions}>
          <Link href="/" className={styles.supportLink}>
            <svg
              className={styles.supportIcon}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to Studio</span>
          </Link>
        </div>
      </header>

      {/* ============================================================== */}
      {/* MAIN AUTHENTICATION CANVAS                                     */}
      {/* ============================================================== */}
      <main className={styles.main}>
        <div className={styles.cardWrapper}>
          {/* Ambient Radiant Orange Backlighting */}
          <div className={styles.cardAura} aria-hidden="true">
            <div className={styles.cardAura1} />
            <div className={styles.cardAura2} />
          </div>

          {/* Dedicated Glassmorphic Container */}
          <div className={styles.glassCard}>
            {/* Animated Dynamic Gradient Lightfield */}
            <div className={styles.cardGradientCanvas} aria-hidden="true">
              <div className={styles.cardGradientBase} />
              <div className={styles.cardGlowOrb1} />
              <div className={styles.cardGlowOrb2} />
              <div className={styles.cardGlowOrb3} />
              <div className={styles.cardMeshShimmer} />
              <div className={styles.cardGridOverlay} />
            </div>

            {/* Authentication Notice Banner */}
            {status === "authenticated" ? (
              <div className={`${styles.authNoticeBanner} ${styles.authNoticeAuthenticated}`} role="status">
                <svg className={styles.authNoticeIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className={styles.authNoticeText}>
                  <span className={styles.authNoticeStrong}>Currently Authenticated:</span> Signed in as{" "}
                  <strong>{(session?.user as any)?.username || session?.user?.name || session?.user?.email}</strong>.
                </div>
              </div>
            ) : (
              <div className={`${styles.authNoticeBanner} ${styles.authNoticeGuest}`} role="status">
                <svg className={styles.authNoticeIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className={styles.authNoticeText}>
                  <span className={styles.authNoticeStrong}>Guest Session:</span> You are not authenticated. Sign in with Google below to enter TunedIn Studio.
                </div>
              </div>
            )}

            {/* Headline & Description */}
            <div className={styles.cardHeader}>
              <div key={activeTab} className={styles.tabContentTransition}>
                <h1 className={styles.cardTitle}>
                  {activeTab === "login" ? (
                    <>
                      Your sound, <br />
                      your sanct<span className={styles.whiteAccent}>uary.</span>
                    </>
                  ) : (
                    <>
                      Join the realm, <br />
                      pure sanct<span className={styles.whiteAccent}>uary.</span>
                    </>
                  )}
                </h1>

                <p className={styles.cardDescription}>
                  {activeTab === "login"
                    ? "Listen to millions of tracks, curated playlists, and spatial podcasts. Free on TunedIn."
                    : "Create your unique profile handle and discover master-fidelity streaming on TunedIn."}
                </p>
              </div>
            </div>

            {/* Pill Switcher */}
            <div className={styles.tabContainer}>
              <div className={styles.tabPillTrack} role="tablist">
                <div
                  className={`${styles.tabIndicator} ${
                    activeTab === "signup" ? styles.tabIndicatorSignup : ""
                  }`}
                  aria-hidden="true"
                />

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "login"}
                  className={`${styles.tabButton} ${
                    activeTab === "login" ? styles.tabButtonActive : ""
                  }`}
                  onClick={() => setActiveTab("login")}
                >
                  <svg
                    className={styles.tabIcon}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.2"
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Log In</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "signup"}
                  className={`${styles.tabButton} ${
                    activeTab === "signup" ? styles.tabButtonActive : ""
                  }`}
                  onClick={() => setActiveTab("signup")}
                >
                  <svg
                    className={styles.tabIcon}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.2"
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  <span>Sign Up</span>
                </button>
              </div>
            </div>

            {/* Username Input Section - ONLY rendered when activeTab === "signup" */}
            {activeTab === "signup" && (
              <div className={styles.usernameSection}>
                <div className={styles.usernameLabelRow}>
                  <label htmlFor="signup-username" className={styles.usernameLabel}>
                    Choose Username <span className={styles.usernameRequiredDot}>*</span>
                  </label>
                  {isChecking && (
                    <span className={styles.usernameMessageNeutral}>Checking MongoDB...</span>
                  )}
                </div>

                <div className={styles.usernameInputWrapper}>
                  <span className={styles.usernamePrefix} aria-hidden="true">
                    @
                  </span>
                  <input
                    id="signup-username"
                    type="text"
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck="false"
                    placeholder="yourname"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))}
                    className={`${styles.usernameInput} ${
                      availability?.available
                        ? styles.usernameInputAvailable
                        : availability && !availability.available
                        ? styles.usernameInputTaken
                        : ""
                    }`}
                  />
                  <div className={styles.usernameStatusBadge}>
                    {isChecking && <div className={styles.spinner} title="Checking availability..." />}
                    {!isChecking && availability?.available && (
                      <svg
                        className={styles.statusIconAvailable}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {!isChecking && availability && !availability.available && (
                      <svg
                        className={styles.statusIconTaken}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Validation Feedback Message */}
                {availability && (
                  <p
                    className={`${styles.usernameMessage} ${
                      availability.available
                        ? styles.usernameMessageAvailable
                        : styles.usernameMessageTaken
                    }`}
                  >
                    {availability.message}
                  </p>
                )}
                {!availability && !isChecking && (
                  <p className={`${styles.usernameMessage} ${styles.usernameMessageNeutral}`}>
                    Min 3 characters, letters, numbers, and underscores only.
                  </p>
                )}
              </div>
            )}

            {/* Google OAuth Action Button */}
            <div className={styles.ctaWrapper}>
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading || isSignupDisabled}
                className={`${styles.googleAuthBtn} ${
                  isSignupDisabled ? styles.googleAuthBtnDisabled : ""
                }`}
                title={
                  isSignupDisabled
                    ? "Please pick an available username first"
                    : activeTab === "login"
                    ? "Sign in directly with your Google account"
                    : "Complete Sign Up with Google"
                }
              >
                <div className={styles.btnSheen} aria-hidden="true" />
                {/* Official Multi-colored Google G Icon */}
                <svg className={styles.googleIcon} viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span key={activeTab} className={styles.tabInlineTransition}>
                  {isLoading
                    ? "Connecting to Google..."
                    : activeTab === "login"
                    ? "Continue with Google"
                    : "Sign up with Google"}
                </span>
              </button>

              {/* Helper notice if sign up is disabled waiting for username */}
              {isSignupDisabled && (
                <div className={styles.oauthPrereqHint}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" />
                    <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" />
                  </svg>
                  <span>Choose an available username above to continue with Google</span>
                </div>
              )}
            </div>

            {/* Terms of Service & Tab Switch Prompt */}
            <div className={styles.cardFooter}>
              <p className={styles.legalText}>
                By continuing, you agree to our{" "}
                <a href="#terms" className={styles.legalLink}>
                  Terms of Service
                </a>{" "}
                &amp;{" "}
                <a href="#privacy" className={styles.legalLink}>
                  Privacy Policy
                </a>
                .
              </p>

              <div className={styles.switchPrompt}>
                <span key={activeTab} className={styles.tabInlineTransition}>
                  {activeTab === "login"
                    ? "New to TunedIn?"
                    : "Already have an account?"}
                </span>
                <button
                  type="button"
                  className={styles.switchAction}
                  onClick={() =>
                    setActiveTab(activeTab === "login" ? "signup" : "login")
                  }
                >
                  <span key={activeTab} className={styles.tabInlineTransition}>
                    {activeTab === "login"
                      ? "Sign Up for free >"
                      : "Log In instead >"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
