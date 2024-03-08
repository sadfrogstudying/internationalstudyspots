import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isEmptyString(str: string) {
  return str === "";
}

/** Returns the s3 urls of the uploaded files so I can validate it server side in user.update (getImagesMeta). */
export const uploadFilesToS3UsingPresignedUrls = async (
  presignedUrls: string[],
  acceptedFiles: (File | Blob)[],
) => {
  if (presignedUrls.length === 0) throw new Error("No urls provided");

  try {
    const promises = presignedUrls.map(async (url, i) => {
      const res = await axios.put(url, acceptedFiles[i], {
        headers: {
          "Content-Type": acceptedFiles[i]?.type,
        },
      });

      console.log(res);
      console.log("Successfully uploaded ", i);
    });

    await Promise.all(promises);
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    throw new Error("Something went wrong uploading image to storage");
  }

  const imageUrls = presignedUrls.map((url) => {
    const imageUrl = url.split("?")[0];

    if (typeof imageUrl !== "string")
      throw new Error("Something went wrong getting image url");

    return imageUrl;
  });

  return imageUrls;
};

export const createUrl = (pathname: string, params: URLSearchParams) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

  return `${pathname}${queryString}`;
};
