"use client";

import React, { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useMusicPlayer } from "@/context/MusicPlayerContext";
import DragSlider from "./DragSlider";
import styles from "./PipFloatingPlayer.module.css";

const subscribeNoop = () => () => {};
const getClientTrue = () => true;
const getClientFalse = () => false;

interface PipFloatingPlayerProps {
  /** Optional external window when rendered inside Document Picture-in-Picture */
  targetWindow?: Window | null;
  /** Callback to close or dismiss PiP */
  onClose?: () => void;
  /** Whether the user manually pinned the floating player */
  isPinned?: boolean;
  /** Toggle pin state */
  onTogglePin?: () => void;
  /** Request OS level native Document/Video Picture-in-Picture */
  onRequestNativePip?: () => Promise<void>;
  /** Whether native PiP is currently active */
  isNativePipActive?: boolean;
}

export default function PipFloatingPlayer({
  targetWindow = null,
  onClose,
  isPinned = false,
  onTogglePin,
  onRequestNativePip,
  isNativePipActive = false,
}: PipFloatingPlayerProps) {
  const {
    currentTrack,
    isPlaying,
    currentTimeSec,
    durationSec,
    progress,
    volume,
    isMuted,
    isShuffle,
    isRepeat,
    togglePlay,
    nextTrack,
    prevTrack,
    seekPercent,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    autoPipEnabled,
    setAutoPipEnabled,
  } = useMusicPlayer();

  const isClient = useSyncExternalStore(subscribeNoop, getClientTrue, getClientFalse);
  const [scrubPreview, setScrubPreview] = useState<number | null>(null);
  const [failedPosterUrl, setFailedPosterUrl] = useState<string | null>(null);

  const posterFailed = Boolean(
    currentTrack.poster_url && failedPosterUrl === currentTrack.poster_url
  );

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const displayedTimeSec =
    scrubPreview !== null
      ? Math.round(
          (scrubPreview / 100) * (durationSec || currentTrack.durationSeconds || 180)
        )
      : currentTimeSec;

  const content = (
    <aside
      className={`${styles.pipContainer} ${targetWindow ? styles.pipStandaloneWindow : ""}`}
      aria-label="Picture in Picture Audio Player"
    >
      {/* Header */}
      <div className={styles.pipHeader}>
        <div className={styles.pipTitleGroup}>
          <span
            className={`${styles.pipLiveDot} ${
              isPlaying ? styles.pipLiveDotActive : ""
            }`}
          />
          <span className={styles.pipHeading}>
            {targetWindow ? "Studio Popout" : "Studio Mini PiP"}
          </span>
          <button
            type="button"
            className={styles.pipAutoBadge}
            onClick={() => setAutoPipEnabled(!autoPipEnabled)}
            title={
              autoPipEnabled
                ? "Auto-PiP enabled: Opens on tab switch or idle. Click to disable."
                : "Auto-PiP disabled. Click to enable auto on tab switch/idle."
            }
          >
            {autoPipEnabled ? "Auto: ON" : "Auto: OFF"}
          </button>
        </div>

        <div className={styles.pipControlsGroup}>
          {onRequestNativePip && !targetWindow && (
            <button
              type="button"
              className={styles.pipIconBtn}
              onClick={onRequestNativePip}
              title={
                isNativePipActive
                  ? "Native Picture-in-Picture active"
                  : "Pop out to OS floating window"
              }
              aria-label="Pop out to floating window"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          )}

          {onTogglePin && !targetWindow && (
            <button
              type="button"
              className={`${styles.pipIconBtn} ${isPinned ? styles.pipIconBtnPinned : ""}`}
              onClick={onTogglePin}
              title={isPinned ? "Unpin (dismisses on user activity)" : "Pin to stay visible on screen"}
              aria-label="Pin floating player"
            >
              <svg width="13" height="13" fill={isPinned ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          )}

          {onClose && (
            <button
              type="button"
              className={styles.pipIconBtn}
              onClick={onClose}
              title="Close Picture in Picture"
              aria-label="Close Picture in Picture"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Main Track Info Body */}
      <div className={styles.pipBody}>
        <div className={styles.pipArtworkWrap}>
          {currentTrack.poster_url && !posterFailed ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={currentTrack.poster_url}
              alt={currentTrack.title}
              className={styles.pipArtworkImg}
              onError={() => setFailedPosterUrl(currentTrack.poster_url ?? null)}
            />
          ) : (
            <div className={styles.pipVinylFallback}>
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
          )}
        </div>

        <div className={styles.pipMetaBlock}>
          <Link
            href={`/song/${currentTrack.id}`}
            className={styles.pipTrackTitleLink}
            title={currentTrack.title}
            onClick={() => targetWindow?.close()}
          >
            {currentTrack.title}
          </Link>
          <span className={styles.pipArtistText}>
            {currentTrack.artist}
            {currentTrack.album ? ` • ${currentTrack.album}` : ""}
          </span>
          <span className={styles.pipFormatTag}>
            {currentTrack.format} • {currentTrack.rate}
          </span>
        </div>

        {isPlaying && (
          <div className={styles.pipWaveform} aria-hidden="true">
            <div className={styles.pipWaveBar} />
            <div className={styles.pipWaveBar} />
            <div className={styles.pipWaveBar} />
          </div>
        )}
      </div>

      {/* Scrubber timeline */}
      <div className={styles.pipScrubberRow}>
        <span className={styles.pipTimecode}>{formatSeconds(displayedTimeSec)}</span>
        <DragSlider
          value={scrubPreview ?? progress}
          onChange={(pct) => setScrubPreview(pct)}
          onChangeEnd={(pct) => {
            setScrubPreview(null);
            seekPercent(pct);
          }}
          ariaLabel="Mini player timeline scrubber"
          ariaValueText={`${formatSeconds(displayedTimeSec)} of ${currentTrack.duration}`}
          trackClassName={styles.pipScrubberTrack}
          fillClassName={styles.pipScrubberProgress}
          thumbClassName={styles.pipScrubberThumb}
        />
        <span className={styles.pipTimecode}>{currentTrack.duration}</span>
      </div>

      {/* Transport Controls */}
      <div className={styles.pipTransportRow}>
        <div className={styles.pipTransportMain}>
          <button
            type="button"
            className={`${styles.pipActionBtn} ${isShuffle ? styles.pipActionBtnActive : ""}`}
            onClick={toggleShuffle}
            title="Toggle Shuffle"
            aria-label="Toggle Shuffle"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H4m0 0l4 4m-4-4l4-4m8 0h4m0 0l-4-4m4 4l-4 4" />
            </svg>
          </button>

          <button
            type="button"
            className={styles.pipActionBtn}
            onClick={prevTrack}
            title="Previous Track"
            aria-label="Previous Track"
          >
            <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          <button
            type="button"
            className={styles.pipPlayBtn}
            onClick={togglePlay}
            title={isPlaying ? "Pause" : "Play"}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            className={styles.pipActionBtn}
            onClick={nextTrack}
            title="Next Track"
            aria-label="Next Track"
          >
            <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>

          <button
            type="button"
            className={`${styles.pipActionBtn} ${isRepeat ? styles.pipActionBtnActive : ""}`}
            onClick={toggleRepeat}
            title="Toggle Repeat"
            aria-label="Toggle Repeat"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Volume */}
        <div className={styles.pipVolumeGroup}>
          <button
            type="button"
            className={styles.pipActionBtn}
            onClick={toggleMute}
            title={isMuted || volume === 0 ? "Unmute" : "Mute"}
            aria-label="Toggle Mute"
          >
            {isMuted || volume === 0 ? (
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>

          <DragSlider
            value={isMuted ? 0 : volume}
            onChange={(pct) => setVolume(Math.round(pct))}
            ariaLabel="Volume slider"
            ariaValueText={`${isMuted ? 0 : volume}%`}
            step={5}
            trackClassName={styles.pipVolumeTrack}
            fillClassName={styles.pipVolumeFill}
            thumbClassName={styles.pipVolumeThumb}
          />
        </div>
      </div>
    </aside>
  );

  if (!isClient) return null;

  if (targetWindow) {
    return createPortal(content, targetWindow.document.body);
  }

  return createPortal(content, document.body);
}
