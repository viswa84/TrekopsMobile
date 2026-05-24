/**
 * TrekOps Mobile — Design Tokens
 * Mirrors the web's @theme tokens so both apps look like siblings.
 * Brand: Emerald primary, Slate neutrals.
 */
import { Platform } from 'react-native';

export const palette = {
  primary: {
    50:  '#ECFDF5', 100: '#D1FAE5', 200: '#A7F3D0', 300: '#6EE7B7',
    400: '#34D399', 500: '#10B981', 600: '#059669', 700: '#047857',
    800: '#065F46', 900: '#064E3B', 950: '#022C22',
  },
  slate: {
    50:  '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0', 300: '#CBD5E1',
    400: '#94A3B8', 500: '#64748B', 600: '#475569', 700: '#334155',
    800: '#1E293B', 900: '#0F172A', 950: '#020617',
  },
  red:    { 50: '#FEF2F2', 100: '#FEE2E2', 200: '#FECACA', 500: '#EF4444', 600: '#DC2626', 700: '#B91C1C' },
  amber:  { 50: '#FFFBEB', 100: '#FEF3C7', 200: '#FDE68A', 500: '#F59E0B', 600: '#D97706', 700: '#B45309' },
  blue:   { 50: '#EFF6FF', 100: '#DBEAFE', 200: '#BFDBFE', 500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8' },
  orange: { 50: '#FFF7ED', 100: '#FFEDD5', 500: '#F97316', 600: '#EA580C', 700: '#C2410C' },
  purple: { 50: '#FAF5FF', 100: '#F3E8FF', 500: '#A855F7', 600: '#9333EA', 700: '#7E22CE' },
  cyan:   { 50: '#ECFEFF', 100: '#CFFAFE', 500: '#06B6D4', 600: '#0891B2', 700: '#0E7490' },
  rose:   { 50: '#FFF1F2', 100: '#FFE4E6', 500: '#F43F5E', 600: '#E11D48' },
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const colors = {
  bg: palette.slate[50],
  bgElevated: palette.white,
  bgMuted: palette.slate[100],
  bgDark: palette.slate[900],
  border: palette.slate[200],
  borderStrong: palette.slate[300],
  borderMuted: palette.slate[100],
  text: palette.slate[900],
  textStrong: palette.slate[950],
  textMuted: palette.slate[600],
  textSubtle: palette.slate[500],
  textDisabled: palette.slate[400],
  textInverse: palette.white,
  primary: palette.primary[600],
  primaryHover: palette.primary[700],
  primarySoft: palette.primary[50],
  primaryBorder: palette.primary[200],
  primaryText: palette.primary[700],
  success: palette.primary[600],
  successSoft: palette.primary[50],
  successText: palette.primary[700],
  danger: palette.red[600],
  dangerSoft: palette.red[50],
  dangerText: palette.red[700],
  warning: palette.amber[500],
  warningSoft: palette.amber[50],
  warningText: palette.amber[700],
  info: palette.blue[600],
  infoSoft: palette.blue[50],
  infoText: palette.blue[700],
  overlay: 'rgba(15, 23, 42, 0.5)',
};

export const spacing = {
  0: 0, 0.5: 2, 1: 4, 1.5: 6, 2: 8, 2.5: 10, 3: 12, 4: 16, 5: 20,
  6: 24, 7: 28, 8: 32, 10: 40, 12: 48, 16: 64, 20: 80, 24: 96,
};

export const radius = {
  none: 0, xs: 4, sm: 6, md: 8, lg: 12, xl: 16, '2xl': 20, '3xl': 24, full: 9999,
};

export const typography = {
  size: { '2xs': 10, xs: 11, sm: 12, base: 14, md: 15, lg: 16, xl: 18, '2xl': 20, '3xl': 24, '4xl': 28, '5xl': 32, '6xl': 40 },
  weight: { normal: '400', medium: '500', semibold: '600', bold: '700', extrabold: '800' },
  lineHeight: { tight: 1.2, snug: 1.35, normal: 1.5, relaxed: 1.65 },
};

export const shadow = {
  none: {},
  xs: Platform.select({ ios: { shadowColor: '#0F172A', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 2 }, android: { elevation: 1 } }),
  sm: Platform.select({ ios: { shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4 }, android: { elevation: 2 } }),
  md: Platform.select({ ios: { shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8 }, android: { elevation: 4 } }),
  lg: Platform.select({ ios: { shadowColor: '#0F172A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.10, shadowRadius: 16 }, android: { elevation: 8 } }),
};

export const statusColors = {
  paid:      { bg: palette.primary[50], text: palette.primary[700], border: palette.primary[200] },
  pending:   { bg: palette.amber[50],   text: palette.amber[700],   border: palette.amber[200] },
  partial:   { bg: palette.blue[50],    text: palette.blue[700],    border: palette.blue[200] },
  failed:    { bg: palette.red[50],     text: palette.red[700],     border: palette.red[200] },
  cancelled: { bg: palette.red[50],     text: palette.red[700],     border: palette.red[200] },
  Open:      { bg: palette.primary[50], text: palette.primary[700], border: palette.primary[200] },
  'Almost Full': { bg: palette.amber[50], text: palette.amber[700], border: palette.amber[200] },
  Full:      { bg: palette.red[50],     text: palette.red[700],     border: palette.red[200] },
  Canceled:  { bg: palette.slate[100],  text: palette.slate[600],   border: palette.slate[200] },
};

export const difficultyColors = {
  Easy:     { bg: palette.primary[50], text: palette.primary[700], dot: palette.primary[500] },
  Moderate: { bg: palette.amber[50],   text: palette.amber[700],   dot: palette.amber[500] },
  Hard:     { bg: palette.orange[50],  text: palette.orange[700],  dot: palette.orange[500] },
  Extreme:  { bg: palette.red[50],     text: palette.red[700],     dot: palette.red[500] },
};

export const layout = {
  screenPadding: 16,
  cardPadding: 16,
  sectionGap: 20,
  tabBarHeight: 64,
  headerHeight: 56,
};

const theme = { palette, colors, spacing, radius, typography, shadow, statusColors, difficultyColors, layout };
export default theme;
