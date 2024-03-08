import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

import {
  DeleteObjectsCommand,
  PutObjectCommand,
  type S3,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { TRPCError } from "@trpc/server";
import { env } from "@/env";
import axios, { AxiosError } from "axios";

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

export const getBucketObjectNameFromCloudfrontUrl = (url: string) => {
  const bucketPath = `${env.CLOUDFRONT_URL}/`;

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

/**
 * @description uses sharp to get image metadata.  Also serves to validate that the images are from the bucket and not some other dog
 * @param imageUrls array of image urls
 */
export const getImagesMeta = async (imageUrls: string[]) => {
  interface Response {
    request: {
      host: string;
    };
    data: Buffer;
  }

  const componentToHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  };

  try {
    if (imageUrls.length === 0)
      throw new TRPCError({
        code: "UNPROCESSABLE_CONTENT",
        message: "No images provided",
      });

    const allImagesWithMeta = await Promise.all(
      imageUrls.map(async (url) => {
        const imageName = getBucketObjectNameFromUrl(url);
        const imageUrl = `${env.CLOUDFRONT_URL}/${imageName}`;

        // Download Image & use Buffer as Input
        const response = await axios<Record<string, never>, Response>({
          url: imageUrl,
          responseType: "arraybuffer",
        });

        const input = response.data;

        // Extract relevant metadata using sharp library
        const sharpInput = sharp(input);
        const { width, height } = await sharpInput.metadata();
        const { dominant } = await sharpInput.stats();
        const { r, g, b } = dominant;
        const aspectRatio =
          width && height && parseFloat((width / height).toFixed(8));

        if (!width || !height || !aspectRatio)
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong getting image metadata",
          });

        return {
          name: imageName,
          url: `${env.CLOUDFRONT_URL}/${imageName}`,
          width: width,
          height: height,
          aspectRatio: aspectRatio,
          dominantColour: rgbToHex(r, g, b),
        };
      }),
    );

    return allImagesWithMeta;
  } catch (error) {
    if (error instanceof TRPCError) throw error;

    const errorString = "Something went wrong getting image metadata";

    if (error instanceof AxiosError) {
      if (error.code === "ECONNREFUSED")
        throw new TRPCError({
          code: "UNPROCESSABLE_CONTENT",
          message: `${errorString}: Could not connect to provided image url`,
        });
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: errorString,
    });
  }
};

/**
 * https://docs.aws.amazon.com/AmazonS3/latest/userguide/example_s3_DeleteObjects_section.html
 * @description deletes images from bucket
 */
export const deleteImagesFromBucket = async (imageNames: string[], s3: S3) => {
  const command = new DeleteObjectsCommand({
    Bucket: env.BUCKET_NAME,
    Delete: {
      Objects: imageNames.map((name) => ({ Key: name })),
    },
  });

  try {
    const res = await s3.send(command);
    console.log(res);
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error deleting image from bucket",
    });
  }
};

/** https://gist.github.com/mathewbyrne/1280286?permalink_comment_id=2674194#gistcomment-2674194 */
export function slugify(text: string, separator?: string) {
  text = text.toString().toLowerCase().trim();

  const sets = [
    { to: "a", from: "[ÀÁÂÃÄÅÆĀĂĄẠẢẤẦẨẪẬẮẰẲẴẶ]" },
    { to: "c", from: "[ÇĆĈČ]" },
    { to: "d", from: "[ÐĎĐÞ]" },
    { to: "e", from: "[ÈÉÊËĒĔĖĘĚẸẺẼẾỀỂỄỆ]" },
    { to: "g", from: "[ĜĞĢǴ]" },
    { to: "h", from: "[ĤḦ]" },
    { to: "i", from: "[ÌÍÎÏĨĪĮİỈỊ]" },
    { to: "j", from: "[Ĵ]" },
    { to: "ij", from: "[Ĳ]" },
    { to: "k", from: "[Ķ]" },
    { to: "l", from: "[ĹĻĽŁ]" },
    { to: "m", from: "[Ḿ]" },
    { to: "n", from: "[ÑŃŅŇ]" },
    { to: "o", from: "[ÒÓÔÕÖØŌŎŐỌỎỐỒỔỖỘỚỜỞỠỢǪǬƠ]" },
    { to: "oe", from: "[Œ]" },
    { to: "p", from: "[ṕ]" },
    { to: "r", from: "[ŔŖŘ]" },
    { to: "s", from: "[ßŚŜŞŠ]" },
    { to: "t", from: "[ŢŤ]" },
    { to: "u", from: "[ÙÚÛÜŨŪŬŮŰŲỤỦỨỪỬỮỰƯ]" },
    { to: "w", from: "[ẂŴẀẄ]" },
    { to: "x", from: "[ẍ]" },
    { to: "y", from: "[ÝŶŸỲỴỶỸ]" },
    { to: "z", from: "[ŹŻŽ]" },
    { to: "-", from: "[·/_,:;']" },
  ];

  sets.forEach((set) => {
    text = text.replace(new RegExp(set.from, "gi"), set.to);
  });

  text = text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text

  if (typeof separator !== "undefined" && separator !== "-") {
    text = text.replace(/-/g, separator);
  }

  return text;
}

export function getChangedFields<T>(
  oldObj: Partial<T>,
  newObj: T,
  ignoredKeys?: (keyof T)[],
) {
  const changedFields: Partial<T> = {};

  for (const key in newObj) {
    if (newObj[key] !== oldObj[key] && !ignoredKeys?.includes(key)) {
      changedFields[key] = newObj[key];
    }
  }

  return changedFields;
}
