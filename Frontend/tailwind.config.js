export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 24px 60px rgba(15, 23, 42, 0.18)',
        glow: '0 0 120px rgba(56, 189, 248, 0.12)',
      },
      animation: {
        float: 'float 30s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(16px, -18px)' },
        },
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(circle at top, rgba(99, 102, 241, 0.18), transparent 32%)',
      },
    },
  },
  plugins: [],
}
