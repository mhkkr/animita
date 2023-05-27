/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        'annict': {
          100: '#d51c5b',
        },
      },
      fontFamily: {
        sans: ['Helvetica Neue', 'Arial', 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Meiryo', 'sans-serif'],
        roboto: ['var(--font-roboto)']
      },
    }
  },
  plugins: [
  ]
}
