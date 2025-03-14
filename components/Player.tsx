"use client";

import { Container, Row, Col, Button } from "react-bootstrap";
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaRandom,
  FaRedo,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";
import Image from "next/image";
import { usePlayer } from "@/providers/PlayerContext";

const Player = () => {
  const {
    currentSong,
    isPlaying,
    progress,
    volume,
    isMuted,
    isRepeat,
    isShuffle,
    currentTime,
    duration,
    handlePlayPause,
    handleNextSong,
    handlePrevSong,
    handleProgressChange,
    handleVolumeChange,
    toggleMute,
    toggleRepeat,
    toggleShuffle,
    formatTime,
  } = usePlayer();

  return (
    <Container fluid className="fixed-bottom bg-black py-3">
      <Row className="align-items-center">
        {/* Song Info */}
        <Col xs={3}>
          {currentSong && (
            <div className="d-flex align-items-center">
              <div style={{ position: "relative", width: "40px", height: "40px" }}>
                <Image
                  fill
                  src={currentSong.imageUrl || "/images/music-placeholder.png"}
                  alt={currentSong.title}
                  style={{ objectFit: "cover", borderRadius: "4px" }}
                />
              </div>
              <div className="ms-3">
                <div className="text-white">{currentSong.title}</div>
                <div className="text-light-gray small">{currentSong.artist}</div>
              </div>
            </div>
          )}
        </Col>

        {/* Controls */}
        <Col xs={6} className="text-center">
          <div className="d-flex justify-content-center align-items-center mb-2">
            <Button
              variant="link"
              className={`text-light-gray mx-2 ${isShuffle ? "text-success" : ""}`}
              onClick={toggleShuffle}
            >
              <FaRandom />
            </Button>
            <Button variant="link" className="text-light-gray mx-2" onClick={handlePrevSong}>
              <FaStepBackward />
            </Button>
            <Button
              variant="success"
              className="rounded-circle mx-2"
              style={{ width: "40px", height: "40px" }}
              onClick={handlePlayPause}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </Button>
            <Button variant="link" className="text-light-gray mx-2" onClick={handleNextSong}>
              <FaStepForward />
            </Button>
            <Button
              variant="link"
              className={`text-light-gray mx-2 ${isRepeat ? "text-success" : ""}`}
              onClick={toggleRepeat}
            >
              <FaRedo />
            </Button>
          </div>

          <div className="d-flex align-items-center px-2">
            <span className="text-light-gray small me-2">{formatTime(currentTime)}</span>
            <div className="w-100 mx-2">
              <input
                type="range"
                className="form-range progress-bar-custom"
                value={progress}
                onChange={(e) => handleProgressChange(parseFloat(e.target.value))}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            <span className="text-light-gray small ms-2">{formatTime(duration)}</span>
          </div>
        </Col>

        {/* Volume */}
        <Col xs={3} className="d-flex align-items-center justify-content-end">
          <Button variant="link" className="text-light-gray" onClick={toggleMute}>
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </Button>
          <input
            type="range"
            className="form-range ms-2"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            style={{ width: "100px" }}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Player;
