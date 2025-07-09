/** @type {import('next').NextConfig} */
    const nextConfig = {
      images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "res.cloudinary.com",
            port: "",
            pathname: "/dnnirdpwf/image/upload/**", // Adjust 'dnnirdpwf' to your cloud_name if different
          },
        ],
      },
    };

export default nextConfig;


