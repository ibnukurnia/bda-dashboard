/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}', // Next.js pages
    './components/**/*.{js,ts,jsx,tsx}', // Your components
    './app/**/*.{js,ts,jsx,tsx}', // Next.js app directory (if using Next.js 13 with the app directory structure)
    './src/**/*.{js,ts,jsx,tsx}', // Any other directories where your components might be located
  ],
  theme: {
    screens: {
      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1440px',
      // => @media (min-width: 1440px) { ... }
    },
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
      borderColor: {
        'primary-blue': '#2563eb', // Custom border color
      },
    },
  },
  plugins: [],
}
