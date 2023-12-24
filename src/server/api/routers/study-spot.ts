import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { bySlugSchema, createSpotSchemaServer, getAllSchema } from "@/schemas";

import { TRPCError } from "@trpc/server";
import {
  bySlugHandler,
  getAllHandler,
  getCountriesHandler,
} from "@/server/controller/study-spot.controller";

export const studySpotRouter = createTRPCRouter({
  getAll: publicProcedure.input(getAllSchema).query(getAllHandler),
  bySlug: publicProcedure.input(bySlugSchema).query(bySlugHandler),
  getCountries: publicProcedure.query(getCountriesHandler),

  create: publicProcedure.input(createSpotSchemaServer).mutation(() => {
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "Not implemented",
    });
  }),
});
