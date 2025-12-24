// Design Tokens for AI Tarot Cards
// 新版 UI 设计系统的核心配置

export const colors = {
  background: {
    primary: '#140F2A',
    secondary: '#282446',
    tertiary: 'rgba(40, 36, 70, 0.8)',
  },
  purple: {
    50: 'rgba(168, 85, 247, 0.05)',
    100: 'rgba(168, 85, 247, 0.1)',
    200: 'rgba(168, 85, 247, 0.2)',
    300: 'rgba(168, 85, 247, 0.3)',
    500: '#A855F7',
  },
  text: {
    primary: '#E8E3FF',
    secondary: '#CDBFEE',
    tertiary: '#9B83C6',
    muted: '#8F88AB',
  },
  orange: {
    primary: '#DD8424',
    hover: '#c97520',
  },
  border: '#302545',
  white: {
    5: 'rgba(255, 255, 255, 0.05)',
    10: 'rgba(255, 255, 255, 0.1)',
    20: 'rgba(255, 255, 255, 0.2)',
    30: 'rgba(255, 255, 255, 0.3)',
    50: 'rgba(255, 255, 255, 0.5)',
    80: 'rgba(255, 255, 255, 0.8)',
  },
};

export const typography = {
  fontFamily: {
    base: "'Noto Serif SC', serif",
    heading: "'Almendra', serif",
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '20px',
    xl: '24px',
    '2xl': '32px',
  },
  fontWeight: {
    normal: 400,
    medium: 600,
    bold: 700,
    black: 900,
  },
  lineHeight: {
    tight: '14px',
    normal: '19px',
    relaxed: '24px',
    loose: '29px',
  },
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '48px',
};

export const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '100px', // For pill-shaped buttons
};
