import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Disabilita l'indicatore/popup di sviluppo in basso a sinistra */
  devIndicators: false,
  cacheComponents: true,
  partialPrefetching: true,
  allowedDevOrigins: [
    '192.168.1.105',
    '192.168.1.105:3000',
    '192.168.1.53',
    '192.168.1.53:3000',
    '192.168.1.*',
  ],
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
