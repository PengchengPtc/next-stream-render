import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 开启 serverActions
  experimental: {
    serverActions: {
      allowedOrigins: ["*"]
    },
  },
  // 配置服务器
  server: {
    port: 3000,
    host: '0.0.0.0', // 允许外部访问
  },
  // API 代理配置
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*',
      },
    ];
  },
};

export default nextConfig;