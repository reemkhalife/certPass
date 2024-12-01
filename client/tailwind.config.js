/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(20deg, rgba(42, 244, 155, 1), rgba(40, 238, 173, 1), rgba(33, 214, 248, 1))',
       
      },
      colors: {
        'custom-gray': 'rgba(54, 67, 80, 1)',
        'custom-green':'rgba(42, 244, 155, 1)'
      }
    }
  },
  plugins: [],
}


