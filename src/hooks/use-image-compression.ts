import imageCompression from "browser-image-compression";
import { useState } from "react";

const useImageCompression = () => {
  const [error, setError] = useState<string | null>(null);
  const [compressionProgress, setCompressionProgress] = useState<number[]>([]);

  const isCompressing =
    compressionProgress.length > 0 && compressionProgress.some((x) => x < 100);

  const compressImages = async (acceptedFiles: File[]) => {
    setCompressionProgress(Array(acceptedFiles.length).fill(0));
    setError(null);

    try {
      const compressedFilePromises = acceptedFiles.map(
        async (file, i) => await handleImageCompression(file, i),
      );
      const compressedFiles = await Promise.all(compressedFilePromises);
      return compressedFiles;
    } catch (error) {
      //   showBoundary(error);

      if (error instanceof Error) {
        setError(error.message);
      }
    }

    setCompressionProgress([]);
  };

  const handleImageCompression = async (image: File, index: number) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      onProgress: (p: number) => {
        setCompressionProgress((progressArr) => {
          const newArr = [...progressArr];
          newArr[index] = p;
          return newArr;
        });
      },
    };

    return await imageCompression(image, options);
  };

  return {
    compressImages,
    error,
    compressionProgress,
    isCompressing,
  };
};

export default useImageCompression;
