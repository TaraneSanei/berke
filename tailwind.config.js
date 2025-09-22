module.exports = {
    theme: {
    extend: {
      textShadow: {
        app: 'var(--app-text-shadow)'
      },
      fontFamily: {
        Sahel: ['Sahel', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-primeui')]
}
