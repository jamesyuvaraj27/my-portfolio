import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#4F8EF7",
          600: "#3b82f6",
          700: "#2563eb",
          800: "#1d4ed8",
          900: "#1e3a8a",
        },
        secondary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e9eef5",
          300: "#dbe3ee",
          400: "#cbd5e1",
          500: "#b8c5d6",
          600: "#94a3b8",
          700: "#64748b",
          800: "#475569",
          900: "#334155",
        },
        accent: {
          blue: "#60A5FA",
          green: "#34D399",
          purple: "#A78BFA",
          gray: "#D1D5DB",
        },
        background: {
          DEFAULT: "#F5F7FA",
          900: "#EEF3F9",
          800: "#F8FAFC",
          700: "#FFFFFF",
        },
        card: "#FFFFFF",
        border: "#DCE3EC",
        text: {
          primary: "#1F2937",
          secondary: "#6B7280",
          muted: "#9CA3AF",
          disabled: "#CBD5E1",
        },
        success: {
          50: "#ECFDF5",
          500: "#34D399",
          600: "#10B981",
        },
        danger: {
          50: "#FEF2F2",
          500: "#F87171",
          600: "#EF4444",
        },
      },
      fontFamily: {
        inter: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: ["12px", { lineHeight: "1.6", letterSpacing: "0.02em" }],
        sm: ["14px", { lineHeight: "1.6", letterSpacing: "0.01em" }],
        base: ["16px", { lineHeight: "1.6", letterSpacing: "0em" }],
        lg: ["18px", { lineHeight: "1.6", letterSpacing: "0em" }],
        xl: ["20px", { lineHeight: "1.5", letterSpacing: "-0.01em" }],
        "2xl": ["24px", { lineHeight: "1.4", letterSpacing: "-0.01em" }],
        "3xl": ["32px", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "4xl": ["40px", { lineHeight: "1.1", letterSpacing: "-0.03em" }],
      },
      spacing: {
        18: "4.5rem",
      },
      borderRadius: {
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "32px",
      },
      boxShadow: {
        sm: "0 2px 10px rgba(0, 0, 0, 0.04)",
        md: "0 12px 30px rgba(15, 23, 42, 0.06)",
        lg: "0 20px 48px rgba(15, 23, 42, 0.08)",
        xl: "0 28px 60px rgba(15, 23, 42, 0.1)",
      },
      animation: {
        fadeIn: "fadeIn 280ms ease-in-out",
        slideInUp: "slideInUp 320ms ease-in-out",
        shimmer: "shimmer 1.8s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      transitionDuration: {
        quick: "200ms",
        smooth: "300ms",
        base: "320ms",
        slow: "400ms",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light"],
  },
};
