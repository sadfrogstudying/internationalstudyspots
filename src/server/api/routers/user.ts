import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { createUserServerSchema } from "@/schemas/user";
import { TRPCError } from "@trpc/server";

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

  create: protectedProcedure.input(createUserServerSchema).mutation(() => {
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "Not implemented",
    });
  }),
});
