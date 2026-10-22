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
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

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

  const audioRef = useRef<HTMLAudioElement | null>(null);

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
      const dur = audio.duration && !isNaN(audio.duration) && audio.duration > 0
        ? audio.duration
        : currentTrack.durationSeconds || 180;

      setCurrentTimeSec(Math.floor(cur));
      setDurationSec(Math.floor(dur));
      setProgress(dur > 0 ? (cur / dur) * 100 : 0);
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDurationSec(Math.floor(audio.duration));
      }
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
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

  // Public Methods
  const playTrack = useCallback((track: Track, autoPlay = true) => {
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
        audioRef.current.play().catch(() => {});
      }
    }
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const seek = useCallback(
    (seconds: number) => {
      const boundedSec = Math.max(0, Math.min(seconds, durationSec));
      setCurrentTimeSec(boundedSec);
      if (durationSec > 0) {
        setProgress((boundedSec / durationSec) * 100);
      }
      if (audioRef.current && currentTrack.audio_url) {
        audioRef.current.currentTime = boundedSec;
      }
    },
    [durationSec, currentTrack.audio_url]
  );

  const seekPercent = useCallback(
    (percent: number) => {
      const pct = Math.max(0, Math.min(100, percent));
      const targetSec = Math.round((pct / 100) * (durationSec || currentTrack.durationSeconds || 180));
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

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(vol)));
    setVolumeState(clamped);
    if (clamped > 0) setIsMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setIsRepeat((prev) => !prev);
  }, []);

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
      }}
    >
      {children}
      {/* Persistent global audio element */}
      <audio
        ref={audioRef}
        preload="auto"
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
