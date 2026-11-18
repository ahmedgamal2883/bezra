import type { NextConfig } from "next";

// The website calls the Python backend through its own /api/... address, so the sign-in cookie
// belongs to the website's domain (works the same on localhost and on Vercel).
const BACKEND = process.env.BACKEND_URL || "http://localhost:8000";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Pages from before the redesign that now live inside a new page (the old screens stay in the code).
  async redirects() {
    const f = (from: string, to: string) => ({ source: `/field/:id${from}`, destination: `/field/:id/${to}`, permanent: false });
    return [
      f('', 'today'), f('/health', 'today'), f('/squares', 'today'),
      f('/plan', 'season'), f('/calendar', 'season'), f('/tasks', 'season'),
      f('/alerts', 'crop'), f('/diagnose', 'crop/check'), f('/next', 'soil'),
      { source: '/sim', destination: '/today?to=season/try', permanent: false },
      { source: '/onboarding', destination: '/fields/new', permanent: false },
    ];
  },
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${BACKEND}/:path*` }];
  },
};

export default nextConfig;
