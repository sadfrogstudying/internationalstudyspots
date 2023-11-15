import {
  createTRPCProxyClient,
  loggerLink,
  unstable_httpBatchStreamLink,
} from "@trpc/client";
import { cookies } from "next/headers";

import { type AppRouter } from "@/server/api/root";
import { getUrl, transformer } from "./shared";

// The context also exposes your tRPC proxy client. This lets you call
// your procedures with async/await without needing to create an additional
// vanilla client.
export const api = createTRPCProxyClient<AppRouter>({
  transformer,
  links: [
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === "development" ||
        (op.direction === "down" && op.result instanceof Error),
    }),
    unstable_httpBatchStreamLink({
      url: getUrl(),
      headers() {
        return {
          cookie: cookies().toString(),
          "x-trpc-source": "rsc",
        };
      },
    }),
  ],
});
