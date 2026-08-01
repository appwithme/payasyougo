// ============================================================
// THEME / COLORS - Central design tokens for PayAsYouGo
// Fintech-inspired light theme: Yellow, White, Dark Gray
// ============================================================

export const COLORS = {
  // Primary brand palette (Yellow)
  primary:      '#FFC700', // Vibrant Yellow
  primaryDark:  '#E6B300',
  primaryLight: '#FFD640',

  // Accent
  accent:       '#111827', // Almost black for high contrast elements

  // Success / error / warning
  success:      '#10B981',
  successLight: '#D1FAE5',
  error:        '#EF4444',
  errorLight:   '#FEE2E2',
  warning:      '#F59E0B',

  // Background layers (Light-first fintech look)
  background:   '#F8F9FA', // Off-white for the main app background
  surface:      '#FFFFFF', // Pure white for cards
  surfaceAlt:   '#F3F4F6', // Light gray for inputs/hover states
  border:       '#E5E7EB', // Subtle borders

  // Text
  textPrimary:   '#111827', // Near Black for headings
  textSecondary: '#4B5563', // Dark Gray for body
  textMuted:     '#9CA3AF', // Medium Gray for hints/icons

  // Overlay / glass
  glass:         'rgba(255,255,255,0.7)',
  glassBorder:   'rgba(255,255,255,0.3)',

  white:  '#FFFFFF',
  black:  '#000000',
};

export const FONT_SIZE = {
  xs:   12,
  sm:   14,
  base: 16,
  md:   18,
  lg:   20,
  xl:   24,
  xxl:  32,
  hero: 40,
};

export const SPACING = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

export const RADIUS = {
  sm:  8,
  md:  12,
  lg:  20, // More rounded for modern feel
  xl:  28,
  full: 999,
};

// Reusable soft, subtle shadows (fintech style)
export const SHADOW = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
};
