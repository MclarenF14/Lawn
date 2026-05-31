/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
  },
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

module.exports = nextConfig;
