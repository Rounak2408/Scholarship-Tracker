/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'newhorizonindia.edu',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
  experimental: {
    turbo: {},
  },
}

export default nextConfig
