import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { createSpotSchemaServer } from "@/schemas";

export const postRouter = createTRPCRouter({
  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }),

  createSpot: publicProcedure
    .input(createSpotSchemaServer)
    .output(z.boolean())
    .mutation(({ ctx, input }) => {
      console.log(input);

      return true;
    }),
});
