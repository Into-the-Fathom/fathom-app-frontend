import { CheckCircleIcon, ChevronDownIcon } from "@heroicons/react/outline";
import InfoIcon from "@mui/icons-material/Info";
import { SvgIcon, Theme, ThemeOptions } from "@mui/material";
import { createTheme } from "@mui/material/styles";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ColorPartial } from "@mui/material/styles/createPalette";
import React from "react";

const theme = createTheme();
const {
  typography: { pxToRem },
} = theme;

const FONT = "Inter, Arial";

declare module "@mui/material/styles/createPalette" {
  interface PaletteColor extends ColorPartial {}

  interface TypeText {
    muted: string;
  }

  interface TypeBackground {
    default: string;
    paper: string;
    surface: string;
    surface2: string;
    header: string;
    disabled: string;
  }

  interface Palette {
    gradients: {
      aaveGradient: string;
      newGradient: string;
      fathomGradient: string;
      fathomlightGradient: string;
    };
    other: {
      standardInputLine: string;
      fathomAccent: string;
      fathomAccentLight: string;
      fathomAccentMute: string;
      fathomLink: string;
    };
  }

  interface PaletteOptions {
    gradients: {
      aaveGradient: string;
      newGradient: string;
      fathomGradient: string;
      fathomlightGradient: string;
    };
  }
}

interface TypographyCustomVariants {
  display1: React.CSSProperties;
  subheader1: React.CSSProperties;
  subheader2: React.CSSProperties;
  description: React.CSSProperties;
  buttonL: React.CSSProperties;
  buttonM: React.CSSProperties;
  buttonS: React.CSSProperties;
  helperText: React.CSSProperties;
  tooltip: React.CSSProperties;
  main21: React.CSSProperties;
  secondary21: React.CSSProperties;
  main16: React.CSSProperties;
  secondary16: React.CSSProperties;
  main14: React.CSSProperties;
  secondary14: React.CSSProperties;
  main12: React.CSSProperties;
  secondary12: React.CSSProperties;
}

declare module "@mui/material/styles" {
  interface TypographyVariants extends TypographyCustomVariants {}

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions extends TypographyCustomVariants {}

  interface BreakpointOverrides {
    xsm: true;
    xxl: true;
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    display1: true;
    subheader1: true;
    subheader2: true;
    description: true;
    buttonL: true;
    buttonM: true;
    buttonS: true;
    helperText: true;
    tooltip: true;
    main21: true;
    secondary21: true;
    main16: true;
    secondary16: true;
    main14: true;
    secondary14: true;
    main12: true;
    secondary12: true;
    h5: false;
    h6: false;
    subtitle1: false;
    subtitle2: false;
    body1: false;
    body2: false;
    button: false;
    overline: false;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    surface: true;
    gradient: true;
  }
}

