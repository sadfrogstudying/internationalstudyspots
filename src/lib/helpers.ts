import axios from "axios";

/** Returns the s3 urls of the uploaded files so I can validate it server side in user.update (getImagesMeta). */
export const uploadFilesToS3UsingPresignedUrls = async (
  presignedUrls: string[],
  acceptedFiles: File[],
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
      console.log("Successfully uploaded ", acceptedFiles[i]?.name);
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
