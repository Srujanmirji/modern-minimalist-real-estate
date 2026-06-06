/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Theme variables mapping to CSS custom properties in index.css
        primary: "var(--color-primary)",
        "on-primary": "var(--color-on-primary)",
        "primary-container": "var(--color-primary-container)",
        "on-primary-container": "var(--color-on-primary-container)",
        
        secondary: "var(--color-secondary)",
        "on-secondary": "var(--color-on-secondary)",
        "secondary-container": "var(--color-secondary-container)",
        "on-secondary-container": "var(--color-on-secondary-container)",
        
        tertiary: "var(--color-tertiary)",
        "on-tertiary": "var(--color-on-tertiary)",
        "tertiary-container": "var(--color-tertiary-container)",
        "on-tertiary-container": "var(--color-on-tertiary-container)",
        
        background: "var(--color-background)",
        "on-background": "var(--color-on-background)",
        
        surface: "var(--color-surface)",
        "on-surface": "var(--color-on-surface)",
        "on-surface-variant": "var(--color-on-surface-variant)",
        
        "surface-dim": "var(--color-surface-dim)",
        "surface-bright": "var(--color-surface-bright)",
        
        "surface-container-lowest": "var(--color-surface-container-lowest)",
        "surface-container-low": "var(--color-surface-container-low)",
        "surface-container": "var(--color-surface-container)",
        "surface-container-high": "var(--color-surface-container-high)",
        "surface-container-highest": "var(--color-surface-container-highest)",
        
        outline: "var(--color-outline)",
        "outline-variant": "var(--color-outline-variant)",
        error: "var(--color-error)",
        "on-error": "var(--color-on-error)",
        "error-container": "var(--color-error-container)",
        "on-error-container": "var(--color-on-error-container)",
        
        // Custom branding (gold for land listing pages)
        gold: {
          light: "#ffdea8",
          dim: "#e6c183",
          DEFAULT: "#755a26",
          bright: "#c5a368",
        }
      },
      borderRadius: {
        DEFAULT: "var(--radius-default)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "9999px",
      },
      spacing: {
        gutter: "var(--spacing-gutter)",
        "container-max": "var(--spacing-container-max)",
        "margin-mobile": "var(--spacing-margin-mobile)",
        "margin-desktop": "var(--spacing-margin-desktop)",
        "stack-sm": "var(--spacing-stack-sm)",
        "stack-md": "var(--spacing-stack-md)",
        "stack-lg": "var(--spacing-stack-lg)",
      },
      fontFamily: {
        geist: ["Geist", "sans-serif"],
        bodoni: ["Bodoni Moda", "serif"],
        manrope: ["Manrope", "sans-serif"],
        // Font classes used in templates
        "headline-xl": ["Geist", "sans-serif"],
        "body-lg": ["Geist", "sans-serif"],
        "headline-lg-mobile": ["Geist", "sans-serif"],
        "body-md": ["Geist", "sans-serif"],
        "label-sm": ["Geist", "sans-serif"],
        "label-md": ["Geist", "sans-serif"],
        "headline-md": ["Geist", "sans-serif"],
        "headline-lg": ["Geist", "sans-serif"],
        "display-lg": ["Bodoni Moda", "serif"],
        "display-lg-mobile": ["Bodoni Moda", "serif"],
        "headline-sm": ["Bodoni Moda", "serif"],
        "label-caps": ["Manrope", "sans-serif"],
        "map-price-tag": ["Manrope", "sans-serif"],
      },
      fontSize: {
        "headline-xl": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "headline-lg-mobile": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-sm": ["12px", { lineHeight: "16px", fontWeight: "500" }],
        "label-md": ["14px", { lineHeight: "20px", letterSpacing: "0.05em", fontWeight: "500" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "600" }],
        
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "600" }],
        "display-lg-mobile": ["32px", { lineHeight: "40px", fontWeight: "600" }],
        "headline-sm": ["24px", { lineHeight: "32px", fontWeight: "500" }],
        "label-caps": ["12px", { lineHeight: "16px", letterSpacing: "0.1em", fontWeight: "700" }],
        "map-price-tag": ["14px", { lineHeight: "18px", fontWeight: "600" }],
      }
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
}
