"use client";

import Image from "next/image";
import { Song } from "@/types/index";

interface MediaItemProps {
  data: Song;
  onClick: () => void;
}

const MediaItem: React.FC<MediaItemProps> = ({ data, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div onClick={handleClick} className="d-flex align-items-center gap-3 cursor-pointer hover-bg-dark rounded p-2">
      <div className="position-relative rounded overflow-hidden" style={{ width: 48, height: 48 }}>
        <Image
          fill
          src={data.imageUrl || "/images/music-placeholder.png"}
          alt="Media Item"
          className="object-fit-cover"
        />
      </div>
      <div className="d-flex flex-column overflow-hidden">
        <p className="text-white text-truncate mb-1">{data.title}</p>
        <p className="text-white small text-truncate mb-0">{data.artist}</p>
      </div>
    </div>
  );
};

export default MediaItem;
