import type { Context } from "@/server/api/trpc";
import type { BySlugInput, GetAllInput } from "@/schemas";

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
