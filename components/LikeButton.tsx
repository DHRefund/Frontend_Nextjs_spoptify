"use client";

import { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useUser } from "@/providers/UserProvider";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

interface LikeButtonProps {
  songId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ songId }) => {
  const router = useRouter();
  const { user } = useUser();
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/liked?songId=${songId}`);
        setIsLiked(response.data.isLiked);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [songId, user?.id]);

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  const handleLike = async () => {
    if (!user) {
      return router.push("/login");
    }

    try {
      if (isLiked) {
        await axios.delete(`/api/liked?songId=${songId}`);
      } else {
        await axios.post("/api/liked", { songId });
      }
      setIsLiked(!isLiked);
      toast.success("Success");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <button onClick={handleLike} className="hover:opacity-75 transition">
      <Icon color={isLiked ? "#22c55e" : "white"} size={25} />
    </button>
  );
};

export default LikeButton;
