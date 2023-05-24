/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ＭＳ ゴシック', 'Helvetica Neue', 'Arial', 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Meiryo', 'sans-serif'],
        roboto: ['var(--font-roboto)'],
      },
    }
  },
  plugins: [
  ]
}
