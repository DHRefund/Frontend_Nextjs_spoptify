"use client";

import { FaHeart, FaRegHeart } from "react-icons/fa";
import { usePlayer } from "@/providers/PlayerContext";

interface LikeButtonProps {
  songId: string;
}

const LikeButton = ({ songId }: LikeButtonProps) => {
  const { isLiked, toggleLike, isLoading } = usePlayer();

  if (isLoading) {
    return (
      <button className="btn btn-link p-0 me-3" disabled>
        <FaRegHeart className="text-light-gray" />
      </button>
    );
  }

  return (
    <button
      className="btn btn-link p-0 me-3"
      onClick={(e) => {
        e.stopPropagation();
        toggleLike(songId);
      }}
    >
      {isLiked(songId) ? <FaHeart className="text-success" /> : <FaRegHeart className="text-light-gray" />}
    </button>
  );
};

export default LikeButton;
