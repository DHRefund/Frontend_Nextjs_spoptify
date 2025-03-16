"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useUser } from "@/providers/UserProvider";
import useUploadModal from "@/hooks/useUploadModal";
import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";
import axiosInstance from "@/lib/axios";
import { usePlayer } from "@/providers/PlayerContext";

const UploadModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const uploadModal = useUploadModal();
  const { user } = useUser();
  const { addSong } = usePlayer();

  // Thêm state để lưu duration
  const [songDuration, setSongDuration] = useState(0);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      artist: "",
      song: null,
      image: null,
    },
  });

  // Hàm để lấy duration của file audio
  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);

      audio.addEventListener("loadedmetadata", () => {
        // Chuyển duration từ giây sang milliseconds và làm tròn
        const durationInSeconds = Math.round(audio.duration);
        URL.revokeObjectURL(audio.src);
        resolve(durationInSeconds);
      });

      audio.addEventListener("error", (error) => {
        URL.revokeObjectURL(audio.src);
        reject(error);
      });
    });
  };

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      uploadModal.onClose();
    }
  };

  const uploadToCloudinary = async (file: File, options: { folder: string; resource_type: string }) => {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset!);
      formData.append("timestamp", timestamp.toString());
      formData.append("api_key", apiKey!);
      formData.append("folder", options.folder);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${options.resource_type}/upload`, {
        method: "POST",
        body: formData,
      });

      console.log("response", response);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Upload failed");
      }

      const data = await response.json();
      console.log("data", data);
      console.log("data.secure_url", data.secure_url);
      return data.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const onSubmit = async (values: any) => {
    try {
      setIsLoading(true);

      const songFile = values.song?.[0];
      const imageFile = values.image?.[0];

      if (!songFile || !imageFile) {
        toast.error("Missing fields");
        return;
      }

      // Lấy duration của file audio
      const duration = await getAudioDuration(songFile);
      console.log("Song duration:", duration);

      // Upload song to Cloudinary
      const songUrl = await uploadToCloudinary(songFile, {
        folder: "songs",
        resource_type: "video",
      });

      // Upload image if exists
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile, {
          folder: "images",
          resource_type: "image",
        });
      }

      // Log cookies trước khi gửi request
      console.log("Cookies:", document.cookie);

      // Create song in backend với duration đã lấy được
      const { data } = await axiosInstance.post("/songs", {
        title: values.title,
        artist: values.artist,
        songUrl,
        imageUrl,
        duration: duration, // Sử dụng duration đã lấy được
      });

      // Add new song to context
      addSong(data);

      toast.success("Song created!");
      reset();
      uploadModal.onClose();
    } catch (error: any) {
      console.error("Error creating song:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal title="Add a song" description="Upload an mp3 file" isOpen={uploadModal.isOpen} onChange={onChange}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          label="Title"
          id="title"
          disabled={isLoading}
          {...register("title", { required: true })}
          placeholder="Song title"
        />
        <Input
          label="Artist"
          id="artist"
          disabled={isLoading}
          {...register("artist", { required: true })}
          placeholder="Song artist"
        />
        <div>
          <div className="pb-1">Select a song file</div>
          <Input
            label="Song"
            placeholder="test"
            disabled={isLoading}
            type="file"
            accept=".mp3"
            id="song"
            {...register("song", { required: true })}
          />
        </div>
        <div>
          <div className="pb-1">Select an image</div>
          <Input
            label="Image"
            placeholder="test"
            disabled={isLoading}
            type="file"
            accept="image/*"
            id="image"
            {...register("image", { required: true })}
          />
        </div>
        <Button disabled={isLoading} type="submit">
          Create
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;
