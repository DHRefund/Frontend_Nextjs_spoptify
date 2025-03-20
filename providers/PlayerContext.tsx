"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Song } from "@/types/index";
import { audioService } from "@/services/audioService";

type SortType = "title" | "artist" | "createdAt";
type SortOrder = "asc" | "desc";

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
  sortType: SortType;
  sortOrder: SortOrder;
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
  sortedSongs: Song[];
  setSortType: (type: SortType) => void;
  setSortOrder: (order: SortOrder) => void;
  likedSongs: Song[];
  toggleLike: (songId: string) => Promise<void>;
  isLiked: (songId: string) => boolean;
  addSong: (song: Song) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [sortType, setSortType] = useState<SortType>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [shuffledSongs, setShuffledSongs] = useState<Song[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { songs: fetchedSongs, likedSongs: fetchedLikedSongs } = await audioService.fetchSongs();
        setSongs(fetchedSongs);
        setLikedSongs(fetchedLikedSongs);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle audio time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = audioService.getCurrentTime();
      const duration = audioService.getDuration();

      setCurrentTime(currentTime);
      setDuration(duration);

      const progressValue = (currentTime / duration) * 100;
      if (!isNaN(progressValue)) {
        setProgress(progressValue);
        document.documentElement.style.setProperty("--progress", `${progressValue}%`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handlePlayPause = async () => {
    if (!currentSong) return;

    if (isPlaying) {
      audioService.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioService.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Playback failed:", error);
      }
    }
  };

  const handleNextSong = () => {
    if (!currentSong) return;

    if (isShuffle) {
      const currentShuffleIndex = shuffledSongs.findIndex((song: Song) => song.id === currentSong.id);
      if (currentShuffleIndex < shuffledSongs.length - 1) {
        setCurrentSong(shuffledSongs[currentShuffleIndex + 1]);
      } else {
        // Nếu đã hết danh sách ngẫu nhiên, tạo danh sách mới
        const newShuffled = audioService.shuffleArray(songs);
        setShuffledSongs(newShuffled);
        setCurrentSong(newShuffled[0]);
      }
    } else {
      const currentIndex = songs.findIndex((song: Song) => song.id === currentSong.id);
      if (currentIndex < songs.length - 1) {
        setCurrentSong(songs[currentIndex + 1]);
      }
    }
  };

  const handlePrevSong = () => {
    if (!currentSong) return;

    if (isShuffle) {
      const currentShuffleIndex = shuffledSongs.findIndex((song: Song) => song.id === currentSong.id);
      if (currentShuffleIndex > 0) {
        setCurrentSong(shuffledSongs[currentShuffleIndex - 1]);
      }
    } else {
      const currentIndex = songs.findIndex((song: Song) => song.id === currentSong.id);
      if (currentIndex > 0) {
        setCurrentSong(songs[currentIndex - 1]);
      }
    }
  };

  const handleProgressChange = (value: number) => {
    if (!duration) return;

    const exactTime = (value * duration) / 100;
    setProgress(value);
    audioService.seek(exactTime);
    setCurrentTime(exactTime);
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    audioService.setVolume(value);
    if (value === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      audioService.setVolume(volume);
      setIsMuted(false);
    } else {
      audioService.setVolume(0);
      setIsMuted(true);
    }
  };

  const toggleRepeat = () => {
    setIsRepeat((prev) => !prev);
  };

  const toggleShuffle = () => {
    if (!isShuffle) {
      // Khi bật shuffle, tạo danh sách phát ngẫu nhiên mới
      const shuffled = audioService.shuffleArray(songs);
      setShuffledSongs(shuffled);
      // Nếu đang phát nhạc, thêm bài hát hiện tại vào đầu danh sách
      if (currentSong) {
        const currentIndex = shuffled.findIndex((song: Song) => song.id === currentSong.id);
        if (currentIndex !== -1) {
          shuffled.splice(currentIndex, 1);
          shuffled.unshift(currentSong);
          setShuffledSongs(shuffled);
        }
      }
    }
    setIsShuffle((prev) => !prev);
  };

  // Tính toán danh sách đã sắp xếp
  const sortedSongs = useMemo(() => {
    return [...songs].sort((a, b) => {
      let compareResult = 0;

      switch (sortType) {
        case "title":
          compareResult = a.title.localeCompare(b.title);
          break;
        case "artist":
          compareResult = a.artist.localeCompare(b.artist);
          break;
        case "createdAt":
          compareResult = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
      }

      return sortOrder === "asc" ? compareResult : -compareResult;
    });
  }, [songs, sortType, sortOrder]);

  const toggleLike = async (songId: string) => {
    try {
      const { data } = await audioService.toggleLikeSong(songId);
      console.log("Toggle like response:", data);

      if (data.liked) {
        const songToAdd = songs.find((s) => s.id === songId);
        if (songToAdd) {
          setLikedSongs((prev) => [...prev, { ...songToAdd, likedAt: new Date() }]);
          toast.success("Added to your Liked Songs");
        }
      } else {
        setLikedSongs((prev) => prev.filter((s) => s.id !== songId));
        toast.success("Removed from your Liked Songs");
      }
    } catch (error) {
      console.error("Toggle like error:", error);
      toast.error("Failed to update liked songs");
    }
  };

  const isLiked = (songId: string) => {
    if (!songId || !Array.isArray(likedSongs)) return false;
    const found = likedSongs.find((song) => song.id === songId);
    console.log(`Checking like status for song ${songId}:`, !!found);
    return !!found;
  };

  const addSong = (song: Song) => {
    alert("addSong");
    // setSongs((prev) => [song, ...prev]); // Thêm bài hát mới vào đầu danh sách
  };

  const value = {
    songs,
    currentSong,
    isLoading,
    isPlaying,
    audio: null,
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
    formatTime: audioService.formatTime,
    sortType,
    sortOrder,
    setSortType,
    setSortOrder,
    sortedSongs,
    likedSongs,
    toggleLike,
    isLiked,
    addSong,
  };

  // Cleanup
  useEffect(() => {
    return () => {
      audioService.destroy();
    };
  }, []);

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
