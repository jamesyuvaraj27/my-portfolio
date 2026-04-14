/**
 * Premium Design System Configuration
 * Defines colors, spacing, typography, shadows, and animations
 */

export const DESIGN_SYSTEM = {
  // ========== COLOR PALETTE ==========
  colors: {
    primary: {
      50: "#f0f4ff",
      100: "#e0e8ff",
      200: "#c7d2fe",
      300: "#a5b4fc",
      400: "#818cf8",
      500: "#6366f1",
      600: "#4f46e5",
      700: "#4338ca",
      800: "#3730a3",
      900: "#312e81",
    },
    secondary: {
      50: "#faf5ff",
      100: "#f3e8ff",
      200: "#e9d5ff",
      300: "#d8b4fe",
      400: "#c084fc",
      500: "#a855f7",
      600: "#9333ea",
      700: "#7e22ce",
      800: "#6b21a8",
      900: "#581c87",
    },
    accent: {
      cyan: "#06b6d4",
      purple: "#a855f7",
      pink: "#ec4899",
      orange: "#f97316",
    },
    background: {
      primary: "#0b0f19",
      secondary: "#111827",
      tertiary: "#1f2937",
    },
    neutral: {
      white: "#ffffff",
      900: "#0b0f19",
      800: "#111827",
      700: "#1f2937",
      600: "#374151",
      500: "#6b7280",
      400: "#9ca3af",
      300: "#d1d5db",
      200: "#e5e7eb",
      100: "#f3f4f6",
      50: "#f9fafb",
    },
    semantic: {
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
  },

  // ========== SPACING SCALE ==========
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "48px",
    "3xl": "64px",
  },

  // ========== TYPOGRAPHY ==========
  typography: {
    fontFamily: {
      poppins: '"Poppins", ui-sans-serif, system-ui, sans-serif',
      inter: '"Inter", ui-sans-serif, system-ui, sans-serif',
    },
    fontSize: {
      xs: { size: "12px", lineHeight: "16px", letterSpacing: "0.5px" },
      sm: { size: "14px", lineHeight: "20px", letterSpacing: "0.25px" },
      base: { size: "16px", lineHeight: "24px", letterSpacing: "0px" },
      lg: { size: "18px", lineHeight: "28px", letterSpacing: "0px" },
      xl: { size: "20px", lineHeight: "28px", letterSpacing: "0px" },
      "2xl": { size: "24px", lineHeight: "32px", letterSpacing: "0px" },
      "3xl": { size: "30px", lineHeight: "36px", letterSpacing: "-0.5px" },
      "4xl": { size: "36px", lineHeight: "40px", letterSpacing: "-0.5px" },
      "5xl": { size: "48px", lineHeight: "56px", letterSpacing: "-1px" },
      "6xl": { size: "56px", lineHeight: "64px", letterSpacing: "-1px" },
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },

  // ========== BORDER RADIUS ==========
  borderRadius: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "32px",
    full: "9999px",
  },

  // ========== SHADOWS ==========
  shadows: {
    xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    // Glow effects
    glowPrimary: "0 0 20px rgba(99, 102, 241, 0.3)",
    glowLg: "0 0 40px rgba(99, 102, 241, 0.4)",
    glowSecondary: "0 0 20px rgba(168, 85, 247, 0.3)",
  },

  // ========== GRADIENTS ==========
  gradients: {
    primary: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    primaryVivid: "linear-gradient(90deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
    accent: "linear-gradient(90deg, #06b6d4 0%, #a855f7 50%, #f97316 100%)",
    featured: "linear-gradient(135deg, #6366f1 0%, #a855f7 55%, #ec4899 100%)",
  },

  // ========== ANIMATIONS ==========
  animations: {
    fadeIn: "fadeIn 0.5s ease-in-out",
    slideInUp: "slideInUp 0.5s ease-out",
    slideInDown: "slideInDown 0.3s ease-out",
    pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    shimmer: "shimmer 2s linear infinite",
    glow: "glow 2s ease-in-out infinite",
  },

  // ========== TRANSITIONS ==========
  transitions: {
    quick: "150ms",
    smooth: "250ms",
    base: "300ms",
    slow: "500ms",
  },

  // ========== Z-INDEX STACK ==========
  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    backdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },

  // ========== CONTAINER SIZES ==========
  containers: {
    full: "100%",
    screen: "100vw",
    xs: "320px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1400px",
    max: "1400px",
  },

  // ========== BREAKPOINTS ==========
  breakpoints: {
    xs: "320px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1400px",
  },
};

// ========== UTILITY FUNCTIONS ==========

/**
 * Merge class names conditionally
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

/**
 * Get color by path (e.g., "primary.500" or "neutral.white")
 */
export const getColor = (path) => {
  const keys = path.split(".");
  let value = DESIGN_SYSTEM.colors;

  for (const key of keys) {
    value = value?.[key];
  }

  return value || null;
};

/**
 * Create responsive class helper
 */
export const responsive = (mobileClass, tabletClass = null, desktopClass = null) => {
  const classes = [
    mobileClass,
    tabletClass && `md:${tabletClass}`,
    desktopClass && `lg:${desktopClass}`,
  ];

  return cn(...classes);
};

/**
 * Animation delay helper
 */
export const animationDelay = (index, baseDelay = 100) => {
  return `${index * baseDelay}ms`;
};

/**
 * Export color CSS variables as inline styles
 */
export const getCSSVariables = () => {
  return {
    "--primary": "99 102 241",
    "--secondary": "168 85 247",
    "--accent-cyan": "6 182 212",
    "--accent-purple": "168 85 247",
    "--accent-pink": "236 72 153",
    "--accent-orange": "249 115 22",
    "--background": "11 15 25",
    "--surface": "17 24 39",
    "--text-primary": "255 255 255",
    "--text-secondary": "209 213 219",
    "--text-muted": "156 163 175",
  };
};
