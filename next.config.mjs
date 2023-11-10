/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  images: {
    minimumCacheTTL: 60 * 60 * 24, // 1 day
    remotePatterns: [
      {
        hostname: "dh0bdxvf05sxo.cloudfront.net",
      },
    ],
  },
};

export default config;
