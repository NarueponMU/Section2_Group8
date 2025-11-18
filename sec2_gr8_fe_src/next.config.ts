import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   env: {
    API_BASE_URL: 'http://localhost:5000',
  },
};

export default nextConfig;
