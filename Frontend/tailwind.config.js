export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 24px 60px rgba(15, 23, 42, 0.18)',
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(circle at top, rgba(99, 102, 241, 0.18), transparent 32%)',
      },
    },
  },
  plugins: [],
}
