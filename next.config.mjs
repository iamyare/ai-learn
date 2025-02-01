import withPwa from 'next-pwa';
import path from 'path';
import fs from 'fs';

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        serverActions: true,
        serverActions: {
            bodySizeLimit: '25mb'
        },
        serverComponentsExternalPackages: ['@aws-sdk/client-s3', '@react-pdf/renderer'],
    },
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET,HEAD,PUT,POST,DELETE' },
                    { key: 'Access-Control-Allow-Headers', value: 'content-type' }
                ]
            }
        ]
    },
    webpack: function (config) {
        /**
         * Critical: prevents " ⨯ ./node_modules/canvas/build/Release/canvas.node
         * Module parse failed: Unexpected character '�' (1:0)" error
         */
        config.resolve.alias.canvas = false;

        // You may not need this, it's just to support moduleResolution: 'node16'
        config.resolve.extensionAlias = {
            '.js': ['.js', '.ts', '.tsx'],
        };

        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });

        return config;
    },
};

const isDev = process.env.NODE_ENV === 'development';

export default withPwa({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: isDev, // Deshabilitar PWA en modo desarrollo
})(nextConfig);