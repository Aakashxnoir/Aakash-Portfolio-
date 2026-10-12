import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
