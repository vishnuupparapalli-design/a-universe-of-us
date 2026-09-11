/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Elsewhere Universe Palette
        elsewhere: {
          void: '#06080e',        // Deepest backdrop space
          deep: '#0a0f1d',        // Night sky base
          surface: '#12192b',     // Clay card base
          surfaceLight: '#1a233a',// Raised clay elements
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(255, 255, 255, 0.18)',
          
          // Emotional Chapter Accents
          star: '#a5b4fc',        // The Beginning violet-blue
          projector: '#fcd34d',   // Movie Corner warm light
          book: '#d97706',        // Our Stories desk amber
          cloud: '#fef08a',       // 201 Days cream-gold
          thread: '#38bdf8',      // Distance luminous thread
          dawn: '#fda4af',        // Someday rose-peach
          
          // Reserved Accent
          // NOTE: As per Master Plan Section Y, muted gold is strictly reserved 
          // for special moments: 201 Days headline, the final letter, and the first star.
          gold: '#dfb76c',
          goldMuted: '#967d46',

          // Typography Shades
          textPrimary: '#f8fafc',
          textSecondary: '#94a3b8',
          textMuted: '#64748b',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        // Tactile claymorphic shadows (matte, soft, deep)
        'clay-card': '0 10px 30px -10px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
        'clay-btn': '0 4px 14px 0 rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        'glow-star': '0 0 25px rgba(165, 180, 252, 0.35)',
        'glow-gold': '0 0 30px rgba(223, 183, 108, 0.3)',
      }
    },
  },
  plugins: [],
}