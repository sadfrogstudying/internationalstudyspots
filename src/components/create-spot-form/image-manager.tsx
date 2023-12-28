"use client";

import { useImagePreviews } from "@/components/ui/dropzone";

/** Return dropzone files, else fallback, else null. */
export default function ImageManager({ files }: { files: File[] }) {
  const images = useImagePreviews(files);

  return images.map((file) => (
    <div className="relative" key={file.preview}>
      <img
        src={file.preview}
        alt="Image preview"
        onLoad={() => {
          URL.revokeObjectURL(file.preview); // Prevent memory leaks by revoking data uri after loaded
        }}
        width={300}
        height={300}
        className="rounded-md"
      />
    </div>
  ));
}
