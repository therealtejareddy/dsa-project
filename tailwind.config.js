/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        '8.5': '34px',   // for w-8.5
        '10.5': '42px',  // for w-10.5
        '30': '120px',   // for w-30
      },
      minWidth: {
        '17.5': '70px',  // for min-w-17.5
      },
      zIndex: {
        '9999': '9999',  // for z-9999
      },
      animation: {
        'fade-in': 'fadeIn 0.18s ease',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
