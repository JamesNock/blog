module.exports = {
  content: [
    './resources/**/*.antlers.html',
    './resources/**/*.blade.php',
    './content/**/*.md'
  ],
  theme: {
    extend: {
        colors: {
            'black': '#12151E',
            'hot-pink': '#fd2d78',
            'cyan-jn': '#0ff'
        },
        fontFamily: {
            display: "var(--font-display)",
            body: "var(--font-body)",
            brand: "goodtimes"
        }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  important: true
}
