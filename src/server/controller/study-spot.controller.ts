import type { Context, ContextProtected } from "@/server/api/context";
import type {
  ByIdInput,
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
  getBucketObjectNameFromCloudfrontUrl,
  getBucketObjectNameFromUrl,
  getImagesMeta,
  getPresignedUrls,
  slugify,
} from "@/server/lib/utils";
import { revalidatePath } from "next/cache";

export async function getAllHandler({
  ctx,
  input,
}: {
  ctx: Context;
  input: GetAllInput;
}) {
  const { cursor, country, filters: filtersInput, ...rest } = input ?? {};

  // Prevent from querying "no plugs, no wifi, no nature, etc."
  const filters =
    filtersInput && Object.values(filtersInput).every((val) => !val)
      ? undefined
      : filtersInput;

  const spots = await ctx.db.studySpot.findMany({
    ...rest,
    skip: cursor ? 1 : undefined,
    cursor: cursor ? { id: cursor } : undefined,
    where: {
      ...filters,
      country,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      images: true,
    },
  });

  return spots;
}

export async function getAllSlugsHandler({ ctx }: { ctx: Context }) {
  const spots = await ctx.db.studySpot.findMany({
    select: {
      slug: true,
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

export async function byIdHandler({
  ctx,
  input,
}: {
  ctx: Context;
  input: ByIdInput;
}) {
  const spot = await ctx.db.studySpot.findUnique({
    where: {
      id: input,
    },
    include: {
      images: true,
    },
  });

  return spot;
}

export async function authorByIdHandler({
  ctx,
  input,
}: {
  ctx: Context;
  input: ByIdInput;
}) {
  const spot = await ctx.db.studySpot.findUnique({
    where: {
      id: input,
    },
    select: {
      author: {
        select: {
          username: true,
          name: true,
          profileImage: true,
        },
      },
    },
  });

  return spot?.author;
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
  const slug = slugify(input.name);

  const spot = await ctx.db.studySpot.findFirst({
    where: {
      OR: [{ name: input.name }, { slug: slug }],
    },
  });

  const user = await ctx.db.user.findUnique({
    where: {
      id: ctx.session.user.id,
    },
  });

  if (!user?.username)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message:
        "Please finish creating your account, you need a username to edit spots.",
    });

  if (spot && input.id !== spot.id) {
    const field = spot.name === input.name ? "name" : "slug";

    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Study spot ${field} already exists.  Please enter something unique.`,
    });
  }

  if (input.images.length === 0) return;

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
  const spot = await ctx.db.studySpot.findUnique({
    where: {
      id: input.id,
    },
    include: {
      images: true,
      author: true,
    },
  });

  if (!spot) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Study spot does not exist",
    });
  }

  if (spot?.author?.id !== ctx.session.user.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You are not the author of this study spot",
    });
  }

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
  const spot = await ctx.db.studySpot.findUnique({
    where: {
      id: input.id,
    },
  });

  if (!spot) throw new TRPCError({ code: "NOT_FOUND" });

  // Handle name change
  const nameChanged = Object.hasOwn(input, "name");
  let slug = undefined;
  if (nameChanged) slug = slugify(input.name);

  const newImages = input.images?.newImages;
  const existingImages = input.images?.existingImages;

  let newImagesPayload = undefined;
  let existingImagesPayload = undefined;

  // Handle new images
  if (newImages && newImages?.length > 0) {
    const images = await getImagesMeta(newImages.map((x) => x.url));
    newImagesPayload = images.map((image, i) => ({
      ...image,
      featured: newImages[i]?.featured,
      authorId: ctx.session.user.id,
    }));
  }

  if (existingImages && existingImages?.length > 0) {
    // Handle delete existing images
    const imagesToDelete = existingImages.filter((x) => x.delete);

    if (imagesToDelete.length > 0) {
      await deleteImagesFromBucket(
        // 🚨 Confirm that this works!
        imagesToDelete.map((x) => getBucketObjectNameFromCloudfrontUrl(x.url)),
        ctx.s3,
      );

      await ctx.db.image.deleteMany({
        where: {
          url: {
            in: imagesToDelete.map((x) => x.url),
          },
        },
      });
    }

    // Handle update existing images
    const imagesToUpdate = existingImages.filter((x) => !x.delete);

    existingImagesPayload = imagesToUpdate.map((image) => ({
      ...image,
    }));

    // Handle image changes
    // Group images by change type
    const imagesToFeature = existingImagesPayload?.filter((x) => x.featured);
    const imagesToUnfeature = existingImagesPayload?.filter((x) => !x.featured);

    // Update featured images
    if (imagesToFeature?.length > 0) {
      await ctx.db.image.updateMany({
        where: {
          url: {
            in: imagesToFeature.map((x) => x.url),
          },
        },
        data: {
          featured: true,
        },
      });
    }

    // Update unfeatured images
    if (imagesToUnfeature?.length > 0) {
      await ctx.db.image.updateMany({
        where: {
          url: {
            in: imagesToUnfeature.map((x) => x.url),
          },
        },
        data: {
          featured: false,
        },
      });
    }
  }

  const updatedSpot = await ctx.db.studySpot.update({
    where: { id: input.id },
    data: {
      ...input,
      slug,
      images: {
        ...(newImagesPayload && {
          createMany: {
            data: newImagesPayload,
          },
        }),
      },
    },
  });

  // TODO: If we're changing the name, we should ensure the previous page is gone
  // revalidatePath("/", "layout");
  console.log(updatedSpot.id);
  revalidatePath(`/study-spot/${updatedSpot.id}`);

  return updatedSpot;
}
