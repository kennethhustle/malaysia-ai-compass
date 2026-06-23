import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        hustle: {
          orange:   '#FF5C00',
          orange2:  '#FB7500',
          amber:    '#FFB000',
          dark:     '#2E2B24',
          bg:       '#FFF4ED',
          purple:   '#B811DF',
          red:      '#E12323',
          peach:    '#FFDBAE',
          lavender: '#E3CDFF',
        },
      },
      fontFamily: {
        knewave:  ['var(--font-knewave)', 'Knewave', 'cursive'],
        urbanist: ['var(--font-urbanist)', 'Urbanist', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};

export default config;
