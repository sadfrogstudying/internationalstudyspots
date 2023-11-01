import React, { useEffect, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { UploadIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

type FileWithPreview = File & { preview: string };

interface DivProps {
  onChange: (files: File[]) => void;
  /** Aria label for accessibility and tests */
  name: string;
}

const Dropzone = React.forwardRef<HTMLDivElement, DivProps>(
  ({ onChange, name }, ref) => {
    const [files, setFiles] = useState<FileWithPreview[]>([]);

    const {
      getRootProps,
      getInputProps,
      fileRejections,
      isDragAccept,
      isDragReject,
      open,
    } = useDropzone({
      accept: {
        "image/*": [],
      },
      onDropAccepted(files) {
        onChange(files);
      },
      onDropRejected() {
        onChange([]);
      },
      onDrop: (acceptedFiles) => {
        setFiles(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            }),
          ),
        );
      },
    });

    useEffect(() => {
      // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
      return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
    }, []);

    const thumbs = files.map((file) => (
      <div key={file.name}>
        <img
          src={file.preview}
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
        <div className="hidden">{file.name}</div>
      </div>
    ));

    const rejectStyle = isDragReject ? "bg-red-300" : "";
    const acceptStyle = isDragAccept ? "bg-green-300" : "";

    function getDragText() {
      if (isDragAccept) {
        return "All files will be accepted.";
      } else if (isDragReject) {
        return "Some files will be rejected.";
      } else {
        return "Drag or click to select files.";
      }
    }

    return (
      <>
        <div
          data-testid="dropzone"
          {...getRootProps({ "aria-label": name })}
          className={cn(
            "flex h-9 w-full items-center rounded-md border border-input bg-transparent px-3 py-1 text-sm text-foreground shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            acceptStyle,
            rejectStyle,
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
          <div className="flex select-none items-center gap-2">
            <UploadIcon /> {getDragText()}
          </div>
        </div>

        <FileRejectionError fileRejections={fileRejections} />
        <div className="grid grid-cols-4 gap-2">{thumbs}</div>
      </>
    );
  },
);

Dropzone.displayName = "Dropzone";
export default Dropzone;

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
