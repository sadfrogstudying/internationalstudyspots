import type { Context, ContextProtected } from "@/server/api/trpc";
import type {
  BySlugInput,
  CreateInput,
  GetAllInput,
  GetPresignedUrlInput,
} from "@/schemas";
import { TRPCError } from "@trpc/server";
import { getPresignedUrls } from "@/lib/server-helpers";

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

/** Also acts as a input validator. */
export async function getPresignedUrlHandler({
  ctx,
  input,
}: {
  ctx: ContextProtected;
  input: GetPresignedUrlInput;
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

  if (!input.images) return;

  return await getPresignedUrls(input.images, ctx.s3);
}

export async function createHandler({
  ctx,
  input,
}: {
  ctx: ContextProtected;
  input: CreateInput;
}) {
  throw new TRPCError({
    code: "NOT_IMPLEMENTED",
    message: "Not implemented",
  });
}
