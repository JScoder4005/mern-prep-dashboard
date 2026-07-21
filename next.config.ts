import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // "standalone" is only for the Docker image (minimal self-contained server).
  // On Vercel/Netlify the platform's own Next runtime handles output, so we
  // leave it default there. The Dockerfile sets DOCKER_BUILD=1.
  output: process.env.DOCKER_BUILD ? "standalone" : undefined,
};

export default nextConfig;
