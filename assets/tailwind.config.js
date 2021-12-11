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

      // Custom colors
      colors: {
        'custom-yellow': '#ef5734',
      },

      // Custom gradient
      backgroundImage: {
        'red-gradient': "linear-gradient(315deg, #ef5734 0%, #ffcc2f 74%);",
      },

      // Custom animations
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'gradient-xy': 'gradient-xy 3s ease infinite'
      },

      // Custom animations keyframes
      keyframes: {
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        }
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
