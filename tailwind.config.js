/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'davi-red': '#E4002B',
        'davi-pink': '#FF4D6D',
        'davi-gray': {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
        }
      },
      backgroundImage: {
        'davi-gradient': 'linear-gradient(135deg, #E4002B 0%, #FF4D6D 100%)',
      }
    },
  },
  plugins: [],
}

