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
  currentBySession,
  deleteCurrent,
  get,
  getPresignedUrl,
  updateHandler,
} from "@/server/controller/user.controller";

export const userRouter = createTRPCRouter({
  currentBySession: protectedProcedure.input(z.void()).query(currentBySession),
  get: publicProcedure.input(getSchema).query(get),
  deleteCurrent: protectedProcedure.input(z.void()).mutation(deleteCurrent),
  getPresignedUrl: protectedProcedure
    .input(getPresignedUrlSchema)
    .output(z.void().or(z.string()))
    .mutation(getPresignedUrl),
  update: protectedProcedure
    .input(updateUserServerSchema)
    .mutation(updateHandler),
  create: protectedProcedure.input(createSchema).mutation(create),
});
