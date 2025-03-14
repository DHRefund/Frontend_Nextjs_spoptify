export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  songUrl: string;
  imageUrl?: string;
  userId: string;
}

export interface Playlist {
  id: string;
  name: string;
  userId: string;
  songs: Song[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}
