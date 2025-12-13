/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    // <CHANGE> Added remotePatterns to allow Cloudinary images to load
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dglrrohii/**",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      }
    ],
  },
}

export default nextConfig
