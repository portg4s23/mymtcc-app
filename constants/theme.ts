/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    // Base
    text: '#11181C',
    textSecondary: '#687076',
    textTertiary: '#91959B',
    background: '#FFFFFF',
    backgroundSecondary: '#F5F5F5',
    backgroundTertiary: '#E5E7EB',
    surface: '#FFFFFF',
    border: '#E5E7EB',

    // Brand (Ant Design Blue)
    primary: '#1677FF',
    primaryHover: '#4096FF',
    primaryActive: '#0958D9',
    tint: '#1677FF',

    // Icons
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#1677FF',

    // Status colors
    success: '#52C41A',
    warning: '#FAAD14',
    error: '#FF4D4F',
    info: '#1677FF',

    // Background helpers
    hover: '#F0F5FF',
    disabledBg: '#F5F5F5',
    disabledText: '#BFBFBF',
  },

  dark: {
    // Base
    text: '#F1F1F1',
    textSecondary: '#B4B7BC',
    textTertiary: '#91959B',
    background: '#000000',
    backgroundSecondary: '#0A0A0B',
    backgroundTertiary: '#1E1F21',
    surface: '#0B0F1A',
    border: '#1F2633',

    // Brand
    primary: '#2664EB',
    primaryHover: '#5C8BF0',
    primaryActive: '#1147BB',
    tint: '#1677FF',

    // Icons
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#1677FF',

    // Status colors
    success: '#49D17D',
    warning: '#FADB14',
    error: '#FF4D4F',
    info: '#1677FF',

    // Background helpers
    hover: '#111A2C',
    disabledBg: '#1A1F2E',
    disabledText: '#565d69',
  },
};

// create type from Colors
export type ThemeType = typeof Colors.light;

// tinted colors for backgrounds and borders
export const tintedColors = {
  primary: {
    fg: "##264CB8",
    bg: "rgba(30, 58, 138, 0.2)",
    border: "rgba(38, 76, 184, 0.4)",
  },

  success: {
    fg: "#34D399",
    bg: "rgba(16, 185, 129, 0.1)",
    border: "rgba(16, 185, 129, 0.4)",
  },

  warning: {
    fg: "#F59E0B",
    bg: "rgba(245, 158, 11, 0.1)",
    border: "rgba(245, 158, 11, 0.3)",
  },

  danger: {
    fg: "#EF4444",
    bg: "rgba(239, 68, 68, 0.1)",
    border: "rgba(239, 68, 68, 0.4)",
  },

  info: {
    fg: "#06B6D4",
    bg: "rgba(6, 182, 212, 0.05)",
    border: "rgba(6, 182, 212, 0.4)",
  },

  purple: {
    fg: "#8B5CF6",
    bg: "rgba(139, 92, 246, 0.1)",
    border: "rgba(139, 92, 246, 0.4)",
  },

  neutral: {
    fg: "#B5B5B5",
    bg: "rgba(219, 234, 254, 0.1)",
    border: "rgba(219, 234, 254, 0.4)",
  },
} as const;

export type TintedColorType = keyof typeof tintedColors;

export const getTintColors = (variant: TintedColorType) => {
  return tintedColors[variant];
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
