import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f1117",
        panel: "#161a23",
        edge: "#252b38",
        brand: "#5b8cff",
        brand2: "#7c5bff",
        good: "#37d399",
        warn: "#f5b544",
        muted: "#8b93a7",
      },
    },
  },
  plugins: [],
};

export default config;
