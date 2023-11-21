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
      'black':'#040D12',
      'purple2':'#7c4fd0',
      'fav':'#64ad6b',
      'green1':'#183D3D',
      'greenP':'#5C8374',
      'green3':'#93B1A6',

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
      fontColor: {
        'greenP': '#5C8374',
      },
    },
  },
  plugins: [
    require('tailwindcss-animatecss'),
    
  ],
};