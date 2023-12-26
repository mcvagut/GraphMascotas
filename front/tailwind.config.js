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
      'purple2':'#7c4fd0',
      'fav':'#64ad6b',
      'bluefav':'#435585',
      'redfav':'#CE5A67',
      'orangefav':'#EC8F5E',
      'redHover': '#B40101',
      'orangeHover':'#C67200',
      'greenfav': '#2CDC57'
    },
    extend: {
      spacing: {
        '128': '32rem', 
      },
      boxShadow: {
        'shadowp': '0 0px 6px 2px rgba(0, 0, 0, 0.3)',
      },
      fontFamily: {
        'sans': ['Roboto', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      },
      width: {
        'pet-image': '400px', // Define el ancho que desees
      },
      height: {
        'pet-image': '200px', // Define la altura que desees
      },
  
    },
  },
  plugins: [
    require('tailwindcss-animatecss'),
    
  ],
};