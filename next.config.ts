import type { NextConfig } from "next";

const config: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  pageExtensions: ["ts", "tsx", "mdx"],
  reactStrictMode: true,
};

export default config;
