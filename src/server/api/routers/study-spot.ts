import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

import {
  bySlugSchema,
  createSchema,
  deleteSchema,
  getAllSchema,
  getPresignedUrlsSchema,
  updateSchema,
} from "@/schemas";

import {
  bySlugHandler,
  createHandler,
  deleteHandler,
  getAllHandler,
  getCountriesHandler,
  getPresignedUrlHandler,
  updateHandler,
} from "@/server/controller/study-spot.controller";

export const studySpotRouter = createTRPCRouter({
  getAll: publicProcedure.input(getAllSchema).query(getAllHandler),
  bySlug: publicProcedure.input(bySlugSchema).query(bySlugHandler),
  getCountries: publicProcedure.query(getCountriesHandler),
  getPresignedUrls: protectedProcedure
    .input(getPresignedUrlsSchema)
    .mutation(getPresignedUrlHandler),
  create: protectedProcedure.input(createSchema).mutation(createHandler),
  delete: protectedProcedure.input(deleteSchema).mutation(deleteHandler),
  update: protectedProcedure.input(updateSchema).mutation(updateHandler),
});
