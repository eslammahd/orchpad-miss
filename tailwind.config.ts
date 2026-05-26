import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2C6E8A',
        accent: '#4BAEA0',
        soft: '#F0F7FA'
      },
      fontFamily: {
        arabic: ['Cairo', 'sans-serif']
      }
    }
  },
  plugins: []
};
export default config;
