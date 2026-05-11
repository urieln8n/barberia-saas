/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard/barberias",
        destination: "/dashboard/marketplace",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
