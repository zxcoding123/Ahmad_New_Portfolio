import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // Type errors now fail the build. ESLint is still skipped because it is not
  // installed in this project; add eslint + eslint-config-next to enable it.
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
    ],
  },
};

export default nextConfig;
