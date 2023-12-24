import type { PrismaClient, Prisma } from "@prisma/client";

export async function findManyService(
  db: PrismaClient,
  args?: Prisma.StudySpotFindManyArgs,
) {
  const spots = await db.studySpot.findMany({
    orderBy: {
      createdAt: "desc",
    },
    ...args,
    include: {
      images: true,
      ...args?.include,
    },
  });

  return spots;
}
