import type { Context, ContextProtected } from "@/server/api/trpc";
import type {
  BySlugInput,
  CreateInput,
  GetAllInput,
  GetPresignedUrlsInput,
} from "@/schemas";
import { TRPCError } from "@trpc/server";
import {
  deleteImagesFromBucket,
  getBucketObjectNameFromUrl,
  getImagesMeta,
  getPresignedUrls,
  slugify,
} from "@/lib/server-helpers";

export async function getAllHandler({
  ctx,
  input,
}: {
  ctx: Context;
  input: GetAllInput;
}) {
  const { cursor, ...rest } = input ?? {};

  const spots = await ctx.db.studySpot.findMany({
    ...rest,
    skip: cursor ? 1 : undefined,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      images: true,
    },
  });

  return spots;
}

export async function bySlugHandler({
  ctx,
  input,
}: {
  ctx: Context;
  input: BySlugInput;
}) {
  const spot = await ctx.db.studySpot.findUnique({
    where: {
      slug: input,
    },
    include: {
      images: true,
    },
  });

  return spot;
}

export async function getCountriesHandler({ ctx }: { ctx: Context }) {
  const countries = await ctx.db.studySpot.findMany({
    select: {
      country: true,
    },
    distinct: ["country"],
  });

  return countries.map((x) => x.country);
}

/**
 * Also acts as a input validator.
 * I may have to make a new one for spot update.
 */
export async function getPresignedUrlHandler({
  ctx,
  input,
}: {
  ctx: ContextProtected;
  input: GetPresignedUrlsInput;
}) {
  const spot = await ctx.db.studySpot.findUnique({
    where: {
      name: input.name,
    },
  });

  if (spot)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Study spot name already exists",
    });

  return await getPresignedUrls(input.images, ctx.s3);
}

export async function createHandler({
  ctx,
  input,
}: {
  ctx: ContextProtected;
  input: CreateInput;
}) {
  try {
    const slug = slugify(input.name);
    const images = await getImagesMeta(input.images);

    await ctx.db.studySpot.create({
      data: {
        ...input,
        slug,
        images: {
          createMany: {
            data: images.map((image) => ({
              ...image,
              authorId: ctx.session.user.id,
            })),
          },
        },
        author: {
          connect: {
            id: ctx.session.user.id,
          },
        },
      },
    });
  } catch (error: unknown) {
    await deleteImagesFromBucket(
      input.images.map((url) => getBucketObjectNameFromUrl(url)),
      ctx.s3,
    );

    if (error instanceof TRPCError) throw error;

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong creating a study spot",
    });
  }
}
