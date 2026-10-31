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
        primary: { DEFAULT: "#2c2f80", foreground: "#ffffff" },
        secondary: { DEFAULT: "#f2f4fa", foreground: "#2c2f80" },
        muted: { DEFAULT: "#f2f4fa", foreground: "#525a7a" },
        accent: { DEFAULT: "#e6f3fa", foreground: "#1a1a1a" },
        destructive: "#c2410c",
        border: "#d9ddec",
        input: "#d9ddec",
        ring: "#2c2f80",
        sidebar: "#f2f4fa",
      },
      borderRadius: {
        lg: "0.625rem",
        xl: "0.875rem",
      },
    },
  },
  plugins: [],
};
