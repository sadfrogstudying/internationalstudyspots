import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";

import { env } from "@/env";
import { db } from "@/server/db";
import { type PrismaClient } from "@prisma/client";

import type { Adapter } from "next-auth/adapters";

const PrismaAdapterExtended = (p: PrismaClient): Adapter => {
  return {
    ...PrismaAdapter(p),
    // @ts-expect-error required for overriding PrismaAdapter method
    createUser(user) {
      const modifiedUser = { ...user };
      delete modifiedUser.image;

      return p.user.create({
        data: {
          ...modifiedUser,
        },
      });
    },
  };
};

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & UserObject;
  }

  type UserNonNullable = NonNullable<DefaultSession["user"]>;
  type UserObject = Omit<UserNonNullable, "image">;
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        id: user.id,
        name: session.user.name,
        email: session.user.email,
      },
    }),
  },
  adapter: PrismaAdapterExtended(db),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      // authorization: {
      //   params: {
      //     prompt: "consent",
      //     access_type: "offline",
      //     response_type: "code",
      //   },
      // },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * Can drastically reduce response time when used over getSession on
 * server-side, due to avoiding an extra fetch to an API Route (this is
 * generally not recommended in Next.js)
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
