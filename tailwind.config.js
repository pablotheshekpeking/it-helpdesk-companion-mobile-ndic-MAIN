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
        primary: { DEFAULT: "#7434fc", foreground: "#ffffff" },
        secondary: { DEFAULT: "#f5f1fe", foreground: "#7434fc" },
        muted: { DEFAULT: "#f5f1fe", foreground: "#5e5675" },
        accent: { DEFAULT: "#ede5ff", foreground: "#1a1a1a" },
        destructive: "#c2410c",
        border: "#e3dbf6",
        input: "#e3dbf6",
        ring: "#7434fc",
        sidebar: "#f7f4fe",
      },
      borderRadius: {
        lg: "0.625rem",
        xl: "0.875rem",
      },
    },
  },
  plugins: [],
};
