/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { bg: "#0e1a17", ink: "#eef3ea", muted: "#8fa39a", road: "#152621" },
      fontFamily: { sora: ["Sora", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};