/**
 * @format
 * @type {import('next').NextConfig}
 */

const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [{ hostname: "standing-egret-193.convex.cloud" }],
    },
};

export default nextConfig;
