module.exports = {
  mode: 'jit',
  purge: [
    './js/**/*.{js,jsx,ts,tsx}',
    '../lib/*_web/**/*.*ex'
  ],
  darkMode: false,
  theme: {
    extend: {
      // Override tailwind default "sans" font with custom font "BakBakOne"
      // This font is defined in app.css
      fontFamily: {
        'sans': ['Bakbak One']
      },
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
