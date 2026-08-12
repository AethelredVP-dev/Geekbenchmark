import Specs from './components/specs/Specs';

import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './assets/ui/theme';
import { CssBaseline, Button, Box, Typography } from '@mui/material';

import { Routes, Route, Navigate } from 'react-router-dom';
import BenchmarkContainer from './components/BenchmarkContainer';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Header from './containers/Header';
import ThemeButton from './layouts/ui/ThemeButton';
import { useSelector } from 'react-redux';

function App() {
  const darkMode = useSelector(state => state.benchmark.darkMode);
  return (
    <HelmetProvider>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />


        <Helmet>
          <title>Geek Benchmarker</title>
        </Helmet>

        <Box
          sx={{
            transition: 'all 0.5s ease',
            minHeight: '100vh',
            p: { xs: 2, md: 4 },
            bgcolor: 'background.default',
            color: 'text.primary'
          }}
        >

          <ThemeButton />
          <Header />

          <Routes>
            <Route path='/' element={<Specs />} />
            <Route path='/benchmark' element={<BenchmarkContainer />} />
          </Routes>

        </Box>

      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;