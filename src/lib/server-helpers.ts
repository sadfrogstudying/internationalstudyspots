import { v4 as uuidv4 } from "uuid";

import { PutObjectCommand, type S3 } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { TRPCError } from "@trpc/server";
import { env } from "@/env";

export const getBucketObjectNameFromUrl = (url: string) => {
  const bucketPath = `https://${env.BUCKET_NAME}.s3.${env.REGION}.amazonaws.com/`;

  // Prevent malicious uploads
  if (!url.startsWith(bucketPath))
    throw new TRPCError({
      code: "UNPROCESSABLE_CONTENT",
      message: "URL is not from the bucket",
    });

  const splitUrl = url.split("?")[0] ?? "";
  const imageName = splitUrl.substring(bucketPath.length);

  return imageName;
};

/**
 * create a presigned URL that can be used to upload a file with a specific
 * key to our S3 bucket. This will be used for regular uploads, where the
 * entire file is uploaded in a single request.
 *
 * @params an array of all the contentTypes of the files we want to upload
 */
export async function getPresignedUrls(
  files: {
    contentLength: number;
    contentType: string;
  }[],
  s3: S3,
) {
  if (files.length === 0)
    throw new TRPCError({
      code: "UNPROCESSABLE_CONTENT",
      message: "No files provided",
    });

  // Limit to 8 files
  if (files.length > 8)
    throw new TRPCError({
      code: "PAYLOAD_TOO_LARGE",
      message: "Too many files, limit to 8",
    });

  // Check file sizes
  const fileTooLarge = files.some(
    (file) => file.contentLength > 1024 * 1024 * 2,
  );

  if (fileTooLarge)
    throw new TRPCError({
      code: "PAYLOAD_TOO_LARGE",
      message: "File size too large",
    });

  const signedUrlPromises = files.map(async (file) => {
    const putObjectCommand = new PutObjectCommand({
      Bucket: env.BUCKET_NAME,
      Key: uuidv4(),
      ContentType: file.contentType,
      ContentLength: file.contentLength,
    });

    return await getSignedUrl(s3, putObjectCommand);
  });

  return await Promise.all(signedUrlPromises);
}
