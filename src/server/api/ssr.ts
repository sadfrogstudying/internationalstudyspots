import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "./root";
import superjson from "superjson";
import { createContext } from "./context";

/**
 * Server-Side Helper
 * @description use this function to call tRPC procedures server-side and hydrate `react-query`'s cache
 * @see https://trpc.io/docs/client/nextjs/server-side-helpers#1-internal-router
 */
export async function createSSRHelper() {
  return createServerSideHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });
}
