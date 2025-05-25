import React from 'react';
import { CssBaseline, Container, ThemeProvider, createTheme } from '@mui/material';
import Calendar from './components/Calendar';
import EventModal from './components/EventModal';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Calendar />
        <EventModal />
      </Container>
    </ThemeProvider>
  );
}

export default App;
