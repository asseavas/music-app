import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
    },
  },
});

theme.palette.background.default = '#000';

export default theme;
