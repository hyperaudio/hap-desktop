import { Color, PaletteMode } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { deepPurple } from '@mui/material/colors';

import InterBold from '@/assets/fonts/Inter/Inter-Bold.woff2';
import InterItalic from '@/assets/fonts/Inter/Inter-Italic.woff2';
import InterMedium from '@/assets/fonts/Inter/Inter-Medium.woff2';
import InterRegular from '@/assets/fonts/Inter/Inter-Regular.woff2';

interface createMuiThemeProps {
  color?: Color;
  mode?: PaletteMode;
}

const rootTheme = createTheme({});

export const createMuiTheme = (payload: createMuiThemeProps) => {
  const { mode = 'light', color = deepPurple } = payload;
  return createTheme({
    ...rootTheme,
    components: {
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true,
        },
      },
      MuiCssBaseline: {
        styleOverrides: `
          @font-face {
            font-display: swap;
            font-family: 'Inter';
            font-style: normal;
            font-weight: 400;
            src: local('Inter'), local('Inter-Medium'), url(${InterRegular}) format('woff2');
          }
          @font-face {
            font-display: swap;
            font-family: 'Inter';
            font-style: italic;
            font-weight: 400;
            src: local('Inter'), local('Inter-Italic'), url(${InterItalic}) format('woff2');
          }
          @font-face {
            font-display: swap;
            font-family: 'Inter';
            font-style: normal;
            font-weight: 500;
            src: local('Inter'), local('Inter-Medium'), url(${InterMedium}) format('woff2');
          }
          @font-face {
            font-display: swap;
            font-family: 'Inter';
            font-style: normal;
            font-weight: 700;
            src: local('Inter'), local('Inter-Bold'), url(${InterBold}) format('woff2');
          }
      `,
      },
      MuiBackdrop: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(3px)',
            backgroundColor: 'rgba(0,0,0,0.4)',
          },
        },
      },
      MuiIconButton: {
        defaultProps: {
          size: 'small',
        },
      },
      MuiPaper: {
        styleOverrides: {
          rounded: {
            borderRadius: rootTheme.shape.borderRadius * 2,
          },
        },
      },
      MuiSvgIcon: {
        defaultProps: {
          fontSize: 'small',
        },
      },
    },
    palette: {
      mode,
      primary: color,
    },
    typography: {
      fontFamily: 'Inter, Helvetica, Arial, sans-serif',
      h1: {
        fontSize: rootTheme.typography.pxToRem(28),
        fontWeight: '700',
        lineHeight: '1.45em',
      },
      h2: {
        fontSize: rootTheme.typography.pxToRem(28),
        fontWeight: '400',
        lineHeight: '1.45em',
      },
      h3: {
        fontSize: rootTheme.typography.pxToRem(20),
        fontWeight: '700',
        lineHeight: '1.45em',
      },
      h4: {
        fontSize: rootTheme.typography.pxToRem(18),
        fontWeight: '700',
        lineHeight: '1.45em',
      },
      h6: {
        fontSize: rootTheme.typography.pxToRem(16),
        fontWeight: '700',
        lineHeight: '1.5em',
      },
      subtitle2: {
        fontSize: rootTheme.typography.pxToRem(14),
        fontWeight: '500',
        lineHeight: '1.571em',
      },
      body1: {
        fontSize: rootTheme.typography.pxToRem(16),
        fontWeight: '400',
        lineHeight: '1.571em',
      },
      body2: {
        fontSize: rootTheme.typography.pxToRem(14),
        fontWeight: '400',
        lineHeight: '1.571em',
      },
      button: {
        fontSize: rootTheme.typography.pxToRem(16),
        fontWeight: '500',
        lineHeight: '1.571em',
      },
    },
  });
};
