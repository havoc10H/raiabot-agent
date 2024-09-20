/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'custom-black': '#171717',
        'custom-black2': '#212121',
        'custom-black3': '#4E4E4E',
        'custom-black4': '#383838',
        'custom-black5': '#2F2F2F',
        'custom-gray': '#828282',
        'custom-red': '#EC407A'
      },
    },
  },
  plugins: [],
}
