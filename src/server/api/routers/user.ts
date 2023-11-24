import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { createUserServerSchema } from "@/schemas/user";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  currentBySession: publicProcedure.input(z.void()).query(() => {
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "Not implemented",
    });
  }),

  create: publicProcedure.input(createUserServerSchema).mutation(() => {
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "Not implemented",
    });
  }),
});
