/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'safari-deep': '#0A1510',
        'safari-deep-alt': '#101c17',
        'safari-olive': '#374736',
        'safari-accent': '#D9A441',
        'safari-accent-soft': '#f0c870',
        'safari-cream': '#F5E9D3',
        'safari-sand': '#C9B08A',
        'safari-danger': '#F25C54',
        'safari-success': '#38b000',
        'safari-warning': '#FFB703'
      },
      boxShadow: {
        'safari-soft': '0 18px 45px rgba(0,0,0,0.35)'
      },
      fontFamily: {
        display: ['system-ui', 'ui-sans-serif', 'sans-serif'],
        sans: ['system-ui', 'ui-sans-serif', 'sans-serif']
      }
    }
  },
  plugins: []
};

