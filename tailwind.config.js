/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      animation: {
        'bounce-0': 'bounce 1s infinite 0s',
        'bounce-200': 'bounce 1s infinite 0.2s',
        'bounce-400': 'bounce 1s infinite 0.4s',
      },
    },
  },
  plugins: [],
}

