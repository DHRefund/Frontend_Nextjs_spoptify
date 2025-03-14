// File: components/UploadImage.tsx
import { CldUploadWidget } from "next-cloudinary";

export default function UploadImage() {
  return (
    <CldUploadWidget
      uploadPreset="your_upload_preset" // Upload preset từ Cloudinary Dashboard
      onUpload={(result) => {
        console.log("Uploaded file:", result);
      }}
    >
      {({ open }) => {
        return <button onClick={() => open()}>Upload Image</button>;
      }}
    </CldUploadWidget>
  );
}
