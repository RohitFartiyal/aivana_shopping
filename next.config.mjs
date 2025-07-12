/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsHmrCache: false,
    serverActions: {
      bodySizeLimit: '5mb', // ← adjust this as needed
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xvdmmiomzntxqtynfxxz.supabase.co",
      },
    ],
  },
  // async headers() {
  //   return [
  //     {
  //       source: "/embed",
  //       headers: [
  //         {
  //           key: "Content-Security-Policy",
  //           value: "frame-src 'self' https://roadsidecoder.created.app;",
  //         },
  //       ],
  //     },
  //   ];
  // },
};

export default nextConfig;
