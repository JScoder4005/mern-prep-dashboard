import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // "standalone" bundles a minimal server + only the needed node_modules into
  // .next/standalone, so the Docker runtime image stays small (no full deps copy).
  output: "standalone",
};

export default nextConfig;
