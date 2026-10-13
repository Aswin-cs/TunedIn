"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./login.module.css";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  const handleGoogleAuth = () => {
    console.log(`Initiating Google OAuth for: ${activeTab}`);
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
              TUNED<span className={styles.brandTitleAccent}>IN</span>
            </span>
            <span className={styles.brandSubtitle}>Architectural Acoustics</span>
          </div>
        </Link>

        {/* Right: Technical Telemetry Badge & Support Link */}
        <div className={styles.headerActions}>

          <a href="#support" className={styles.supportLink}>
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
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span>Support</span>
          </a>
        </div>
      </header>

      {/* ============================================================== */}
      {/* MAIN AUTHENTICATION CANVAS (MATCHING USER REFERENCE IMAGE)      */}
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
                    : "Discover pure acoustic reproduction and master-fidelity streaming engineered for audiophiles."}
                </p>
              </div>
            </div>

            {/* Pill Switcher */}
            <div className={styles.tabContainer}>
              <div className={styles.tabPillTrack} role="tablist">
                {/* Sliding Indicator Pill */}
                <div
                  className={`${styles.tabIndicator} ${activeTab === "signup" ? styles.tabIndicatorSignup : ""
                    }`}
                  aria-hidden="true"
                />

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "login"}
                  className={`${styles.tabButton} ${activeTab === "login" ? styles.tabButtonActive : ""
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
                  className={`${styles.tabButton} ${activeTab === "signup" ? styles.tabButtonActive : ""
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
                      strokeWidth="2"
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  <span>Sign Up</span>
                </button>
              </div>
            </div>

            {/* Continue with Google Button */}
            <div className={styles.ctaWrapper}>
              <button
                type="button"
                onClick={handleGoogleAuth}
                className={styles.googleAuthBtn}
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
                  {activeTab === "login"
                    ? "Continue with Google"
                    : "Sign up with Google"}
                </span>
              </button>
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
