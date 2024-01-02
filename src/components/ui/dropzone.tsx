"use client";

import React, { type ReactNode, useEffect, useMemo } from "react";
import Image from "next/image";
import { useDropzone, type FileRejection } from "react-dropzone";
import { withErrorBoundary } from "react-error-boundary";
import { UploadIcon } from "@radix-ui/react-icons";

import useImageCompression from "@/hooks/use-image-compression";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface DropzoneProps {
  onChange: (files: File[]) => void;
  /** Aria label for accessibility and tests */
  name: string;
  /** Style the dropzone root container */
  className?: string;
  /** Defaults to 1 file */
  maxFiles?: number;
  children?: React.ReactNode;
}

const DropzoneComponent = React.forwardRef<HTMLDivElement, DropzoneProps>(
  ({ onChange, name, className, maxFiles = 1, children }, ref) => {
    const { compressImages, isCompressing } = useImageCompression();

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
          onChange(acceptedFiles); // need to do this twice so integration tests work.  Compression doesn't seem to work for image upload mocks.

          const compressedImages = await compressImages(acceptedFiles);
          if (!compressedImages) return;

          onChange(compressedImages);
        })();
      },
      onDropRejected() {
        onChange([]);
      },
    });

    return (
      <>
        <div
          data-testid="dropzone"
          {...getRootProps({ "aria-label": name })}
          className={cn(
            "relative flex h-9 w-full items-center overflow-hidden rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
            "ring-orange-400 ring-offset-4 transition-shadow duration-75 focus-visible:outline-none focus-visible:ring-2 active:ring-2 active:ring-orange-500",
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

          {children}
        </div>

        {fileRejections.length ? (
          <FileRejectionError fileRejections={fileRejections} />
        ) : null}
      </>
    );
  },
);

DropzoneComponent.displayName = "DropzoneComponent";

const Dropzone = withErrorBoundary(DropzoneComponent, {
  fallbackRender: ({ resetErrorBoundary }) => (
    <div
      className="flex flex-col gap-4 rounded border border-red-500 bg-red-100 p-4 text-sm text-red-500"
      role="alert"
    >
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

/** Use getDragText from dropzoneContext later */
function DropzoneLabel({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute left-0 flex w-full shrink-0 items-center gap-2 p-3",
        className,
      )}
    >
      {children ? (
        children
      ) : (
        <>
          <UploadIcon className="shrink-0" />{" "}
          <div>Drag or click to select some images.</div>
        </>
      )}
    </div>
  );
}

function useImagePreviews(files: File[]) {
  const images = useMemo(
    () =>
      files.map((file) => ({
        ...file,
        preview: URL.createObjectURL(file),
      })),
    [files],
  );

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => images.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [images]);

  return images;
}

/** Return dropzone files, else fallback, else null. */
const DropzoneOverlayPreview = ({
  files,
  defaultImage,
}: {
  files: File[];
  defaultImage?: string;
}) => {
  const images = useImagePreviews(files);

  if (defaultImage)
    return (
      <Image
        src={defaultImage}
        alt="Preview of image you want to upload"
        width={300}
        height={300}
        key={defaultImage}
        className="pointer-events-none relative left-0 top-0 z-10 h-full w-full object-cover"
      />
    );

  return (
    <div className="pointer-events-none relative left-0 top-0 z-10 h-full w-full">
      {images.map((image) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={image.preview}
          src={image.preview}
          alt="Image preview"
          // Prevent memory leaks by revoking data uri after loaded
          onLoad={() => {
            URL.revokeObjectURL(image.preview);
          }}
          width={300}
          height={300}
          className="h-full w-full object-cover"
        />
      ))}
    </div>
  );
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

export { Dropzone, DropzoneOverlayPreview, DropzoneLabel, useImagePreviews };
