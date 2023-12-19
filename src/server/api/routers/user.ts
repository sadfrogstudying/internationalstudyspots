import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { updateUserServerSchema } from "@/schemas/user";
import { TRPCError } from "@trpc/server";
import { getPresignedUrls } from "@/lib/server-helpers";

export const userRouter = createTRPCRouter({
  currentBySession: protectedProcedure.input(z.void()).query(({ ctx }) => {
    const user = ctx.db.user.findUnique({
      include: { profileImage: true },
      where: { id: ctx.session.user.id },
    });

    return user;
  }),

  get: publicProcedure.input(z.string()).query(({ input, ctx }) => {
    const user = ctx.db.user.findUnique({
      include: { profileImage: true },
      where: { username: input },
    });

    return user;
  }),

  deleteCurrent: protectedProcedure.input(z.void()).mutation(({ ctx }) => {
    const user = ctx.db.user.delete({
      where: { id: ctx.session.user.id },
    });

    return user;
  }),

  /** Also acts as a input validator for the update procedure 😵‍💫. */
  getPresignedUrl: protectedProcedure
    .input(
      updateUserServerSchema.extend({
        profileImage: z
          .object({
            contentLength: z.number(),
            contentType: z.string(),
          })
          .optional(),
      }),
    )
    .output(z.void().or(z.string()))
    .mutation(async ({ ctx, input }) => {
      const id = ctx.session.user.id;
      const currentUser = await ctx.db.user.findUnique({
        where: { id },
      });

      if (!currentUser) throw new TRPCError({ code: "UNAUTHORIZED" });

      if (currentUser.username !== input.username) {
        const user = await ctx.db.user.findUnique({
          where: { username: input.username },
        });

        if (user)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Username already exists",
          });
      }

      if (!input.profileImage) return;

      const res = await getPresignedUrls([input.profileImage], ctx.s3);
      return res[0];
    }),

  update: protectedProcedure
    .input(updateUserServerSchema)
    .mutation(async ({ input, ctx }) => {
      const id = ctx.session.user.id;
      const user = await ctx.db.user.findUnique({
        where: { id },
      });

      if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

      const userKeys = Object.keys(user);

      // Only update the fields that have changed
      const changes = Object.entries(input).filter(([key, value]) => {
        if (key === "profileImage") {
          // not implemented
          return false;
        }

        function isKeyOfUser(key: string): key is keyof typeof user {
          return userKeys.includes(key);
        }

        if (!isKeyOfUser(key)) return false;

        return value !== user[key];
      });

      const fieldsToChange = Object.fromEntries(changes);

      const updatedUser = await ctx.db.user.update({
        where: { id },
        data: { ...fieldsToChange },
      });

      return updatedUser;
    }),

  // NextAuth's Prisma Adapter won't pass an initial profileImage
  create: protectedProcedure
    .input(updateUserServerSchema.omit({ profileImage: true }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.user.create({
        data: { ...input },
      });

      return user;
    }),
});
