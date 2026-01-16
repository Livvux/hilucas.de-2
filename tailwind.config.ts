import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './mdx-components.tsx',
  ],
  darkMode: 'class',
};

export default config;
