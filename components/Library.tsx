"use client";

import { Button } from "react-bootstrap";
import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";

const Library = () => {
  const onClick = () => {
    // Handle upload later
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <TbPlaylist size={26} className="text-muted me-2" />
          <span className="library-header">Your Library</span>
        </div>
        <Button variant="link" onClick={onClick} className="p-2">
          <AiOutlinePlus size={20} />
        </Button>
      </div>
      <div className="mt-4">{/* List of Songs */}</div>
    </div>
  );
};

export default Library;
