/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#1a1a1a",
        card: { DEFAULT: "#ffffff", foreground: "#1a1a1a" },
        primary: { DEFAULT: "#006b3f", foreground: "#ffffff" },
        secondary: { DEFAULT: "#f3f8f5", foreground: "#006b3f" },
        muted: { DEFAULT: "#f3f8f5", foreground: "#4a6356" },
        accent: { DEFAULT: "#fff8db", foreground: "#1a1a1a" },
        destructive: "#c2410c",
        border: "#d5e3db",
        input: "#d5e3db",
        ring: "#006b3f",
        sidebar: "#f3f8f5",
      },
      borderRadius: {
        lg: "0.625rem",
        xl: "0.875rem",
      },
    },
  },
  plugins: [],
};