export const getDesignTokens = (mode: "light" | "dark") => {
  const getColor = (lightColor: string, darkColor: string) =>
    mode === "dark" ? darkColor : lightColor;

  return {
    breakpoints: {
      keys: ["xs", "xsm", "sm", "md", "lg", "xl", "xxl"],
      values: {
        xs: 0,
        xsm: 640,
        sm: 760,
        md: 960,
        lg: 1280,
        xl: 1575,
        xxl: 1800,
      },
    },
    palette: {
      mode,
      primary: {
        main: getColor("#1d2d49", "#fff"),
        light: getColor("#62677B", "#b0c5e7"),
        dark: getColor("#292E41", "#D2D4DC"),
      },
      secondary: {
        main: getColor("#FF607B", "#F48FB1"),
        light: getColor("#FF607B", "#F6A5C0"),
        dark: getColor("#B34356", "#AA647B"),
      },
      error: {
        main: getColor("#BC0000B8", "#F44336"),
        light: getColor("#D26666", "#E57373"),
        dark: getColor("#BC0000", "#D32F2F"),
        "100": getColor("#4F1919", "#FBB4AF"), // for alert text
        "200": getColor("#F9EBEB", "#2E0C0A"), // for alert background
      },
      warning: {
        main: getColor("#F89F1A", "#f7b06e"),
        light: getColor("#FFCE00", "#FFB74D"),
        dark: getColor("#C67F15", "#F57C00"),
        "100": getColor("#63400A", "#f7b06e"), // for alert text
        "200": getColor("#FEF5E8", "#452508"), // for alert background
        "300": getColor("#FEF5E8", "#5c310a"), // for alert border
      },
      info: {
        main: getColor("#0062D2", "#29B6F6"),
        light: getColor("#0062D2", "#4FC3F7"),
        dark: getColor("#002754", "#0288D1"),
        "100": getColor("#002754", "#A9E2FB"), // for alert text
        "200": getColor("#E5EFFB", "#071F2E"), // for alert background
      },
      success: {
        main: getColor("#4CAF50", "#4dcc33"),
        light: getColor("#90FF95", "#90FF95"),
        dark: getColor("#318435", "#388E3C"),
        "100": getColor("#1C4B1E", "#C2E4C3"), // for alert text
        "200": getColor("#ECF8ED", "#0A130B"), // for alert background
      },
      text: {
        primary: getColor("#303549", "#c5d7f2"),
        secondary: getColor("#62677B", "#6379a1"),
        disabled: getColor("#D2D4DC", "#62677B"),
        muted: getColor("#A5A8B6", "#5977a0"),
        highlight: getColor("#1d2d49", "#C9B3F9"),
      },
      background: {
        default: getColor("#F1F1F3", "#071028"),
        paper: getColor("#FFFFFF", "#131F35"),
        surface: getColor("#F7F7F9", "#1d2d49"),
        surface2: getColor("#F9F9FB", "#1d2d49"),
        header: getColor("#1d2d49", "#101d32"),
        disabled: getColor("#EAEBEF", "#EBEBEF14"),
      },
      divider: getColor("#EAEBEF", "#1D2D49"),
      action: {
        active: getColor("#8E92A3", "#EBEBEF8F"),
        hover: getColor("#F1F1F3", "#2a3e5a"),
        selected: getColor("#EAEBEF", "#2a3e5a"),
        disabled: getColor("#BBBECA", "#EBEBEF4D"),
        disabledBackground: getColor("#EAEBEF", "#EBEBEF1F"),
        focus: getColor("#F1F1F3", "#EBEBEF1F"),
      },
      other: {
        standardInputLine: getColor("#1d2d491F", "#EBEBEF6B"),
        fathomAccent: getColor("#1d2d491F", "#00FFF6"),
        fathomAccentLight: getColor("#1d2d491F", "#B3FFF9"),
        fathomAccentMute: getColor("#1d2d491F", "#2696a0"),
        fathomLink: getColor("#1d2d491F", "#5a81ff"),
      },
      gradients: {
        aaveGradient:
          "linear-gradient(104.04deg, rgb(179, 255, 249) 0%, rgb(0, 219, 203) 100%)",
        newGradient: "linear-gradient(79.67deg, #8C3EBC 0%, #007782 95.82%)",
        fathomGradient:
          "linear-gradient(rgb(7, 17, 38) 0%, rgb(5, 12, 26) 100%)",
        fathomlightGradient:
          "linear-gradient(104.04deg, rgb(179, 255, 249) 0%, rgb(0, 219, 203) 100%)",
      },
    },
    spacing: 4,
    typography: {
      fontFamily: FONT,
      h5: undefined,
      h6: undefined,
      subtitle1: undefined,
      subtitle2: undefined,
      body1: undefined,
      body2: undefined,
      button: undefined,
      overline: undefined,
      display1: {
        fontFamily: FONT,
        fontWeight: 700,
        letterSpacing: pxToRem(0.25),
        lineHeight: "123.5%",
        fontSize: pxToRem(32),
      },
      h1: {
        fontFamily: FONT,
        fontWeight: 700,
        letterSpacing: pxToRem(0.25),
        lineHeight: "123.5%",
        fontSize: pxToRem(28),
      },
      h2: {
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: "unset",
        lineHeight: "133.4%",
        fontSize: pxToRem(20),
      },
      h3: {
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: pxToRem(0.15),
        lineHeight: "160%",
        fontSize: pxToRem(18),
      },
      h4: {
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: pxToRem(0.15),
        lineHeight: pxToRem(24),
        fontSize: pxToRem(16),
      },
      subheader1: {
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: pxToRem(0.15),
        lineHeight: pxToRem(20),
        fontSize: pxToRem(14),
      },
      subheader2: {
        fontFamily: FONT,
        fontWeight: 500,
        letterSpacing: pxToRem(0.1),
        lineHeight: pxToRem(16),
        fontSize: pxToRem(12),
      },
      description: {
        fontFamily: FONT,
        fontWeight: 400,
        letterSpacing: pxToRem(0.15),
        lineHeight: "143%",
        fontSize: pxToRem(14),
      },
      caption: {
        fontFamily: FONT,
        fontWeight: 400,
        letterSpacing: pxToRem(0.15),
        lineHeight: pxToRem(16),
        fontSize: pxToRem(12),
      },
      buttonL: {
        fontFamily: FONT,
        fontWeight: 500,
        letterSpacing: pxToRem(0.46),
        lineHeight: pxToRem(24),
        fontSize: pxToRem(16),
      },
      buttonM: {
        fontFamily: FONT,
        fontWeight: 500,
        lineHeight: pxToRem(24),
        fontSize: pxToRem(14),
      },
      buttonS: {
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: pxToRem(0.46),
        lineHeight: pxToRem(20),
        textTransform: "uppercase",
        fontSize: pxToRem(10),
      },
      helperText: {
        fontFamily: FONT,
        fontWeight: 400,
        letterSpacing: pxToRem(0.4),
        lineHeight: pxToRem(12),
        fontSize: pxToRem(10),
      },
      tooltip: {
        fontFamily: FONT,
        fontWeight: 400,
        letterSpacing: pxToRem(0.15),
        lineHeight: pxToRem(16),
        fontSize: pxToRem(12),
      },
      main21: {
        fontFamily: FONT,
        fontWeight: 600,
        lineHeight: "133.4%",
        fontSize: pxToRem(21),
      },
      secondary21: {
        fontFamily: FONT,
        fontWeight: 500,
        lineHeight: "133.4%",
        fontSize: pxToRem(21),
      },
      main16: {
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: pxToRem(0.15),
        lineHeight: pxToRem(24),
        fontSize: pxToRem(16),
      },
      secondary16: {
        fontFamily: FONT,
        fontWeight: 500,
        letterSpacing: pxToRem(0.15),
        lineHeight: pxToRem(24),
        fontSize: pxToRem(16),
      },
      main14: {
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: pxToRem(0.15),
        lineHeight: pxToRem(20),
        fontSize: pxToRem(14),
      },
      secondary14: {
        fontFamily: FONT,
        fontWeight: 500,
        letterSpacing: pxToRem(0.15),
        lineHeight: pxToRem(20),
        fontSize: pxToRem(14),
      },
      main12: {
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: pxToRem(0.1),
        lineHeight: pxToRem(16),
        fontSize: pxToRem(12),
      },
      secondary12: {
        fontFamily: FONT,
        fontWeight: 500,
        letterSpacing: pxToRem(0.1),
        lineHeight: pxToRem(16),
        fontSize: pxToRem(12),
      },
    },
  } as ThemeOptions;
};

