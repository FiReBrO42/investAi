/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors if needed
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
