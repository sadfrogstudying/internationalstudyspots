import type { Prisma } from "@prisma/client";

export type StudySpotWithImage = Prisma.StudySpotGetPayload<{
  include: {
    images: true;
  };
}>;
