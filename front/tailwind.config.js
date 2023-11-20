/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Archivos JavaScript y React
    './public/index.html', // Archivo HTML
  ],
  theme: {
    colors: {
      'purple':'#351f67',
      'white':'#ffffff',
      'black':'#3D3D3D',
      'purple2':'#7c4fd0'

    },
    extend: {},
  },
  plugins: [
    require('tailwindcss-animatecss'),
    
  ],
};