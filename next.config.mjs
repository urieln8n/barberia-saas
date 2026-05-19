/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard/barberias",
        destination: "/dashboard/marketplace",
        permanent: true,
      },
      {
        source: "/alternativa-booksy",
        destination: "/alternativa-a-booksy",
        permanent: true,
      },
      {
        source: "/alternativa-booksy-barberias",
        destination: "/alternativa-a-booksy",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
