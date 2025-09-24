
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [];
  },
  /* config options here */
  allowedDevOrigins: [
    "*.cloudworkstations.dev",
    "6000-firebase-studio-1758517448147.cluster-qxqlf3vb3nbf2r42l5qfoebdry.cloudworkstations.dev",
    "6000-firebase-studio-1758517448147.cluster-l2pczvsb5qbq2vwj5zc7pagnji.cloudworkstations.dev",
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
