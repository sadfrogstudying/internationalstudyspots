import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import {
  bySlugSchema,
  createSchema,
  getAllSchema,
  getPresignedUrlSchema,
} from "@/schemas";

import {
  bySlugHandler,
  createHandler,
  getAllHandler,
  getCountriesHandler,
  getPresignedUrlHandler,
} from "@/server/controller/study-spot.controller";

export const studySpotRouter = createTRPCRouter({
  getAll: publicProcedure.input(getAllSchema).query(getAllHandler),
  bySlug: publicProcedure.input(bySlugSchema).query(bySlugHandler),
  getCountries: publicProcedure.query(getCountriesHandler),
  getPresignedUrl: protectedProcedure
    .input(getPresignedUrlSchema)
    .query(getPresignedUrlHandler),
  create: protectedProcedure.input(createSchema).mutation(createHandler),
});
