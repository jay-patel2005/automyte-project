/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    compress: true,
    transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
    compiler: {
        removeConsole: process.env.NODE_ENV === "production",
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
