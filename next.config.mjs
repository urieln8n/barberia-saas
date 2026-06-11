/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.supabase.in" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
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
