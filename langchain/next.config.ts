import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer'


const nextConfig: NextConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default nextConfig;
