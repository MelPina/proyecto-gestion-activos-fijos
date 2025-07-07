/** @type {import('next').NextConfig} */
const nextConfig = {
    // Permitir conexiones a localhost con certificados auto-firmados
    experimental: {
      serverComponentsExternalPackages: [],
    },
    // Configuración para desarrollo local
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'https://localhost:7001/api/:path*',
        },
      ]
    },
    // Configuración de headers para CORS
    async headers() {
      return [
        {
          source: '/api/:path*',
          headers: [
            { key: 'Access-Control-Allow-Origin', value: '*' },
            { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
            { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          ],
        },
      ]
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      unoptimized: true,
    },
  }
  
  export default nextConfig
  