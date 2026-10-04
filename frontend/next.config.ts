import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Generate standalone server only when building a Docker container
  ...(process.env.DOCKER_BUILD ? { output: "standalone" } : {}),
};

export default nextConfig;

