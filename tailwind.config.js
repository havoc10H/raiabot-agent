/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'sidebar-background': '#171717',
        'threeoptions-background': '#2F2F2F',
        'threeoptions-hover': '#424242',
        'custom-hover-gray': '#212121',
        'custom-hover-gray2': '#B8B8B8',
        'custom-hover-gray3': '#2F2F2F',
        'custom-text-gray': '#676767',
        'custom-red': '#C74444',
        'main-background': '#212121',
        'engine-version-text': '#B4B4B4',
        'custom-hover-gray4': '#2F2F2F',
        'custom-hover-gray5': '#424242',
        'suggestion-border': '#4E4E4E',
        'suggestion-decription-text': '#828282',
        'button-background': '#383838'
      },
    },
  },
  plugins: [],
}
