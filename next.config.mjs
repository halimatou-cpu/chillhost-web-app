/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "chillhost-bucket.s3.amazonaws.com",
      "example.com",
      "via.placeholder.com",
    ],
  },
};

export default nextConfig;
