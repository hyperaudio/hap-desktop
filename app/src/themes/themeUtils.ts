import { darken, lighten } from 'polished';

import MuiShadows from '@mui/material/styles/shadows';
import { Color, Palette, PaletteMode, Theme, Shadows } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { deepPurple, grey } from '@mui/material/colors';

import InterBold from '@/assets/fonts/Inter/Inter-Bold.woff2';
import InterItalic from '@/assets/fonts/Inter/Inter-Italic.woff2';
import InterMedium from '@/assets/fonts/Inter/Inter-Medium.woff2';
import InterRegular from '@/assets/fonts/Inter/Inter-Regular.woff2';

interface createMuiThemeProps {
  color?: Color;
  mode?: PaletteMode;
}

const t: Theme = createTheme();

export const createMuiTheme = (payload: createMuiThemeProps) => {
  const { mode = 'light', color = deepPurple } = payload;
  const isDark: boolean = mode === 'dark';

  /* Palette customisations */
  const p: Palette = createTheme({ palette: { mode: mode } }).palette;
  const palette: Palette = {
    ...p,
    background: {
      paper: isDark ? darken(0.025, grey[900]) : 'white',
      default: isDark ? lighten(0.025, grey[900]) : 'white',
    },
    primary: {
      ...p.primary,
      light: color[50],
      main: color[500],
      dark: color[600],
    },
    secondary: {
      ...p.secondary,
      light: deepPurple[50],
      main: deepPurple[500],
      dark: deepPurple[600],
    },
    text: {
      primary: isDark ? grey[200] : grey[800],
      secondary: isDark ? grey[500] : grey[700],
      disabled: isDark ? grey[600] : grey[500],
    },
    action: {
      ...p.action,
      activatedOpacity: 0.033,
      disabledOpacity: 0.38,
      focusOpacity: 0.12,
      hoverOpacity: 0.066,
      selectedOpacity: 0.11,
    },
  };

  /* Shadows customisations thanks to https://www.joshwcomeau.com/shadow-palette/ */
  const shadows: Shadows = MuiShadows.map((s, i) => {
    const proper = [
      'none',
      `0px 0.1px 0.2px hsl(0deg 0% 0% / 0),
    0px 0.3px 0.5px hsl(0deg 0% 0% / 0.02),
    0px 0.5px 0.8px hsl(0deg 0% 0% / 0.03),
    0px 0.9px 1.4px hsl(0deg 0% 0% / 0.05),
    0px 1.5px 2.3px hsl(0deg 0% 0% / 0.07)`,
      `0px 0.1px 0.2px hsl(0deg 0% 0% / 0),
    0px 0.5px 0.8px hsl(0deg 0% 0% / 0.01),
    0px 0.8px 1.2px hsl(0deg 0% 0% / 0.02),
    0px 1.1px 1.7px hsl(0deg 0% 0% / 0.02),
    0px 1.5px 2.3px hsl(0deg 0% 0% / 0.03),
    0px 1.9px 2.8px hsl(0deg 0% 0% / 0.04),
    0px 2.4px 3.6px hsl(0deg 0% 0% / 0.05),
    0px 3.1px 4.7px hsl(0deg 0% 0% / 0.05),
    0px 4px 6px hsl(0deg 0% 0% / 0.06),
    0px 5.1px 7.7px hsl(0deg 0% 0% / 0.07)`,
      `0px 0.6px 0.9px hsl(0deg 0% 0% / 0.01),
    0px 3.2px 4.6px -0.1px hsl(0deg 0% 0% / 0.02),
    0px 5.5px 7.8px -0.1px hsl(0deg 0% 0% / 0.03),
    0px 7.8px 11.1px -0.2px hsl(0deg 0% 0% / 0.04),
    0px 10.4px 14.8px -0.2px hsl(0deg 0% 0% / 0.05),
    0px 13.6px 19.4px -0.3px hsl(0deg 0% 0% / 0.06),
    0px 17.8px 25.4px -0.3px hsl(0deg 0% 0% / 0.06),
    0px 23.2px 33.1px -0.4px hsl(0deg 0% 0% / 0.07),
    -0.1px 30.2px 43px -0.4px hsl(0deg 0% 0% / 0.08),
    -0.1px 39.1px 55.7px -0.5px hsl(0deg 0% 0% / 0.09)`,
    ];
    return proper[i] || 'none';
  }) as Shadows;

  return createTheme({
    ...t,
    components: {
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true,
        },
        styleOverrides: {
          root: {
            cursor: 'default',
          },
        },
      },
      MuiBackdrop: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(3px)',
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
        },
      },
      MuiButton: {
        defaultProps: {
          variant: 'contained',
        },
        styleOverrides: {
          root: {
            padding: t.spacing(0.8, 1.5),
            boxShadow: shadows[isDark ? 1 : 1],
            color: palette.text.primary,
            background: isDark ? `rgba(255,255,255,${palette.action.activatedOpacity})` : darken(0.011, '#fff'),
            '&:hover': {
              boxShadow: shadows[isDark ? 1 : 1],
              color: palette.text.primary,
              background: isDark ? `rgba(255,255,255, ${palette.action.hoverOpacity})` : 'white',
            },
          },
          contained: {
            minWidth: '0',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            padding: t.spacing(2),
            background: palette.background.default,
          },
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
          body: {
            color: ${palette.text.primary};
            background-color: ${palette.background.paper};
          }
      `,
      },
      MuiDialog: {
        defaultProps: {
          PaperProps: {
            elevation: 2,
          },
        },
        styleOverrides: {
          paper: {
            boxShadow: shadows[2],
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            ...t.mixins.toolbar,
            ...t.typography.h6,
            alignItems: 'center',
            display: 'flex',
          },
        },
      },
      MuiIconButton: {
        defaultProps: {
          size: 'small',
        },
        styleOverrides: {
          root: {
            color: palette.text.primary,
            borderRadius: t.shape.borderRadius,
          },
          sizeSmall: {
            padding: t.spacing(0.5),
          },
          sizeMedium: {
            padding: t.spacing(0.25),
          },
          sizeLarge: {
            padding: t.spacing(0.25),
          },
        },
      },
      MuiMenu: {
        defaultProps: {
          PaperProps: {
            elevation: 2,
          },
        },
        styleOverrides: {
          paper: {
            borderRadius: t.shape.borderRadius,
          },
        },
      },
      MuiMenuItem: {},
      MuiPaper: {
        styleOverrides: {
          rounded: {
            borderRadius: t.shape.borderRadius * 2,
            backgroundImage: 'none',
          },
        },
      },
      MuiSvgIcon: {
        defaultProps: {
          fontSize: 'small',
        },
        styleOverrides: {
          fontSizeSmall: {
            fontSize: '1rem',
          },
          fontSizeLarge: {
            fontSize: '2rem',
          },
        },
      },
      MuiTooltip: {
        defaultProps: {
          enterDelay: 500,
          leaveDelay: 200,
        },
        styleOverrides: {
          tooltip: {
            background: palette.background.default,
            color: palette.text.primary,
          },
          tooltipArrow: {
            background: palette.background.default,
            color: palette.text.primary,
          },
          arrow: {
            '&:before': {
              background: palette.background.default,
            },
          },
        },
      },
    },
    palette,
    shadows,
    typography: {
      fontFamily: 'Inter, Helvetica, Arial, sans-serif',
      h1: {
        fontSize: t.typography.pxToRem(28),
        fontWeight: '700',
        lineHeight: '1.45em',
      },
      h2: {
        fontSize: t.typography.pxToRem(28),
        fontWeight: '400',
        lineHeight: '1.45em',
      },
      h3: {
        fontSize: t.typography.pxToRem(20),
        fontWeight: '700',
        lineHeight: '1.45em',
      },
      h4: {
        fontSize: t.typography.pxToRem(18),
        fontWeight: '700',
        lineHeight: '1.45em',
      },
      h6: {
        fontSize: t.typography.pxToRem(16),
        fontWeight: '700',
        lineHeight: '1.5em',
      },
      subtitle2: {
        fontSize: t.typography.pxToRem(14),
        fontWeight: '500',
        lineHeight: '1.571em',
      },
      body1: {
        fontSize: t.typography.pxToRem(15),
        fontWeight: '400',
        lineHeight: '1.571em',
      },
      body2: {
        fontSize: t.typography.pxToRem(13),
        fontWeight: '400',
        lineHeight: '1.571em',
      },
      button: {
        fontSize: t.typography.pxToRem(13),
        fontWeight: '500',
        lineHeight: '1.571em',
        textTransform: 'none',
      },
    },
  });
};
