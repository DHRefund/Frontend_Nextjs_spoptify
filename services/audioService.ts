import { Song } from "@/types/index";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/axios";

export class AudioService {
  private audio: HTMLAudioElement;
  private currentSong: Song | null = null;
  private volume: number = 1;
  private isRepeat: boolean = false;
  private isShuffle: boolean = false;
  private shuffledSongs: Song[] = [];

  constructor() {
    this.audio = new Audio();
    this.setupAudioListeners();
  }

  private setupAudioListeners() {
    this.audio.addEventListener("ended", () => {
      if (this.isRepeat) {
        this.audio.currentTime = 0;
        this.audio.play();
      }
    });
  }

  // Phương thức điều khiển cơ bản
  async playSong(song: Song) {
    this.currentSong = song;
    this.audio.src = song.songUrl;
    await this.audio.load();
    return this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  play() {
    return this.audio.play();
  }

  // Điều khiển âm lượng
  setVolume(value: number) {
    this.volume = value;
    this.audio.volume = value;
  }

  toggleMute() {
    if (this.audio.volume === 0) {
      this.audio.volume = this.volume;
      return false;
    } else {
      this.audio.volume = 0;
      return true;
    }
  }

  // Điều khiển tiến độ
  seek(time: number) {
    this.audio.currentTime = time;
  }

  // Lấy thông tin hiện tại
  getCurrentTime() {
    return this.audio.currentTime;
  }

  getDuration() {
    return this.audio.duration;
  }

  // Xử lý danh sách phát
  shuffleArray(songs: Song[]) {
    const shuffled = [...songs];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // API calls
  async fetchSongs() {
    try {
      const [songsResponse, likedResponse] = await Promise.all([
        axiosInstance.get("/songs"),
        axiosInstance.get("/songs/liked"),
      ]);
      return {
        songs: songsResponse.data,
        likedSongs: Array.isArray(likedResponse.data) ? likedResponse.data : [],
      };
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load songs");
      return { songs: [], likedSongs: [] };
    }
  }

  async toggleLikeSong(songId: string) {
    try {
      const { data } = await axiosInstance.post(`/songs/${songId}/like`);
      return data;
    } catch (error) {
      console.error("Toggle like error:", error);
      throw error;
    }
  }

  // Utilities
  formatTime(time: number) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  // Cleanup
  destroy() {
    this.audio.pause();
    this.audio.src = "";
    this.audio.remove();
  }
}

// Singleton instance
export const audioService = new AudioService();
