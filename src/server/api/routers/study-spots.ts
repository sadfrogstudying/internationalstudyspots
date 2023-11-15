import { object, number, string, boolean } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { createSpotSchemaServer } from "@/schemas";
import {
  getUnique,
  getManyHandler,
} from "@/server/controller/study-spot-controller";

export const studySpotRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      object({
        cursor: number().optional(),
        where: object({
          powerOutlets: boolean().optional(),
          wifi: boolean().optional(),
        }),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { cursor, where } = input;

      const spots = await getManyHandler(ctx.db, {
        ...(cursor && { skip: 1, cursor: { id: cursor } }),
        ...(where && {
          where: {
            powerOutlets: where.powerOutlets,
            wifi: where.wifi,
          },
        }),
      });

      return spots;
    }),

  bySlug: publicProcedure.input(string()).query(async ({ ctx, input }) => {
    const spot = await getUnique(ctx.db, {
      where: {
        slug: input,
      },
    });
    return spot;
  }),

  createSpot: publicProcedure
    .input(createSpotSchemaServer)
    .mutation(({ input }) => {
      console.log(input);
      return true;
    }),

  getCountries: publicProcedure.query(async ({ ctx }) => {
    const countries = await ctx.db.studySpot.findMany({
      select: {
        country: true,
      },
      distinct: ["country"],
    });

    return countries;
  }),
});
