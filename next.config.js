/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  scope: '/app',
  skipWaiting: true,
  disable: process.env.NEXT_PUBLIC_NODE_ENV === 'development'
});

module.exports = withPWA({
  turbopack: {}, // Next.js 16 で webpack を使用することを明示
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
        },
      ],
    });
    return config;
  },
  images: {
    disableStaticImages: true, // importした画像の型定義設定を無効にする
  }
});