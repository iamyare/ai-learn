import withPwa from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.module.rules.push({
          test: /\.node$/,
          use: "raw-loader",
        });
        return config; // Asegúrate de devolver la configuración modificada
    },
};

const isDev = process.env.NODE_ENV === 'development';

const pwaConfig = withPwa({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: isDev, // Deshabilitar PWA en modo desarrollo
})(nextConfig);

export default pwaConfig;