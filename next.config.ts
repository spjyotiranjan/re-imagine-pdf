import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
        remotePatterns:[{
            protocol: "https",
            hostname: "*"
        }]
    },
    webpack: (config, { isServer, webpack }) => {
        // 🔧 Example: Add a custom plugin
        config.plugins.push(new webpack.DefinePlugin({
            __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
        }));

        // ✅ Example: Set fallback for fs module
        if (!isServer) {
            config.resolve.fallback = {
                fs: false,
                path: false,
            };
        }

        return config;
    },
};

export default nextConfig;
