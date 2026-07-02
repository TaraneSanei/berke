module.exports = {
    theme: {
    extend: {
      textShadow: {
        app: 'var(--app-text-shadow)'
      },
      fontFamily: {
        Sahel: ['Sahel', 'sans-serif'],
      },
      colors: {
        forest: {
          primaryButton: 'var(--berke-bg-app)',
          surface: 'var(--berke-bg-surface)',
          'surface-hover': 'var(--berke-bg-surface-hover)',
          text: 'var(--berke-text-main)',
          muted: 'var(--berke-text-muted)',
          border: 'var(--berke-border-subtle)'
        }
    },
  },
  plugins: [require('tailwindcss-primeui')]
}
}
