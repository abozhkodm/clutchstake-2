/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui'],
  compiler: {
    emotion: true,
  },
};

export default nextConfig;
