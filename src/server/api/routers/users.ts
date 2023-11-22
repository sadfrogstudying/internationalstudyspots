import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  currentBySession: protectedProcedure
    .input(z.void())
    .query(async ({ ctx }) => {
      if (!ctx.session?.user) {
        return null;
      }

      const user = await ctx.db.user.findUnique({
        where: {
          email: ctx.session?.user.email as string,
        },
        include: {
          profilePicture: true,
        },
      });

      return user;
    }),
});
