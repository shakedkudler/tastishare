import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#A74458', // בורדו-ורוד (לכפתורים, לינקים, highlights)
      contrastText: '#fff',
    },
    secondary: {
      main: '#1F1209', // טקסט כהה
    },
    background: {
      default: '#E2CADE', // רקע כללי בהיר
      paper: '#fff',      // רקע של כרטיסים (Paper)
    },
    error: {
      main: '#662924',    // חום אדמדם (לאדום/שגיאות)
    },
    text: {
      primary: '#1F1209', // טקסט כהה
      secondary: '#662924', // טקסט פחות חשוב/placeholder
    },
    info: {
      main: '#C686A6', // אפשר להשתמש באותו צבע כמו primary,
      contrastText: '#fff',
    }
    // אם תרצי, אפשר גם להוסיף info, warning, success וכו'
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 700,
        },
      },
    },
  },
  typography: {
    fontFamily: 'Rubik, Assistant, Arial, sans-serif',
    h1: { fontSize: 32, fontWeight: 800 },
    h2: { fontSize: 24, fontWeight: 700 },
    h3: { fontSize: 20, fontWeight: 700 },
    h4: { fontSize: 18, fontWeight: 700 },
    button: { textTransform: 'none' },
  },
});

export default theme;
