"use client";

import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { usePlayer } from "@/providers/PlayerContext";
import axiosInstance from "@/lib/axios";
import Image from "next/image";
import LikeButton from "@/components/LikeButton";
import { Song } from "@/types/index";

export default function LikedSongs() {
  const { likedSongs, setCurrentSong } = usePlayer();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Just handle loading state since songs are fetched in context
    setIsLoading(false);
  }, []);

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
    <Container fluid className="bg-dark min-vh-100">
      <Row className="mb-4">
        <Col>
          <h1 className="text-white display-4">Liked Songs</h1>
          <p className="text-light-gray">{likedSongs.length} liked songs</p>
        </Col>
      </Row>

      <Row>
        <Col>
          {likedSongs.map((song) => (
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
                  <LikeButton songId={song.id} />
                  <span className="text-light-gray me-3">{formatDuration(song.duration)}</span>
                </div>
              </Card.Body>
            </Card>
          ))}

          {likedSongs.length === 0 && (
            <div className="text-center text-light-gray mt-5">
              <p>No liked songs yet.</p>
              <p>Start liking songs to see them here!</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}
