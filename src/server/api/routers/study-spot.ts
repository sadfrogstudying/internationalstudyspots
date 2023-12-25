import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import {
  bySlugSchema,
  createSchema,
  getAllSchema,
  getPresignedUrlsSchema,
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
  getPresignedUrls: protectedProcedure
    .input(getPresignedUrlsSchema)
    .mutation(getPresignedUrlHandler),
  create: protectedProcedure.input(createSchema).mutation(createHandler),
});
