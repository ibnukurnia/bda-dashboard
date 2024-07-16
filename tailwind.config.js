/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}', // Next.js pages
    './components/**/*.{js,ts,jsx,tsx}', // Your components
    './app/**/*.{js,ts,jsx,tsx}', // Next.js app directory (if using Next.js 13 with the app directory structure)
    './src/**/*.{js,ts,jsx,tsx}', // Any other directories where your components might be located
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#125D7A',
        'custom-red': '#4D0717',
        'custom-yellow': '#F59823',
        'custom-border': '#004889',
      },
      boxShadow: {
        'custom-shadow': '0px 4px 4px 0px #00000040',
      },
    },
  },
  plugins: [],
}
