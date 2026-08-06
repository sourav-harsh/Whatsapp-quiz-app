/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        wa: {
          teal: "#128C7E",
          tealDark: "#075E54",
          green: "#25D366",
          greenLight: "#DCF8C6",
          bg: "#ECE5DD",
          panel: "#FFFFFF",
          text: "#111B21",
          muted: "#667781",
          border: "#E9EDEF",
          bubble: "#F0F2F5",
        },
      },
      fontFamily: {
        sans: ["Segoe UI", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
      boxShadow: {
        panel: "0 6px 24px rgba(11,20,26,0.12)",
        bubble: "0 1px 0.5px rgba(11,20,26,0.13)",
      },
      backgroundImage: {
        "chat-pattern":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='%23d9d2c8' fill-opacity='0.45'%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3Ccircle cx='40' cy='25' r='1.5'/%3E%3Ccircle cx='25' cy='48' r='2'/%3E%3Ccircle cx='52' cy='52' r='1.5'/%3E%3C/g%3E%3C/svg%3E\")",
      },
      keyframes: {
        pop: { "0%": { opacity: 0, transform: "translateY(8px) scale(.98)" }, "100%": { opacity: 1, transform: "translateY(0) scale(1)" } },
      },
      animation: { pop: "pop .22s ease-out both" },
    },
  },
  plugins: [],
};
