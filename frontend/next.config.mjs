
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/:path*`,
      },
      {
        source: "/track",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/track`,
      },
      {
        source: "/log/time",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/log/time`,
      },
    ];
  },
};

export default nextConfig;
