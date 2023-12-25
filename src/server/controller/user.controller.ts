import { TRPCError } from "@trpc/server";
import type { Context, ContextProtected } from "@/server/api/trpc";
import type {
  CreateInput,
  GetInput,
  GetPresignedUrlInput,
  UpdateUserServer,
} from "@/schemas/user";
import {
  deleteImagesFromBucket,
  getImagesMeta,
  getPresignedUrls,
} from "@/lib/server-helpers";

export async function currentBySessionHandler({
  ctx,
}: {
  ctx: ContextProtected;
}) {
  const user = await ctx.db.user.findUnique({
    include: { profileImage: true },
    where: { id: ctx.session.user.id },
  });

  return user;
}

export async function getHandler({
  input,
  ctx,
}: {
  input: GetInput;
  ctx: Context;
}) {
  const user = await ctx.db.user.findUnique({
    include: { profileImage: true },
    where: { username: input },
  });

  return user;
}

export async function deleteCurrentHandler({ ctx }: { ctx: ContextProtected }) {
  const user = await ctx.db.user.delete({
    where: { id: ctx.session.user.id },
  });

  return user;
}

/** Also acts as a input validator for the update procedure 😵‍💫. */
export async function getPresignedUrlHandler({
  ctx,
  input,
}: {
  input: GetPresignedUrlInput;
  ctx: ContextProtected;
}) {
  const id = ctx.session.user.id;
  const currentUser = await ctx.db.user.findUnique({
    where: { id },
  });

  if (!currentUser) throw new TRPCError({ code: "NOT_FOUND" });

  if (currentUser.username !== input.username) {
    const user = await ctx.db.user.findUnique({
      where: { username: input.username },
    });

    if (user)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Username already exists",
      });
  }

  if (!input.profileImage) return;

  const res = await getPresignedUrls([input.profileImage], ctx.s3);

  return res[0];
}

export async function updateHandler({
  input,
  ctx,
}: {
  /** profileImage is the presigned url or undefined (meaning no change) */
  input: UpdateUserServer;
  ctx: ContextProtected;
}) {
  const id = ctx.session.user.id;

  const user = await ctx.db.user.findUnique({
    where: { id },
    include: { profileImage: true },
  });

  if (!user) throw new TRPCError({ code: "NOT_FOUND" });

  const userKeys = Object.keys(user);

  // Loop through, and filter out the fields that are the same as existing
  const changes = Object.entries(input).filter(([key, value]) => {
    function isKeyOfUser(key: string): key is keyof typeof user {
      return userKeys.includes(key);
    }

    if (!isKeyOfUser(key)) return false;

    // exception for profileImage, if it's undefined, it means no change
    if (key === "profileImage" && value === undefined) return false;

    return value !== user[key];
  });

  const newProfileImageEntry = changes.find(([key]) => key === "profileImage");

  let newProfileImage:
    | Awaited<ReturnType<typeof getImagesMeta>>[number]
    | undefined;

  if (newProfileImageEntry) {
    const previousImage = user.profileImage;

    if (previousImage?.name) {
      await deleteImagesFromBucket([previousImage?.name], ctx.s3);

      await ctx.db.image.delete({
        where: { id: previousImage.id },
      });
    }

    newProfileImage = (await getImagesMeta([newProfileImageEntry[1]]))[0];
  }

  const fieldsToChange = Object.fromEntries(changes);

  await ctx.db.user.update({
    where: { id },
    data: {
      ...fieldsToChange,
      profileImage: {
        create: newProfileImage,
      },
    },
    include: { profileImage: true },
  });
}

export async function create({
  input,
  ctx,
}: {
  input: CreateInput;
  ctx: ContextProtected;
}) {
  const user = await ctx.db.user.create({
    data: { ...input },
  });

  return user;
}
