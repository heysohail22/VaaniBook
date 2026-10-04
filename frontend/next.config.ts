import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output is only for Docker containers.
  // On Vercel, it causes ENOENT: next-server.js.nft.json build errors.
  ...(process.env.VERCEL ? {} : { output: "standalone" }),
};

export default nextConfig;

