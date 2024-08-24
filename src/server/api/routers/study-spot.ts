import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

import {
  byIdSchema,
  bySlugSchema,
  createSchema,
  deleteSchema,
  getAllSchema,
  getPresignedUrlsSchema,
  updateSchema,
} from "@/schemas";

import {
  authorByIdHandler,
  byIdHandler,
  bySlugHandler,
  createHandler,
  deleteHandler,
  getAllHandler,
  getAllSlugsHandler,
  getCountriesHandler,
  getPresignedUrlHandler,
  updateHandler,
} from "@/server/controller/study-spot.controller";

export const studySpotRouter = createTRPCRouter({
  getAll: publicProcedure.input(getAllSchema).query(getAllHandler),
  getAllSlugs: publicProcedure.input(getAllSchema).query(getAllSlugsHandler),
  bySlug: publicProcedure.input(bySlugSchema).query(bySlugHandler),
  byId: publicProcedure.input(byIdSchema).query(byIdHandler),
  authorById: publicProcedure.input(byIdSchema).query(authorByIdHandler),
  getCountries: publicProcedure.query(getCountriesHandler),
  getPresignedUrls: protectedProcedure
    .input(getPresignedUrlsSchema)
    .mutation(getPresignedUrlHandler),
  create: protectedProcedure.input(createSchema).mutation(createHandler),
  delete: protectedProcedure.input(deleteSchema).mutation(deleteHandler),
  update: protectedProcedure.input(updateSchema).mutation(updateHandler),
});
