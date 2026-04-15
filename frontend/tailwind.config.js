/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'camel-sand': '#D4A957',
        'camel-tobacco': '#8B5E3C',
        'camel-cream': '#F5ECD7',
        'camel-rust': '#C1440E',
        'camel-midnight': '#1A1A2E',
        'camel-sage': '#6B7F5E',
        'camel-sky': '#7CAFC4',
        'camel-dust': '#E8D5B7',
        'camel-charcoal': '#2D2D2D',
        'camel-paper': '#FDF8EF',
        'income-color': '#4A7C59',
        'expense-color': '#C1440E',
        'streak-color': '#D4A957',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Source Serif 4', 'Times New Roman', 'serif'],
        mono: ['DM Mono', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
