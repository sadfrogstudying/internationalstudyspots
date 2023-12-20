import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import {
  createSchema,
  getPresignedUrlSchema,
  getSchema,
  updateUserServerSchema,
} from "@/schemas/user";
import {
  create,
  currentBySessionHandler,
  deleteCurrentHandler,
  getHandler,
  getPresignedUrlHandler,
  updateHandler,
} from "@/server/controller/user.controller";

export const userRouter = createTRPCRouter({
  currentBySession: protectedProcedure
    .input(z.void())
    .query(currentBySessionHandler),
  get: publicProcedure.input(getSchema).query(getHandler),
  deleteCurrent: protectedProcedure
    .input(z.void())
    .mutation(deleteCurrentHandler),
  getPresignedUrl: protectedProcedure
    .input(getPresignedUrlSchema)
    .output(z.void().or(z.string()))
    .mutation(getPresignedUrlHandler),
  update: protectedProcedure
    .input(updateUserServerSchema)
    .mutation(updateHandler),
  create: protectedProcedure.input(createSchema).mutation(create),
});
