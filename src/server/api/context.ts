import { db } from "@/server/db";
import { getServerAuthSession } from "@/server/auth";
import { s3 } from "@/server/aws/s3";

import { type Session } from "next-auth";
import { type PrismaClient } from "@prisma/client";
import { type S3 } from "@aws-sdk/client-s3";

export interface Context {
  session: Session | null;
  db: PrismaClient;
  s3: S3;
}
export interface ContextProtected extends Context {
  session: Session;
}

export async function createContext() {
  const session = await getServerAuthSession();

  return {
    session,
    db,
    s3,
  };
}
