import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        discord: "#5865F2",
        bg: "#0f1115",
        panel: "#171a21",
      },
    },
  },
  plugins: [],
};

export default config;
