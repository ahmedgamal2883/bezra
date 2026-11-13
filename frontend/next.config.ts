import type { NextConfig } from "next";

// The website calls the Python backend through its own /api/... address, so the sign-in cookie
// belongs to the website's domain (works the same on localhost and on Vercel).
const BACKEND = process.env.BACKEND_URL || "http://localhost:8000";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${BACKEND}/:path*` }];
  },
};

export default nextConfig;
