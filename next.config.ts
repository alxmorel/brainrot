import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client"],
  async redirects() {
    return [{ source: "/shop", destination: "/create", permanent: true }];
  },
};

export default nextConfig;
