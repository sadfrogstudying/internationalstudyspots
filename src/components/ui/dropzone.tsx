"use client";

/**
 * Allows flexible styling of dropzone, the overlayPreview and defaultImage props
 * are used for typical "profile image" uploaders.
 */

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDropzone, type FileRejection } from "react-dropzone";
import { withErrorBoundary } from "react-error-boundary";
import { UploadIcon } from "@radix-ui/react-icons";

import useImageCompression from "@/hooks/use-image-compression";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/** Preview set in callback of Dropzone's onDrop */
export type FileWithPreview = File & { preview: string };

export interface DropzoneProps {
  onChange: (files: File[]) => void;
  /** Aria label for accessibility and tests */
  name: string;
  /** The text inside the dropzone, defaults to "Drag or click to select image." */
  dragLabel?: string;
  /** Style the dropzone root container */
  className?: string;
  /** Style the dropzone label */
  labelClassName?: string;
  /** Defaults to 1 file */
  maxFiles?: number;
  /** Overlay the preview image inside the input. Only works with 1 file, defaults to false */
  overlayPreview?: boolean;
  /** Set a default image with URL. Only works with 1 file */
  defaultImage?: string;
}

const DropzoneComponent = React.forwardRef<HTMLDivElement, DropzoneProps>(
  (
    {
      onChange,
      name,
      dragLabel = "Drag or click to select image.",
      className,
      labelClassName,
      maxFiles = 1,
      overlayPreview = false,
      defaultImage,
    },
    ref,
  ) => {
    const [files, setFiles] = useState<FileWithPreview[]>([]);

    const { compressImages, compressionProgress, error, isCompressing } =
      useImageCompression();

    const {
      getRootProps,
      getInputProps,
      fileRejections,
      isDragAccept,
      isDragReject,
      open,
    } = useDropzone({
      maxFiles,
      maxSize: 30000000, // 10mb
      accept: {
        "image/png": [".png"],
        "image/jpeg": [".jpeg", ".jpg"],
        "image/webp": [".webp"],
      },
      onDropAccepted: (acceptedFiles) => {
        // To silence Error: Promise-returning function provided to property where a void return was expected.  @typescript-eslint/no-misused-promises
        void (async () => {
          // Set initial preview images for instant UI feedback
          const initialImagesWithPreview = acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            }),
          );

          setFiles(initialImagesWithPreview);

          const compressedImages = await compressImages(acceptedFiles);

          if (!compressedImages) return;

          const imagesWithPreview = compressedImages.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            }),
          );

          setFiles(imagesWithPreview);
          onChange(compressedImages);
        })();
      },
      onDropRejected() {
        onChange([]);
      },
    });

    useEffect(() => {
      // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
      return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
    }, [files]);

    function getDragText() {
      if (isDragAccept) {
        return "All files will be accepted.";
      } else if (isDragReject) {
        return "Some files will be rejected.";
      } else {
        return dragLabel;
      }
    }

    if ((overlayPreview && maxFiles > 1) || (defaultImage && maxFiles > 1)) {
      throw new Error(
        "Please set maxFiles to 1 to use overlayPreview and defaultImage props.",
      );
    }

    return (
      <>
        <div
          data-testid="dropzone"
          {...getRootProps({ "aria-label": name })}
          className={cn(
            "relative flex h-9 w-full items-center overflow-hidden rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
            "ring ring-transparent transition-shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            className,
            isDragAccept && "ring-green-500",
            isDragReject && "ring-red-500",
            isCompressing && "ring-yellow-400",
          )}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              open();
            }
          }}
          ref={ref}
          role="button"
        >
          <input {...getInputProps()} />
          <div
            className={cn(
              "pointer-events-none flex shrink-0 items-center gap-2",
              labelClassName,
            )}
          >
            <UploadIcon /> <div>{getDragText()}</div>
          </div>

          {overlayPreview && (
            <Preview
              files={files}
              overlayPreview={overlayPreview}
              defaultImage={defaultImage}
              compressionProgress={compressionProgress}
            />
          )}
        </div>

        {!overlayPreview && (
          <div className="grid grid-cols-4 gap-2">
            {
              <Preview
                files={files}
                overlayPreview={overlayPreview}
                defaultImage={defaultImage}
                compressionProgress={compressionProgress}
              />
            }
          </div>
        )}

        <FileRejectionError fileRejections={fileRejections} />
      </>
    );
  },
);

DropzoneComponent.displayName = "DropzoneComponent";

const Dropzone = withErrorBoundary(DropzoneComponent, {
  fallbackRender: ({ resetErrorBoundary }) => (
    <div className="flex flex-col gap-4 rounded border border-red-500 bg-red-100 p-4 text-sm text-red-500">
      <h3 className="text-lg font-semibold">Error</h3>
      Something unexpected went wrong with the image uploader.
      <Button
        variant="destructive"
        onClick={(e) => {
          e.preventDefault();
          resetErrorBoundary();
        }}
      >
        Try again
      </Button>
    </div>
  ),
});

export default Dropzone;

/** Return dropzone files, else fallback, else null. */
const Preview = ({
  files,
  overlayPreview,
  defaultImage,
  compressionProgress,
}: {
  files: FileWithPreview[];
  overlayPreview: boolean;
  defaultImage?: string;
  compressionProgress?: number[];
}) => {
  if (files.length)
    return files.map((file, i) => (
      <div
        className={cn(
          overlayPreview
            ? "pointer-events-none absolute left-0 top-0 h-full w-full object-cover"
            : "relative",
        )}
        key={file.name}
      >
        {compressionProgress && (
          <div
            className={cn(
              "absolute left-1 top-1 z-20 rounded px-4 py-2 font-mono text-xs",
              compressionProgress[i] === 100 ? "bg-lime-400" : "bg-yellow-400",
            )}
          >
            {compressionProgress[i]}%
          </div>
        )}
        <Image
          src={file.preview}
          alt="Preview of image you want to upload"
          // Prevent memory leaks by revoking data uri after loaded
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
          width={300}
          height={300}
          className={cn(
            overlayPreview &&
              "absolute left-0 top-0 h-full w-full object-cover",
          )}
        />
      </div>
    ));

  if (defaultImage)
    return (
      <Image
        src={defaultImage}
        alt="Preview of image you want to upload"
        width={300}
        height={300}
        key={defaultImage}
        className={cn(
          overlayPreview &&
            "pointer-events-none absolute left-0 top-0 h-full w-full object-cover",
        )}
      />
    );

  return null;
};

const FileRejectionError = ({
  fileRejections,
}: {
  fileRejections: FileRejection[];
}) => {
  const fileRejectionErrors = fileRejections.flatMap(({ errors }) => {
    return errors.flatMap(({ message }) => message);
  });
  const fileRejectionUniqueErrors = Array.from(new Set(fileRejectionErrors));

  return (
    <p className="text-[0.8rem] font-medium text-destructive">
      {fileRejectionUniqueErrors.join(", ")}
    </p>
  );
};