export function getThemedComponents(theme: Theme) {
  return {
    components: {
      MuiSkeleton: {
        styleOverrides: {
          root: {
            transform: "unset",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: "6px",
            borderColor: theme.palette.divider,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#CBCDD8",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#CBCDD8",
            },
          },
        },
      },
      MuiSlider: {
        styleOverrides: {
          root: {
            "& .MuiSlider-thumb": {
              color: theme.palette.mode === "light" ? "#62677B" : "#C9B3F9",
            },
            "& .MuiSlider-track": {
              color: theme.palette.mode === "light" ? "#1d2d49" : "#9C93B3",
            },
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: "8px",
          },
          sizeLarge: {
            ...theme.typography.buttonL,
            padding: "10px 24px",
          },
          sizeMedium: {
            ...theme.typography.buttonM,
            padding: "8px 12px",
            height: "32px",
          },
          sizeSmall: {
            ...theme.typography.buttonS,
            padding: "0 6px",
          },
        },
        variants: [
          {
            props: { variant: "surface" },
            style: {
              color: theme.palette.common.white,
              backgroundColor: "#253656",
              "&:hover, &.Mui-focusVisible": {
                backgroundColor: theme.palette.background.header,
              },
              "&:disabled": {
                color: theme.palette.action.disabled,
                background: "transparent",
                borderColor: theme.palette.action.disabled,
                cursor: "not-allowed",
                pointerEvents: "all",
              },
            },
          },
          {
            props: { variant: "gradient" },
            style: {
              color: theme.palette.common.black,
              background: theme.palette.gradients.fathomlightGradient,
              boxSizing: "border-box",
              border: "1px solid transparent",
              "&:hover, &.Mui-focusVisible": {
                background: "transparent",
                color: theme.palette.other.fathomAccentLight,
                border: "1px solid " + theme.palette.other.fathomAccentLight,
              },
              "&:disabled": {
                color: theme.palette.action.disabled,
                background: "transparent",
                borderColor: theme.palette.action.disabled,
                cursor: "not-allowed",
                pointerEvents: "all",
              },
            },
          },
          {
            props: { color: "primary", variant: "outlined" },
            style: {
              background: theme.palette.background.surface,
              borderColor: theme.palette.divider,
              "&:disabled": {
                color: theme.palette.action.disabled,
                background: "transparent",
                borderColor: theme.palette.action.disabled,
                cursor: "not-allowed",
                pointerEvents: "all",
              },
            },
          },
          {
            props: { variant: "outlined" },
            style: {
              color: theme.palette.other.fathomAccent,
              background: "transparent",
              border: "0.7px solid " + theme.palette.other.fathomAccent,
              "&:hover, &.Mui-focusVisible": {
                background: "transparent",
                color: theme.palette.other.fathomAccentLight,
                border: "1px solid " + theme.palette.other.fathomAccentLight,
              },
              "&:disabled": {
                color: theme.palette.action.disabled,
                background: "transparent",
                borderColor: theme.palette.action.disabled,
                cursor: "not-allowed",
                pointerEvents: "all",
              },
            },
          },
        ],
      },
      MuiTypography: {
        defaultProps: {
          variant: "description",
          variantMapping: {
            display1: "h1",
            h1: "h1",
            h2: "h2",
            h3: "h3",
            h4: "h4",
            subheader1: "p",
            subheader2: "p",
            caption: "p",
            description: "p",
            buttonL: "p",
            buttonM: "p",
            buttonS: "p",
            main12: "p",
            main14: "p",
            main16: "p",
            main21: "p",
            secondary12: "p",
            secondary14: "p",
            secondary16: "p",
            secondary21: "p",
            helperText: "span",
            tooltip: "span",
          },
        },
      },
      MuiLink: {
        defaultProps: {
          variant: "description",
        },
      },
      MuiMenu: {
        defaultProps: {
          PaperProps: {
            elevation: 0,
            variant: "outlined",
            style: {
              minWidth: 240,
              marginTop: "4px",
            },
          },
        },
      },
      MuiList: {
        styleOverrides: {
          root: {
            ".MuiMenuItem-root+.MuiDivider-root, .MuiDivider-root": {
              marginTop: "4px",
              marginBottom: "4px",
            },
          },
          padding: {
            paddingTop: "4px",
            paddingBottom: "4px",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            padding: "12px 16px",
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          root: {
            ...theme.typography.subheader1,
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            color: theme.palette.primary.light,
            minWidth: "unset !important",
            marginRight: "12px",
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            marginTop: 0,
            marginBottom: 0,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
          },
        },
        variants: [
          {
            props: { variant: "outlined" },
            style: {
              border: `1px solid ${theme.palette.divider}`,
              background: theme.palette.background.paper,
            },
          },
          {
            props: { variant: "elevation" },
            style: {
              boxShadow:
                "0px 2px 1px rgba(0, 0, 0, 0.05), 0px 0px 1px rgba(0, 0, 0, 0.25)",
              ...(theme.palette.mode === "dark"
                ? { backgroundImage: "none" }
                : {}),
            },
          },
        ],
      },
      MuiContainer: {
        styleOverrides: {
          root: {
            display: "flex",
            flexDirection: "column",
            flex: 1,
            paddingBottom: "39px",
            [theme.breakpoints.up("xs")]: {
              paddingLeft: "8px",
              paddingRight: "8px",
            },
            [theme.breakpoints.up("xsm")]: {
              paddingLeft: "20px",
              paddingRight: "20px",
            },
            [theme.breakpoints.up("sm")]: {
              paddingLeft: "48px",
              paddingRight: "48px",
            },
            [theme.breakpoints.up("md")]: {
              paddingLeft: "96px",
              paddingRight: "96px",
            },
            [theme.breakpoints.up("lg")]: {
              paddingLeft: "20px",
              paddingRight: "20px",
            },
            [theme.breakpoints.up("xl")]: {
              maxWidth: "unset",
              paddingLeft: "96px",
              paddingRight: "96px",
            },
            [theme.breakpoints.up("xxl")]: {
              paddingLeft: 0,
              paddingRight: 0,
              maxWidth: "1440px",
            },
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            "&.Mui-checked": {
              color: theme.palette.other.fathomAccent,
              "& + .MuiSwitch-track": {
                backgroundColor: theme.palette.other.fathomAccent,
                opacity: 0.5,
              },
            },
            "&.Mui-disabled": {
              opacity: theme.palette.mode === "dark" ? 0.3 : 0.7,
            },
          },
        },
      },
      MuiIcon: {
        variants: [
          {
            props: { fontSize: "large" },
            style: {
              fontSize: pxToRem(32),
            },
          },
        ],
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: theme.palette.divider,
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            boxShadow: "none",
            borderRadius: "8px",
            padding: "8px 16px",
            ...theme.typography.caption,
            alignItems: "flex-start",
            ".MuiAlert-message": {
              padding: 0,
              paddingTop: "2px",
              paddingBottom: "2px",
            },
            ".MuiAlert-icon": {
              padding: 0,
              opacity: 1,
              ".MuiSvgIcon-root": {
                fontSize: pxToRem(20),
              },
            },
            a: {
              ...theme.typography.caption,
              fontWeight: 500,
              textDecoration: "underline",
              "&:hover": {
                textDecoration: "none",
              },
            },
            ".MuiButton-text": {
              ...theme.typography.caption,
              fontWeight: 500,
              textDecoration: "underline",
              padding: 0,
              margin: 0,
              minWidth: "unset",
              "&:hover": {
                textDecoration: "none",
                background: "transparent",
              },
            },
          },
        },
        defaultProps: {
          iconMapping: {
            error: (
              <SvgIcon color="error">
                <InfoIcon />
              </SvgIcon>
            ),
            info: (
              <SvgIcon color="info">
                <InfoIcon />
              </SvgIcon>
            ),
            success: (
              <SvgIcon color="success">
                <CheckCircleIcon />
              </SvgIcon>
            ),
            warning: (
              <SvgIcon color="warning">
                <InfoIcon />
              </SvgIcon>
            ),
          },
        },
        variants: [
          {
            props: { severity: "error" },
            style: {
              color: "#ff8585",
              background: theme.palette.error["200"],
              border: "1px solid #5a0000",
              a: {
                color: theme.palette.error["100"],
              },
              ".MuiButton-text": {
                color: theme.palette.error["100"],
              },
            },
          },
          {
            props: { severity: "info" },
            style: {
              color: theme.palette.info["100"],
              background: theme.palette.info["200"],
              border: `1px solid ${theme.palette.divider}`,
              a: {
                color: theme.palette.info["100"],
              },
              ".MuiButton-text": {
                color: theme.palette.info["100"],
              },
            },
          },
          {
            props: { severity: "success" },
            style: {
              color: theme.palette.success["100"],
              background: theme.palette.success["200"],
              a: {
                color: theme.palette.success["100"],
              },
              ".MuiButton-text": {
                color: theme.palette.success["100"],
              },
            },
          },
          {
            props: { severity: "warning" },
            style: {
              color: theme.palette.warning["100"],
              background: theme.palette.warning["200"],
              border: "1px solid" + theme.palette.warning["300"],
              a: {
                textDecoration: "none",
                color: theme.palette.other.fathomLink,
                "&:hover": {
                  textDecoration: "underline",
                },
              },
              ".MuiButton-text": {
                color: theme.palette.warning["100"],
              },
            },
          },
        ],
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontFamily: FONT,
            fontWeight: 400,
            fontSize: pxToRem(14),
            minWidth: "375px",
            background:
              theme.palette.mode === "dark"
                ? theme.palette.gradients.fathomGradient
                : "",
            "> div:first-of-type": {
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
            },
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          colorPrimary: {
            color: theme.palette.primary.light,
          },
        },
      },
      MuiSelect: {
        defaultProps: {
          IconComponent: (props) => (
            <SvgIcon sx={{ fontSize: "16px" }} {...props}>
              <ChevronDownIcon />
            </SvgIcon>
          ),
        },
        styleOverrides: {
          outlined: {
            backgroundColor: theme.palette.background.surface,
            ...theme.typography.buttonM,
            padding: "6px 12px",
            color: theme.palette.primary.light,
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          bar1Indeterminate: {
            background: theme.palette.gradients.aaveGradient,
          },
          bar2Indeterminate: {
            background: theme.palette.gradients.aaveGradient,
          },
        },
      },
    },
  } as ThemeOptions;
}