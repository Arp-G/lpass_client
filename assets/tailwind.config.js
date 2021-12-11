module.exports = {
  mode: 'jit',
  purge: [
    './js/**/*.{js,jsx,ts,tsx}',
    '../lib/*_web/**/*.*ex'
  ],
  darkMode: false,
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
