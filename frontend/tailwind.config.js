/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A56DB",
        brandBlue: "#1A56DB",
        brandLightBlue: "#EFF6FF",
        brandOrange: "#F97316",
        brandGreen: "#16A34A",
        brandAmber: "#D97706",
        brandRed: "#DC2626",
        brandWhite: "#FFFFFF",
        brandDarkText: "#111827",
        brandMutedText: "#6B7280",
      },
      fontFamily: {
        sans: ['"Noto Sans Tamil"', '"Latha"', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        'card': '16px',
        'btn': '12px',
        'input': '8px',
      }
    },
  },
  plugins: [],
}
