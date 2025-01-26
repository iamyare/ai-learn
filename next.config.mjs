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
        serverComponentsExternalPackages: ['@react-pdf/renderer'],
    },
    webpack: (config, { isServer }) => {
        // Copiar el worker de PDF.js a la carpeta public
        if (!isServer) {
            const workerPath = require.resolve('pdfjs-dist/build/pdf.worker.min.js');
            const publicWorkerPath = path.join(__dirname, 'public', 'pdf.worker.min.js');
            
            if (!fs.existsSync(publicWorkerPath)) {
                fs.copyFileSync(workerPath, publicWorkerPath);
            }
        }
        return config;
    }
};

const isDev = process.env.NODE_ENV === 'development';

export default withPwa({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: isDev, // Deshabilitar PWA en modo desarrollo
})(nextConfig);