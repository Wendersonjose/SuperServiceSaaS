export const theme = {
  colors: {
    primary: '#2563EB',
    primaryLight: '#3B82F6',
    primaryDark: '#1D4ED8',
    secondary: '#10B981',
    accent: '#F97316',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    background: '#F8FAFC',
    card: '#FFFFFF',
    sidebar: '#0F172A',
    text: '#1E293B',
    textLight: '#64748B',
    border: '#E2E8F0',
    inputBg: '#F1F5F9',
    inputBorder: '#CBD5E1',
  },
  sizes: {
    headerHeight: '64px',
    sidebarWidth: '250px',
    sidebarCollapsedWidth: '80px',
  },
  breakpoints: {
    xs: '0px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1400px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  transitions: {
    default: '0.3s ease',
    fast: '0.15s ease',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
};

export type ThemeType = typeof theme;