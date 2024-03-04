const withMDX = require("@next/mdx")();

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  images: {
    domains: ["yfixpvzkurnytlvefeos.supabase.co"],
  },
};

module.exports = withMDX(nextConfig);
