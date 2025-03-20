"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Song } from "@/types/index";

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
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [shuffledSongs, setShuffledSongs] = useState<Song[]>([]);
  const [sortType, setSortType] = useState<SortType>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);

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
      if (!isNaN(progressValue) && Math.abs(progress - progressValue) > 0.1) {
        setProgress(progressValue);
        document.documentElement.style.setProperty("--progress", `${progressValue}%`);
      }
    };

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
  }, [currentSong, audio]);

  // Fetch songs và liked songs
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [songsResponse, likedResponse] = await Promise.all([
          axiosInstance.get("/songs"),
          axiosInstance.get("/songs/liked"),
        ]);

        console.log("Songs response:", songsResponse.data);
        console.log("Liked songs response:", likedResponse.data);

        setSongs(songsResponse.data);

        // Đảm bảo likedResponse.data là array và có data
        if (Array.isArray(likedResponse.data) && likedResponse.data.length > 0) {
          setLikedSongs(likedResponse.data);
        } else {
          setLikedSongs([]);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load data");
        setSongs([]);
        setLikedSongs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Hàm để tạo danh sách phát ngẫu nhiên
  const shuffleArray = (array: Song[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

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

    if (isShuffle) {
      const currentShuffleIndex = shuffledSongs.findIndex((s) => s.id === currentSong.id);
      if (currentShuffleIndex < shuffledSongs.length - 1) {
        setCurrentSong(shuffledSongs[currentShuffleIndex + 1]);
      } else {
        // Nếu đã hết danh sách ngẫu nhiên, tạo danh sách mới
        const newShuffled = shuffleArray(songs);
        setShuffledSongs(newShuffled);
        setCurrentSong(newShuffled[0]);
      }
    } else {
      const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
      if (currentIndex < songs.length - 1) {
        setCurrentSong(songs[currentIndex + 1]);
      }
    }
  };

  const handlePrevSong = () => {
    if (!currentSong) return;

    if (isShuffle) {
      const currentShuffleIndex = shuffledSongs.findIndex((s) => s.id === currentSong.id);
      if (currentShuffleIndex > 0) {
        setCurrentSong(shuffledSongs[currentShuffleIndex - 1]);
      }
    } else {
      const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
      if (currentIndex > 0) {
        setCurrentSong(songs[currentIndex - 1]);
      }
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

  const toggleRepeat = () => {
    setIsRepeat((prev) => !prev);
  };

  const toggleShuffle = () => {
    if (!isShuffle) {
      // Khi bật shuffle, tạo danh sách phát ngẫu nhiên mới
      const shuffled = shuffleArray(songs);
      setShuffledSongs(shuffled);
      // Nếu đang phát nhạc, thêm bài hát hiện tại vào đầu danh sách
      if (currentSong) {
        const currentIndex = shuffled.findIndex((s) => s.id === currentSong.id);
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
      const { data } = await axiosInstance.post(`/songs/${songId}/like`);
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
    setSongs((prev) => [song, ...prev]); // Thêm bài hát mới vào đầu danh sách
  };

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

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
