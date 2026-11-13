"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import { Track, TRACKS_DATA } from "@/data/tracks";
import PipFloatingPlayer from "@/components/PipFloatingPlayer";

export interface MusicPlayerContextType {
  currentTrack: Track;
  isPlaying: boolean;
  currentTimeSec: number;
  durationSec: number;
  progress: number; // 0 - 100 %
  volume: number; // 0 - 100
  isMuted: boolean;
  isShuffle: boolean;
  isRepeat: boolean;
  playbackSpeed: number;
  isLiked: boolean;
  queue: Track[];

  // Picture in Picture state & controls
  isPipOpen: boolean;
  isPipPinned: boolean;
  autoPipEnabled: boolean;
  isUserIdle: boolean;
  isNativePipActive: boolean;

  // Methods
  playTrack: (track: Track, autoPlay?: boolean) => void;
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  seek: (seconds: number) => void;
  seekPercent: (percent: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setPlaybackSpeed: (speed: number) => void;
  toggleLike: () => void;
  setQueue: (tracks: Track[]) => void;

  // PiP methods
  openPip: (mode?: "in-app" | "native" | "auto") => Promise<void>;
  closePip: () => void;
  togglePip: () => Promise<void>;
  togglePipPin: () => void;
  setAutoPipEnabled: (enabled: boolean) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

function copyStylesToWindow(sourceDoc: Document, targetDoc: Document) {
  Array.from(sourceDoc.querySelectorAll('link[rel="stylesheet"], style')).forEach((node) => {
    targetDoc.head.appendChild(node.cloneNode(true));
  });
  targetDoc.title = `TunedIn Studio PiP - ${sourceDoc.title}`;
}

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const [queue, setQueueState] = useState<Track[]>(TRACKS_DATA);
  const [currentTrack, setCurrentTrack] = useState<Track>(TRACKS_DATA[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [durationSec, setDurationSec] = useState<number>(
    TRACKS_DATA[0]?.durationSeconds || 180
  );
  const [progress, setProgress] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeedState] = useState<number>(1.0);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  // Picture in Picture states
  const [isPipOpen, setIsPipOpen] = useState<boolean>(false);
  const [isPipPinned, setIsPipPinned] = useState<boolean>(false);
  const [autoPipEnabled, setAutoPipEnabledState] = useState<boolean>(true);
  const [isUserIdle, setIsUserIdle] = useState<boolean>(false);
  const [pipWindow, setPipWindow] = useState<Window | null>(null);
  const [isNativeVideoPip, setIsNativeVideoPip] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pipCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pipVideoRef = useRef<HTMLVideoElement | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasOpenedByAutoRef = useRef<boolean>(false);

  // Sync refs for event listeners and cross-tab broadcasts
  const isPlayingRef = useRef<boolean>(isPlaying);
  isPlayingRef.current = isPlaying;
  const currentTrackRef = useRef<Track>(currentTrack);
  currentTrackRef.current = currentTrack;
  const tabIdRef = useRef<string>("");
  const isRemoteSyncRef = useRef<boolean>(false);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const posterImgCacheRef = useRef<{ url: string; img: HTMLImageElement } | null>(null);

  // Initialize unique tab ID on mount
  useEffect(() => {
    tabIdRef.current =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
  }, []);

  // Pre-load track poster image for native canvas PiP rendering
  useEffect(() => {
    if (currentTrack.poster_url) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = currentTrack.poster_url;
      img.onload = () => {
        posterImgCacheRef.current = { url: currentTrack.poster_url!, img };
      };
      img.onerror = () => {
        posterImgCacheRef.current = null;
      };
    } else {
      posterImgCacheRef.current = null;
    }
  }, [currentTrack.poster_url]);

  // Sync duration whenever currentTrack changes
  useEffect(() => {
    if (currentTrack.durationSeconds) {
      setDurationSec(currentTrack.durationSeconds);
    }
  }, [currentTrack]);

  // Audio volume and mute sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : Math.max(0, Math.min(1, volume / 100));
    }
  }, [volume, isMuted]);

  // Audio playback rate / speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Play / Pause HTML5 Audio Element handling
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentTrack.audio_url) {
      if (audio.src !== currentTrack.audio_url) {
        audio.src = currentTrack.audio_url;
        audio.load();
      }

      if (isPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn("Audio playback interrupted or blocked:", err);
          });
        }
      } else {
        audio.pause();
      }
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying]);

  // Audio HTML5 event bindings
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const cur = audio.currentTime;
      const dur =
        audio.duration && !isNaN(audio.duration) && audio.duration > 0
          ? audio.duration
          : currentTrack.durationSeconds || 180;

      setCurrentTimeSec(Math.floor(cur));
      setDurationSec(Math.floor(dur));
      setProgress(dur > 0 ? (cur / dur) * 100 : 0);

      // MediaSession position sync for native OS lockscreen & controls
      if (
        typeof navigator !== "undefined" &&
        "mediaSession" in navigator &&
        "setPositionState" in navigator.mediaSession
      ) {
        try {
          if (dur > 0 && cur >= 0 && cur <= dur) {
            navigator.mediaSession.setPositionState({
              duration: dur,
              playbackRate: audio.playbackRate || 1.0,
              position: Math.min(cur, dur),
            });
          }
        } catch {
          // Ignore transient out-of-range bounds
        }
      }
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDurationSec(Math.floor(audio.duration));
      }
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(() => { });
      } else {
        nextTrack();
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [currentTrack, isRepeat]);

  // Fallback ticker for tracks without real audio_url (e.g. static studio tracks)
  useEffect(() => {
    if (!isPlaying || currentTrack.audio_url) return;

    const interval = setInterval(() => {
      setCurrentTimeSec((prev) => {
        const total = currentTrack.durationSeconds || durationSec || 180;
        if (prev >= total) {
          if (isRepeat) {
            setProgress(0);
            return 0;
          }
          nextTrack();
          return total;
        }
        const nextTime = prev + 1;
        setProgress((nextTime / total) * 100);
        return nextTime;
      });
    }, 1000 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, currentTrack, durationSec, isRepeat, playbackSpeed]);

  // Helper to broadcast changes across tabs
  const broadcast = useCallback((message: Record<string, unknown>) => {
    if (isRemoteSyncRef.current || !broadcastChannelRef.current) return;
    try {
      broadcastChannelRef.current.postMessage({
        ...message,
        senderTabId: tabIdRef.current,
      });
    } catch (err) {
      console.warn("BroadcastChannel post error:", err);
    }
  }, []);

  // Public Playback Methods
  const playTrack = useCallback(
    (track: Track, autoPlay = true) => {
      setCurrentTrack(track);
      setCurrentTimeSec(0);
      setProgress(0);
      if (track.durationSeconds) {
        setDurationSec(track.durationSeconds);
      }

      if (audioRef.current && track.audio_url) {
        if (audioRef.current.src !== track.audio_url) {
          audioRef.current.src = track.audio_url;
          audioRef.current.load();
        }
        audioRef.current.currentTime = 0;
      }

      if (autoPlay) {
        setIsPlaying(true);
        if (audioRef.current && track.audio_url) {
          audioRef.current.play().catch(() => { });
        }
      }

      broadcast({
        type: "PLAY_TRACK",
        track,
        autoPlay,
        currentTimeSec: 0,
        progress: 0,
      });
    },
    [broadcast]
  );

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      const next = !prev;
      broadcast({
        type: "PLAY_STATE",
        isPlaying: next,
        currentTimeSec,
      });
      return next;
    });
  }, [broadcast, currentTimeSec]);

  const play = useCallback(() => {
    setIsPlaying(true);
    broadcast({
      type: "PLAY_STATE",
      isPlaying: true,
      currentTimeSec,
    });
  }, [broadcast, currentTimeSec]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    broadcast({
      type: "PLAY_STATE",
      isPlaying: false,
      currentTimeSec,
    });
  }, [broadcast, currentTimeSec]);

  const seek = useCallback(
    (seconds: number) => {
      const boundedSec = Math.max(0, Math.min(seconds, durationSec));
      setCurrentTimeSec(boundedSec);
      const newPct = durationSec > 0 ? (boundedSec / durationSec) * 100 : 0;
      setProgress(newPct);

      if (audioRef.current && currentTrack.audio_url) {
        audioRef.current.currentTime = boundedSec;
      }

      broadcast({
        type: "SEEK",
        currentTimeSec: boundedSec,
        progress: newPct,
      });
    },
    [durationSec, currentTrack.audio_url, broadcast]
  );

  const seekPercent = useCallback(
    (percent: number) => {
      const pct = Math.max(0, Math.min(100, percent));
      const targetSec = Math.round(
        (pct / 100) * (durationSec || currentTrack.durationSeconds || 180)
      );
      seek(targetSec);
    },
    [durationSec, currentTrack.durationSeconds, seek]
  );

  const nextTrack = useCallback(() => {
    const list = queue.length > 0 ? queue : TRACKS_DATA;
    const currentIndex = list.findIndex(
      (t) => String(t.id) === String(currentTrack.id) || (t._id && t._id === currentTrack._id)
    );

    let nextIndex: number;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * list.length);
    } else {
      nextIndex = (currentIndex + 1) % list.length;
    }

    playTrack(list[nextIndex], true);
  }, [queue, currentTrack, isShuffle, playTrack]);

  const prevTrack = useCallback(() => {
    const list = queue.length > 0 ? queue : TRACKS_DATA;
    const currentIndex = list.findIndex(
      (t) => String(t.id) === String(currentTrack.id) || (t._id && t._id === currentTrack._id)
    );

    const prevIndex = (currentIndex - 1 + list.length) % list.length;
    playTrack(list[prevIndex], true);
  }, [queue, currentTrack, playTrack]);

  const setVolume = useCallback(
    (vol: number) => {
      const clamped = Math.max(0, Math.min(100, Math.round(vol)));
      setVolumeState(clamped);
      if (clamped > 0) setIsMuted(false);

      broadcast({
        type: "VOLUME",
        volume: clamped,
        isMuted: false,
      });
    },
    [broadcast]
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      broadcast({
        type: "VOLUME",
        volume,
        isMuted: next,
      });
      return next;
    });
  }, [broadcast, volume]);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => {
      const next = !prev;
      broadcast({
        type: "SHUFFLE_REPEAT",
        isShuffle: next,
        isRepeat,
      });
      return next;
    });
  }, [broadcast, isRepeat]);

  const toggleRepeat = useCallback(() => {
    setIsRepeat((prev) => {
      const next = !prev;
      broadcast({
        type: "SHUFFLE_REPEAT",
        isShuffle,
        isRepeat: next,
      });
      return next;
    });
  }, [broadcast, isShuffle]);

  const setPlaybackSpeed = useCallback((speed: number) => {
    setPlaybackSpeedState(speed);
  }, []);

  const toggleLike = useCallback(() => {
    setIsLiked((prev) => !prev);
  }, []);

  const setQueue = useCallback((tracks: Track[]) => {
    if (Array.isArray(tracks) && tracks.length > 0) {
      setQueueState(tracks);
    }
  }, []);

  // ==============================================================
  // Cross-Tab Synchronization via BroadcastChannel
  // ==============================================================
  useEffect(() => {
    if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") {
      return;
    }

    const channel = new BroadcastChannel("tunedin_studio_sync");
    broadcastChannelRef.current = channel;

    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || data.senderTabId === tabIdRef.current) return;

      isRemoteSyncRef.current = true;

      try {
        if (data.type === "PLAY_TRACK") {
          setCurrentTrack(data.track);
          setCurrentTimeSec(data.currentTimeSec || 0);
          setProgress(data.progress || 0);
          if (data.track.durationSeconds) {
            setDurationSec(data.track.durationSeconds);
          }
          if (data.autoPlay) {
            // Mute / pause local audio element so this tab doesn't output duplicate audio
            if (audioRef.current) {
              audioRef.current.pause();
            }
            setIsPlaying(true);
          }
        } else if (data.type === "PLAY_STATE") {
          if (data.isPlaying) {
            if (audioRef.current) {
              audioRef.current.pause();
            }
            setIsPlaying(true);
            if (typeof data.currentTimeSec === "number") {
              setCurrentTimeSec(data.currentTimeSec);
            }
          } else {
            setIsPlaying(false);
            if (audioRef.current) {
              audioRef.current.pause();
            }
          }
        } else if (data.type === "SEEK") {
          setCurrentTimeSec(data.currentTimeSec);
          setProgress(data.progress);
        } else if (data.type === "VOLUME") {
          setVolumeState(data.volume);
          setIsMuted(data.isMuted);
        } else if (data.type === "SHUFFLE_REPEAT") {
          setIsShuffle(data.isShuffle);
          setIsRepeat(data.isRepeat);
        } else if (data.type === "HEARTBEAT_REQUEST") {
          // Send back current playing status to newly opened tab
          if (isPlayingRef.current) {
            channel.postMessage({
              type: "HEARTBEAT_RESPONSE",
              senderTabId: tabIdRef.current,
              track: currentTrackRef.current,
              isPlaying: isPlayingRef.current,
              currentTimeSec: audioRef.current?.currentTime || 0,
              durationSec: audioRef.current?.duration || 180,
              volume,
              isMuted,
              isShuffle,
              isRepeat,
            });
          }
        } else if (data.type === "HEARTBEAT_RESPONSE") {
          if (!isPlayingRef.current && data.track) {
            setCurrentTrack(data.track);
            setIsPlaying(data.isPlaying);
            setCurrentTimeSec(Math.floor(data.currentTimeSec || 0));
            if (data.durationSec) setDurationSec(Math.floor(data.durationSec));
            if (data.volume !== undefined) setVolumeState(data.volume);
            if (data.isMuted !== undefined) setIsMuted(data.isMuted);
            if (data.isShuffle !== undefined) setIsShuffle(data.isShuffle);
            if (data.isRepeat !== undefined) setIsRepeat(data.isRepeat);
          }
        }
      } finally {
        setTimeout(() => {
          isRemoteSyncRef.current = false;
        }, 50);
      }
    };

    channel.addEventListener("message", handleMessage);

    // Announce presence to other tabs
    channel.postMessage({
      type: "HEARTBEAT_REQUEST",
      senderTabId: tabIdRef.current,
    });

    return () => {
      channel.removeEventListener("message", handleMessage);
      channel.close();
      broadcastChannelRef.current = null;
    };
  }, [volume, isMuted, isShuffle, isRepeat]);

  // ==============================================================
  // Picture-in-Picture: Native Document PiP & Canvas Video PiP
  // ==============================================================
  const drawPiPCanvas = useCallback(() => {
    const canvas = pipCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#220D0D");
    grad.addColorStop(0.5, "#4E0401");
    grad.addColorStop(1, "#160505");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle blueprint grid
    ctx.strokeStyle = "rgba(232, 140, 43, 0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Brand Header
    ctx.fillStyle = "#E88C2B";
    ctx.font = "bold 18px monospace";
    ctx.textAlign = "center";
    ctx.fillText("TUNEDIN SOUND SANCTUARY", w / 2, 40);

    // Poster Image (with rounded rect clip)
    const posterSize = 140;
    const posterX = (w - posterSize) / 2;
    const posterY = 60;
    const radius = 12;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(posterX + radius, posterY);
    ctx.arcTo(posterX + posterSize, posterY, posterX + posterSize, posterY + posterSize, radius);
    ctx.arcTo(posterX + posterSize, posterY + posterSize, posterX, posterY + posterSize, radius);
    ctx.arcTo(posterX, posterY + posterSize, posterX, posterY, radius);
    ctx.arcTo(posterX, posterY, posterX + posterSize, posterY, radius);
    ctx.closePath();
    ctx.clip();

    if (posterImgCacheRef.current?.img) {
      ctx.drawImage(posterImgCacheRef.current.img, posterX, posterY, posterSize, posterSize);
    } else {
      ctx.fillStyle = "#300808";
      ctx.fillRect(posterX, posterY, posterSize, posterSize);
      ctx.fillStyle = "#FFA73F";
      ctx.font = "bold 40px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("♫", w / 2, posterY + posterSize / 2);
    }
    ctx.restore();

    // Border around poster
    ctx.strokeStyle = "rgba(232, 140, 43, 0.4)";
    ctx.lineWidth = 2;
    ctx.strokeRect(posterX, posterY, posterSize, posterSize);

    // Track Title & Artist
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#FEFBF3";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText(currentTrack.title.slice(0, 26), w / 2, 245);

    ctx.fillStyle = "#FFA73F";
    ctx.font = "18px sans-serif";
    ctx.fillText(currentTrack.artist.slice(0, 32), w / 2, 278);

    ctx.fillStyle = "rgba(254, 251, 243, 0.65)";
    ctx.font = "14px monospace";
    ctx.fillText(`${currentTrack.format} • ${currentTrack.rate}`, w / 2, 308);

    // Live Animated Equalizer bars
    const bars = [14, 26, 40, 52, 38, 22, 34, 46, 28, 16];
    const barWidth = 6;
    const gap = 5;
    const startX = w / 2 - ((bars.length * (barWidth + gap)) / 2);
    bars.forEach((height, i) => {
      const h = isPlaying ? height * (0.4 + Math.random() * 0.8) : 6;
      ctx.fillStyle = "#E88C2B";
      ctx.fillRect(startX + i * (barWidth + gap), 370 - h, barWidth, h);
    });

    // Progress Bar
    const progressWidth = 360;
    const progressX = (w - progressWidth) / 2;
    const progressY = 410;
    const barH = 6;

    // Track background
    ctx.fillStyle = "rgba(254, 251, 243, 0.2)";
    ctx.fillRect(progressX, progressY, progressWidth, barH);

    // Fill
    const fillWidth = (Math.max(0, Math.min(100, progress)) / 100) * progressWidth;
    ctx.fillStyle = "#E88C2B";
    ctx.fillRect(progressX, progressY, fillWidth, barH);

    // Time texts
    const fmt = (s: number) => {
      const m = Math.floor(s / 60);
      const rem = Math.floor(s % 60);
      return `${m.toString().padStart(2, "0")}:${rem.toString().padStart(2, "0")}`;
    };
    ctx.fillStyle = "rgba(254, 251, 243, 0.7)";
    ctx.font = "13px monospace";
    ctx.textAlign = "left";
    ctx.fillText(fmt(currentTimeSec), progressX, progressY + 22);

    ctx.textAlign = "right";
    ctx.fillText(fmt(durationSec), progressX + progressWidth, progressY + 22);

    // Status pill
    ctx.textAlign = "center";
    ctx.font = "bold 13px monospace";
    ctx.fillStyle = isPlaying ? "#2ED573" : "#FFA73F";
    ctx.fillText(isPlaying ? "● PLAYING LOSSLESS" : "❚❚ PAUSED", w / 2, 475);
  }, [currentTrack, isPlaying, progress, currentTimeSec, durationSec]);

  const openNativeVideoPip = useCallback(async () => {
    const video = pipVideoRef.current;
    const canvas = pipCanvasRef.current;
    if (!video || !canvas) return;

    drawPiPCanvas();
    try {
      const streamableCanvas = canvas as HTMLCanvasElement & {
        captureStream?: (fps?: number) => MediaStream;
      };
      if (!video.srcObject && streamableCanvas.captureStream) {
        const stream = streamableCanvas.captureStream(20);
        video.srcObject = stream;
      }
      await video.play().catch(() => { });

      if (document.pictureInPictureEnabled && document.pictureInPictureElement !== video) {
        await video.requestPictureInPicture();
        setIsNativeVideoPip(true);
      }
    } catch (err) {
      console.warn("Video Picture-in-Picture request failed:", err);
    }
  }, [drawPiPCanvas]);

  const openNativePip = useCallback(async () => {
    // 1. Try Document Picture-in-Picture first (Chrome/Edge desktop)
    if (typeof window !== "undefined" && window.documentPictureInPicture) {
      try {
        const win = await window.documentPictureInPicture.requestWindow({
          width: 360,
          height: 250,
        });
        copyStylesToWindow(window.document, win.document);
        win.addEventListener("pagehide", () => {
          setPipWindow(null);
        });
        setPipWindow(win);
        setIsPipOpen(true);
        return;
      } catch (err) {
        console.warn("Document Picture-in-Picture failed, falling back to Video/In-App PiP:", err);
      }
    }

    // 2. Fallback to Canvas Stream Video PiP
    await openNativeVideoPip();
    setIsPipOpen(true);
  }, [openNativeVideoPip]);

  const openPip = useCallback(
    async (mode: "in-app" | "native" | "auto" = "in-app") => {
      if (mode === "native") {
        await openNativePip();
        return;
      }

      if (mode === "auto") {
        wasOpenedByAutoRef.current = true;
        // On tab switch, try native PiP if user had previous gesture; always open floating PiP
        try {
          if (window.documentPictureInPicture && !pipWindow) {
            const win = await window.documentPictureInPicture.requestWindow({
              width: 360,
              height: 250,
            });
            copyStylesToWindow(window.document, win.document);
            win.addEventListener("pagehide", () => setPipWindow(null));
            setPipWindow(win);
          }
        } catch {
          // Native requestWindow blocked without direct activation - floating PiP handles it
        }
        setIsPipOpen(true);
        return;
      }

      wasOpenedByAutoRef.current = false;
      setIsPipOpen(true);
    },
    [openNativePip, pipWindow]
  );

  const closePip = useCallback(() => {
    setIsPipOpen(false);
    setIsPipPinned(false);
    wasOpenedByAutoRef.current = false;
    if (pipWindow) {
      try {
        pipWindow.close();
      } catch {
        // ignore
      }
      setPipWindow(null);
    }
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().catch(() => { });
      setIsNativeVideoPip(false);
    }
  }, [pipWindow]);

  const togglePip = useCallback(async () => {
    if (isPipOpen || pipWindow || isNativeVideoPip) {
      closePip();
    } else {
      await openPip("in-app");
    }
  }, [isPipOpen, pipWindow, isNativeVideoPip, closePip, openPip]);

  const togglePipPin = useCallback(() => {
    setIsPipPinned((prev) => !prev);
    wasOpenedByAutoRef.current = false;
  }, []);

  const setAutoPipEnabled = useCallback((enabled: boolean) => {
    setAutoPipEnabledState(enabled);
  }, []);

  // Update MediaSession API for OS controls & Chrome tab-switch PiP trigger
  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        album: currentTrack.album || "TunedIn Studio",
        artwork: currentTrack.poster_url
          ? [
            { src: currentTrack.poster_url, sizes: "512x512", type: "image/jpeg" },
          ]
          : [{ src: "/music-logo-orbit.svg", sizes: "512x512", type: "image/svg+xml" }],
      });

      navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";

      navigator.mediaSession.setActionHandler("play", () => play());
      navigator.mediaSession.setActionHandler("pause", () => pause());
      navigator.mediaSession.setActionHandler("previoustrack", () => prevTrack());
      navigator.mediaSession.setActionHandler("nexttrack", () => nextTrack());
      navigator.mediaSession.setActionHandler("seekto", (details) => {
        if (typeof details.seekTime === "number") seek(details.seekTime);
      });

      // Browser automatic Picture-in-Picture action handler (Chrome tab switch)
      if ("setActionHandler" in navigator.mediaSession) {
        (
          navigator.mediaSession as unknown as {
            setActionHandler: (
              action: string,
              handler: (() => Promise<void>) | null
            ) => void;
          }
        ).setActionHandler("enterpictureinpicture", async () => {
          await openNativePip();
        });
      }
    } catch (err) {
      console.warn("MediaSession API registration issue:", err);
    }
  }, [currentTrack, isPlaying, play, pause, prevTrack, nextTrack, seek, openNativePip]);

  // Video PiP listeners for native window controls (play/pause) & exit
  useEffect(() => {
    const video = pipVideoRef.current;
    if (!video) return;

    const handleLeavePip = () => setIsNativeVideoPip(false);
    const handleVideoPlay = () => {
      if (!isPlayingRef.current) {
        play();
      }
    };
    const handleVideoPause = () => {
      if (isPlayingRef.current) {
        pause();
      }
    };

    video.addEventListener("leavepictureinpicture", handleLeavePip);
    video.addEventListener("play", handleVideoPlay);
    video.addEventListener("pause", handleVideoPause);

    return () => {
      video.removeEventListener("leavepictureinpicture", handleLeavePip);
      video.removeEventListener("play", handleVideoPlay);
      video.removeEventListener("pause", handleVideoPause);
    };
  }, [play, pause]);

  // Live animation loop for Native Video PiP canvas
  useEffect(() => {
    if (!isNativeVideoPip) return;

    let animId: number;
    let lastTime = 0;

    const renderLoop = (time: number) => {
      // Throttle to ~25fps to preserve CPU while keeping visualizer fluid
      if (time - lastTime > 40) {
        drawPiPCanvas();
        lastTime = time;
      }
      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animId);
  }, [isNativeVideoPip, drawPiPCanvas]);

  // ==============================================================
  // Inactivity ("unactivity") & Tab Switch ("visibilitychange") Detection
  // ==============================================================
  useEffect(() => {
    const INACTIVITY_MS = 20000; // 20 seconds of no interaction

    const resetIdleTimer = () => {
      setIsUserIdle(false);

      // If PiP was auto-opened purely by idle or tab-switch, and the user didn't pin it, dismiss on active return
      if (wasOpenedByAutoRef.current && !isPipPinned && !pipWindow) {
        setIsPipOpen(false);
        wasOpenedByAutoRef.current = false;
      }

      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }

      idleTimerRef.current = setTimeout(() => {
        setIsUserIdle(true);
        if (isPlaying && autoPipEnabled && !isPipOpen && !pipWindow) {
          wasOpenedByAutoRef.current = true;
          setIsPipOpen(true);
        }
      }, INACTIVITY_MS);
    };

    const handleVisibilityChange = async () => {
      if (document.hidden) {
        // User switched to another tab
        setIsUserIdle(true);
        if (isPlaying && autoPipEnabled) {
          await openPip("auto");
        }
      } else {
        // User returned to this tab
        resetIdleTimer();
      }
    };

    const activityEvents = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    activityEvents.forEach((evt) => {
      window.addEventListener(evt, resetIdleTimer, { passive: true });
    });

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", () => {
      if (isPlaying && autoPipEnabled) {
        openPip("auto");
      }
    });

    // Start idle countdown
    resetIdleTimer();

    return () => {
      activityEvents.forEach((evt) => {
        window.removeEventListener(evt, resetIdleTimer);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [isPlaying, autoPipEnabled, isPipOpen, isPipPinned, pipWindow, openPip]);

  const isNativePipActive = Boolean(pipWindow || isNativeVideoPip);

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTimeSec,
        durationSec,
        progress,
        volume,
        isMuted,
        isShuffle,
        isRepeat,
        playbackSpeed,
        isLiked,
        queue,
        isPipOpen,
        isPipPinned,
        autoPipEnabled,
        isUserIdle,
        isNativePipActive,
        playTrack,
        togglePlay,
        play,
        pause,
        seek,
        seekPercent,
        nextTrack,
        prevTrack,
        setVolume,
        toggleMute,
        toggleShuffle,
        toggleRepeat,
        setPlaybackSpeed,
        toggleLike,
        setQueue,
        openPip,
        closePip,
        togglePip,
        togglePipPin,
        setAutoPipEnabled,
      }}
    >
      {children}

      {/* Floating In-App / Document Picture-in-Picture Player */}
      {pipWindow ? (
        <PipFloatingPlayer
          targetWindow={pipWindow}
          onClose={closePip}
          isPinned={true}
        />
      ) : isPipOpen ? (
        <PipFloatingPlayer
          onClose={closePip}
          isPinned={isPipPinned}
          onTogglePin={togglePipPin}
          onRequestNativePip={openNativePip}
          isNativePipActive={isNativePipActive}
        />
      ) : null}

      {/* Persistent global audio element */}
      <audio
        ref={audioRef}
        preload="auto"
        style={{ display: "none" }}
      />

      {/* Off-screen canvas & video for fallback canvas stream PiP */}
      <canvas
        ref={pipCanvasRef}
        width={512}
        height={512}
        style={{ display: "none" }}
      />
      <video
        ref={pipVideoRef}
        muted
        playsInline
        style={{ display: "none" }}
      />
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error("useMusicPlayer must be used within a MusicPlayerProvider");
  }
  return context;
}
