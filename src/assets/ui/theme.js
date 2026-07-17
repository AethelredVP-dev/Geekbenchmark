import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#D4AF37",
      light: "#F3E5AB",
      dark: "#AA7C11",
      contrastText: "#121212",
    },
    background: {
      default: "#FAFAFA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A1A1A",
      secondary: "#666666",
    },
    success: {
      main: "#2e7d32",
    },
  },
  typography: {
    fontFamily: "inherit",
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          border: "1px solid rgba(212, 175, 55, 0.15)",
          boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#D4AF37",
      light: "#F3E5AB",
      dark: "#AA7C11",
      contrastText: "#121212",
    },
    background: {
      default: "#121212",
      paper: "#1A1A1A",
    },
    text: {
      primary: "#F5F5F5",
      secondary: "#B0B0B0",
    },
    success: {
      main: "#4caf50",
    },
    warning: {
      main: "#ec6911c7",
    },
  },
  typography: {
    fontFamily: "inherit",
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          backgroundColor: "#1E1E1E",
          border: "1px solid rgba(212, 175, 55, 0.2)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.4)",
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1A1A1A",
          border: "1px solid rgba(212, 175, 55, 0.3)",
        },
      },
    },
  },
});
