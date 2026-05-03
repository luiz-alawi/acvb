import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'media', 
  theme: {
    extend: {
      colors: {
        acvb: {
          navy: "#0C1C36", 
          gold: "#B98D3B", 
        }
      },
    },
  },
  plugins: [],
};
export default config;