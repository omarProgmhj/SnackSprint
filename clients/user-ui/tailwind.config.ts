import type { Config } from "tailwindcss";
import {heroui} from "@heroui/react";



export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        Poppins: ["var(--font-Poppins)"],
        Inter: ["var(--font-inter)"],
      },
    }, 
  },
  darkMode: "class",
  plugins: [heroui()],
} satisfies Config;
