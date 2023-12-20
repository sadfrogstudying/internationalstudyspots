import { TRPCError } from "@trpc/server";
import type { Context, ContextProtected } from "@/server/api/trpc";
import type {
  CreateInput,
  GetInput,
  GetPresignedUrlInput,
  UpdateUserServer,
} from "@/schemas/user";
import { getPresignedUrls } from "@/lib/server-helpers";

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

  if (!currentUser) throw new TRPCError({ code: "UNAUTHORIZED" });

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
  input: UpdateUserServer;
  ctx: ContextProtected;
}) {
  const id = ctx?.session?.user.id;

  if (!id) throw new TRPCError({ code: "UNAUTHORIZED" });

  const user = await ctx.db.user.findUnique({
    where: { id },
  });

  if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

  const userKeys = Object.keys(user);

  // Only update the fields that have changed
  const changes = Object.entries(input).filter(([key, value]) => {
    if (key === "profileImage") {
      // not implemented
      return false;
    }

    function isKeyOfUser(key: string): key is keyof typeof user {
      return userKeys.includes(key);
    }

    if (!isKeyOfUser(key)) return false;

    return value !== user[key];
  });

  const fieldsToChange = Object.fromEntries(changes);

  const updatedUser = await ctx.db.user.update({
    where: { id },
    data: { ...fieldsToChange },
  });

  return updatedUser;
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
