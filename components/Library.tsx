"use client";

import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";
import useUploadModal from "@/hooks/useUploadModal";
import { useUser } from "@/providers/UserProvider";
import MediaItem from "@/components/MediaItem";
import { Button } from "react-bootstrap";
import { usePlayer } from "@/providers/PlayerContext";
import { Song } from "@/types/index";

const Library = () => {
  const uploadModal = useUploadModal();
  const { user } = useUser();
  const { songs, setCurrentSong } = usePlayer();

  const onClick = () => {
    if (!user) {
      // Handle auth modal
      return alert("Please login to upload a song");
    }

    // Handle upload modal
    uploadModal.onOpen();
  };

  return (
    <div className="d-flex flex-column">
      <div className="d-flex align-items-center justify-content-between px-3 pt-4">
        <div className="d-flex align-items-center gap-2">
          <TbPlaylist className="text-muted" size={26} />
          <p className="text-muted fw-medium mb-0">Your Library</p>
        </div>
        <Button variant="link" className="p-0 text-muted hover-white" onClick={onClick}>
          <AiOutlinePlus size={20} />
        </Button>
      </div>
      <div className="d-flex flex-column gap-2 mt-4 px-3">
        {songs.map((song:Song) => (
          <MediaItem key={song.id} data={song} onClick={() => setCurrentSong(song)} />
        ))}
      </div>
    </div>
  );
};

export default Library;
