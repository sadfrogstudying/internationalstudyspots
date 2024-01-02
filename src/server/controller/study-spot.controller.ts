import type { Context, ContextProtected } from "@/server/api/trpc";
import type {
  BySlugInput,
  CreateInput,
  DeleteInput,
  GetAllInput,
  GetPresignedUrlsInput,
  UpdateInput,
} from "@/schemas";
import { TRPCError } from "@trpc/server";
import {
  deleteImagesFromBucket,
  getBucketObjectNameFromUrl,
  getImagesMeta,
  getPresignedUrls,
  slugify,
} from "@/lib/server-helpers";
import { env } from "@/env";

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
    where: {
      country: {
        not: "",
      },
    },
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
    const images = await getImagesMeta(input.images.map((x) => x.url));
    const imagePayload = images.map((image, i) => ({
      ...image,
      featured: input.images[i]?.featured,
      authorId: ctx.session.user.id,
    }));

    await ctx.db.studySpot.create({
      data: {
        ...input,
        slug,
        images: {
          createMany: {
            data: imagePayload,
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
      input.images.map(({ url }) => getBucketObjectNameFromUrl(url)),
      ctx.s3,
    );

    if (error instanceof TRPCError) throw error;

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong creating a study spot",
    });
  }
}

export async function deleteHandler({
  ctx,
  input,
}: {
  ctx: ContextProtected;
  input: DeleteInput;
}) {
  if (input.token !== env.ADMIN_TOKEN)
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });

  const spot = await ctx.db.studySpot.findUnique({
    where: {
      id: input.id,
    },
    include: {
      images: true,
    },
  });

  if (!spot)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Study spot does not exist",
    });

  await ctx.db.studySpot.delete({
    where: {
      id: input.id,
    },
  });

  await deleteImagesFromBucket(
    spot.images.map((image) => image.name),
    ctx.s3,
  );

  return true;
}

export async function updateHandler({
  ctx,
  input,
}: {
  ctx: ContextProtected;
  input: UpdateInput;
}) {
  // TODO: Implement for images
  const spot = await ctx.db.studySpot.findUnique({
    where: {
      id: input.spotId,
    },
  });

  if (!spot) throw new TRPCError({ code: "NOT_FOUND" });

  const spotKeys = Object.keys(spot);

  // Loop through, and filter out the fields that are the same as existing
  const changes = Object.entries(input).filter(([key, value]) => {
    function isKeyOfSpot(key: string): key is keyof typeof spot {
      return spotKeys.includes(key);
    }

    if (!isKeyOfSpot(key)) return false;

    if (key === "images") {
      // Not implemented
      return;
    }
    if (key === "imagesToDelete") {
      // Not implemented
      return;
    }

    return value !== spot[key];
  });

  const fieldsToUpdate = Object.fromEntries(changes);

  return await ctx.db.studySpot.update({
    where: { id: input.spotId },
    data: fieldsToUpdate,
  });
}
