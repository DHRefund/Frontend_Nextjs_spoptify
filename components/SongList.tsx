"use client";

import { Container, Card, Spinner } from "react-bootstrap";
import Image from "next/image";
import Player from "./Player";
import { usePlayer } from "@/providers/PlayerContext";

const SongList = () => {
  const { songs, currentSong, isLoading, setCurrentSong } = usePlayer();

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="text-center p-3">
        <Spinner animation="border" variant="light" />
      </div>
    );
  }

  return (
    <>
      <Container fluid className="p-0">
        {songs.map((song) => (
          <Card
            key={song.id}
            className="mb-2 bg-dark text-white"
            style={{ cursor: "pointer" }}
            onClick={() => setCurrentSong(song)}
          >
            <Card.Body className="d-flex align-items-center">
              <div style={{ position: "relative", width: "48px", height: "48px", minWidth: "48px" }}>
                <Image
                  fill
                  src={song.imageUrl || "/images/music-placeholder.png"}
                  alt={song.title}
                  style={{ objectFit: "cover", borderRadius: "4px" }}
                />
              </div>

              <div className="ms-3 overflow-hidden">
                <Card.Title className="mb-0 text-truncate">{song.title}</Card.Title>
                <Card.Text className="text-light-gray mb-0 text-truncate">{song.artist}</Card.Text>
              </div>

              <div className="ms-auto d-flex align-items-center">
                <span className="text-light-gray me-3">{formatDuration(song.duration)}</span>
              </div>
            </Card.Body>
          </Card>
        ))}
      </Container>
      <Player />
    </>
  );
};

export default SongList;
