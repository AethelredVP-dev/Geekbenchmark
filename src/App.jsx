import React, { useContext, useEffect, useState, useMemo } from 'react';
import Specs from './components/specs/Specs';

import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './assets/ui/theme';
import { CssBaseline, Button, Box, Typography } from '@mui/material';

import { Routes, Route, Navigate } from 'react-router-dom';
import { context } from './helpers/CONTEXT';
import BenchmarkContainer from './components/BenchmarkContainer';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Header from './containers/Header';
import ThemeButton from './layouts/ui/ThemeButton';

function App() {

  const [darkMode, setDarkMode] = useState(true);
  const [specs, setSpecs] = useState({
    "cpu": [],
    "gpu": [],
    "ram": [],
    "monitor": [],
    "motherboard": [],
    "Disk-Space": []
  });
  const [gamesData, setGamesData] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1);
  const [searchItem, setSearchItem] = useState('');


  const [filteredGames, setFilteredGames] = useState([]);




  return (
    <HelmetProvider>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <context.Provider value={{
          darkMode,
          setDarkMode,
          specs,
          setSpecs,
          report,
          setReport,
          setGamesData,
          gamesData,
          loading,
          setLoading,
          searchItem,
          setSearchItem,
          filteredGames,
          setFilteredGames,
          page,
          setPage
        }}>

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

        </context.Provider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;