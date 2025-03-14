"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Song } from "@/types/index";

interface PlayerContextType {
  songs: Song[];
  currentSong: Song | null;
  isLoading: boolean;
  isPlaying: boolean;
  audio: HTMLAudioElement | null;
  progress: number;
  volume: number;
  isMuted: boolean;
  isRepeat: boolean;
  isShuffle: boolean;
  duration: number;
  currentTime: number;
  setCurrentSong: (song: Song) => void;
  setSongs: (songs: Song[]) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  handlePlayPause: () => void;
  handleNextSong: () => void;
  handlePrevSong: () => void;
  handleProgressChange: (value: number) => void;
  handleVolumeChange: (value: number) => void;
  toggleMute: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  formatTime: (time: number) => string;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Initialize audio
  useEffect(() => {
    const audioElement = new Audio();
    setAudio(audioElement);

    return () => {
      audioElement.pause();
      audioElement.src = "";
    };
  }, []);

  // Handle audio events
  useEffect(() => {
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      const progressValue = (audio.currentTime / audio.duration) * 100;
      console.log("progressValue", progressValue);
      if (!isNaN(progressValue) && Math.abs(progress - progressValue) > 0.1) {
        setProgress(progressValue);
        document.documentElement.style.setProperty("--progress", `${progressValue}%`);
      }
    };
    console.log("progress", progress);

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNextSong();
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audio, isRepeat, progress]);

  // Load and play song when currentSong changes
  useEffect(() => {
    if (audio && currentSong) {
      audio.src = currentSong.songUrl;
      audio.load();
      audio.play();
      setIsPlaying(true);
    }
    console.log("currentSong change");
  }, [currentSong, audio]);

  // Fetch songs
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const { data } = await axiosInstance.get("/songs");
        setSongs(data);
      } catch (error) {
        toast.error("Failed to load songs");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (!audio || !currentSong) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleNextSong = () => {
    if (!currentSong) return;
    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    if (currentIndex < songs.length - 1) {
      setCurrentSong(songs[currentIndex + 1]);
    }
  };

  const handlePrevSong = () => {
    if (!currentSong) return;
    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    if (currentIndex > 0) {
      setCurrentSong(songs[currentIndex - 1]);
    }
  };

  const handleProgressChange = (value: number) => {
    if (!audio || !duration) return;

    const exactTime = (value * duration) / 100;

    setProgress(value);

    audio.currentTime = exactTime;
    setCurrentTime(exactTime);
  };

  const handleVolumeChange = (value: number) => {
    if (!audio) return;
    setVolume(value);
    audio.volume = value;
    if (value === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!audio) return;
    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleRepeat = () => setIsRepeat(!isRepeat);
  const toggleShuffle = () => setIsShuffle(!isShuffle);

  const value = {
    songs,
    currentSong,
    isLoading,
    isPlaying,
    audio,
    progress,
    volume,
    isMuted,
    isRepeat,
    isShuffle,
    duration,
    currentTime,
    setCurrentSong,
    setSongs,
    setIsPlaying,
    handlePlayPause,
    handleNextSong,
    handlePrevSong,
    handleProgressChange,
    handleVolumeChange,
    toggleMute,
    toggleRepeat,
    toggleShuffle,
    formatTime,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
