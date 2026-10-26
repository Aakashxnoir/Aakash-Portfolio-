import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No Next.js badge in the corner during `npm run dev` (errors still show).
  devIndicators: false,
  // Cache Components stays off: the site is fully static, and keeping old routes
  // mounted but hidden would fight the page transition and pinned scroll.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
