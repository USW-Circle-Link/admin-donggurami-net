import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFB052', // From Figma "로그인" button background
          foreground: '#FFFFFF',
        },
        destructive: {
          DEFAULT: '#FF3535', // From Figma error text
        },
        muted: {
          DEFAULT: '#9D9D9D', // From Figma text color
          foreground: '#D7D7D7', // Border color
        },
        background: '#F5F5F5', // Page background
      },
      fontFamily: {
        sans: ['Pretendard', 'sans-serif'],
        display: ['Jua', 'sans-serif'], // For "동구라미" text if not an image
      },
      boxShadow: {
        'card': '0px 0px 4px 0px rgba(0,0,0,0.25)',
        'container': '0px 4px 4px 0px rgba(0,0,0,0.25)',
      }
    },
  },
  plugins: [],
} satisfies Config;
