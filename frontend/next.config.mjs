
const nextConfig = {
  async rewrites() {
    console.log("BACKEND_URL:", process.env.BACKEND_URL);
    // In Docker, we default to http://backend:5000. For local dev, ensure BACKEND_URL i set or we might need logic.
    // Assuming this Docker setup is the priority.
    const backendUrl = process.env.BACKEND_URL || "http://backend:5000";
    console.log("Using Backend URL for rewrites:", backendUrl);
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/track",
        destination: `${backendUrl}/track`,
      },
      {
        source: "/log/time",
        destination: `${backendUrl}/log/time`,
      },
    ];
  },
};

export default nextConfig;
