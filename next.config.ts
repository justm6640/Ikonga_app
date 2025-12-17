import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const config: NextConfig = {
  /* config options here */
};

const nextConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
})(config);

export default nextConfig;
