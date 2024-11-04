/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    './src/**/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/constants.ts'
  ],
  theme: {
    extend: {
      colors: {
        'annict': {
          100: '#d51c5b',
        },
      },
      fontFamily: {
        sans: ['Helvetica Neue', 'Arial', 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Meiryo', 'sans-serif']
      },
    }
  },
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.line-clamp': {
          display: '-webkit-box',
          '-webkit-line-clamp': '1',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        '.line-clamp-2': {
          display: '-webkit-box',
          '-webkit-line-clamp': '2',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        '.leading-trim': {
          marginBlock: 'calc((1em - 1lh) / 2)',
        },
      })
    }),
  ]
}
