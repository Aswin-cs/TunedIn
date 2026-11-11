"use client";

import Image from "next/image";
import styles from "./StudioLoadingScreen.module.css";

interface StudioLoadingScreenProps {
  title?: string;
  subtitle?: string;
}

export default function StudioLoadingScreen({
  title = "Syncing Studio Masters",
  subtitle = "Fetching master recordings and acoustic telemetry from backend...",
}: StudioLoadingScreenProps) {
  return (
    <div
      className={styles.loadingWrapper}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={title}
    >
      <div className={styles.ambientLayer} aria-hidden="true">
        <div className={styles.ambientOrbPrimary} />
        <div className={styles.ambientOrbAccent} />
      </div>

      <div className={styles.stageCard}>
        <div className={styles.emblemWrap}>
          <div className={styles.orbitRingOuter} aria-hidden="true" />
          <div className={styles.orbitRing} aria-hidden="true" />
          <div className={styles.logoContainer}>
            <Image
              src="/music-logo-static.svg"
              alt="TunedIn Logo"
              width={56}
              height={56}
              className={styles.logoImage}
              priority
            />
          </div>
        </div>

        <div className={styles.brandBlock}>
          <span className={styles.brandName}>
            Tuned<span className={styles.brandAccent}>In</span>
          </span>
          <span className={styles.brandTagline}>Studio Wave</span>
        </div>

        <div className={styles.equalizer} aria-hidden="true">
          <span className={styles.eqBar} />
          <span className={styles.eqBar} />
          <span className={styles.eqBar} />
          <span className={styles.eqBar} />
          <span className={styles.eqBar} />
        </div>

        <div className={styles.statusTextBlock}>
          <p className={styles.statusTitle}>{title}</p>
          <p className={styles.statusSub}>{subtitle}</p>
        </div>

        <div className={styles.progressTrack} aria-hidden="true">
          <div className={styles.progressSweep} />
        </div>

        <div className={styles.telemetryPill}>
          <span className={styles.telemetryDot} aria-hidden="true" />
          <span>192kHz • 24-bit • Lossless DAC</span>
        </div>
      </div>
    </div>
  );
}

