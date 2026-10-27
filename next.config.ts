import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No Next.js badge in the corner during `npm run dev` (errors still show).
  devIndicators: false,
  // No full CSP: the head prefs script and Next's inline payloads would need
  // 'unsafe-inline', and form-action would block the no-JS mailto: form.
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    },
  ],
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
