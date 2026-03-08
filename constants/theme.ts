// ─── Brand Colors ────────────────────────────────────────────────────────────
const BRAND_TINT = '#2563EB'; // blue-600

// ─── Theme Palettes ──────────────────────────────────────────────────────────
export const Colors = {
  light: {
    text: '#11181C',
    background: '#FFFFFF',
    surface: '#F4F4F5',
    border: '#E4E4E7',
    tint: BRAND_TINT,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: BRAND_TINT,
    success: '#16A34A',
    warning: '#D97706',
    danger: '#DC2626',
  },
  dark: {
    text: '#ECEDEE',
    background: '#09090B',
    surface: '#18181B',
    border: '#27272A',
    tint: BRAND_TINT,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: BRAND_TINT,
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
  },
} as const;

export type ColorScheme = keyof typeof Colors;
export type ThemeColors = (typeof Colors)[ColorScheme];
