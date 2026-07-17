import React, { useContext, useEffect, useState } from 'react';
import Specs from './components/Specs';
import TextType from './Effects/TextType';
import ShinyText from './Effects/ShinyText';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './assets/ui/theme';
import { CssBaseline, Button, Box, Typography } from '@mui/material';
import { CiDark } from "react-icons/ci";
import { MdOutlineLightMode } from "react-icons/md";
import { Routes, Route, Navigate } from 'react-router-dom';
import { context } from './helpers/CONTEXT';
import Benchmark from './components/Benchmark';

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


  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <context.Provider value={{ darkMode, setDarkMode, specs, setSpecs, report, setReport, setGamesData, gamesData, loading, setLoading }}>
        <Box
          sx={{
            transition: 'all 0.5s ease',
            minHeight: '100vh',
            p: { xs: 2, md: 4 },
            bgcolor: 'background.default',
            color: 'text.primary'
          }}
        >
          <Box sx={{ maxWidth: '1200px', margin: '0 auto' }}>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setDarkMode(!darkMode)}
                sx={{ minWidth: '48px', height: '48px' }}
              >
                {darkMode ? <MdOutlineLightMode size={20} /> : <CiDark size={20} />}
              </Button>
            </Box>

            <Box sx={{ fontSize: "2rem", textAlign: "center", mb: 4 }}>
              <ShinyText
                text="Geek Benchmarker"
                speed={2}
                delay={0}
                color="#D4AF37"
                shineColor={darkMode ? " #FAFAFA" : "#1A1A1A"}
                spread={120}
                direction="left"
                yoyo={true}
                pauseOnHover={false}
                disabled={false}
              />
              <hr style={{ borderColor: 'rgba(212, 175, 55, 0.2)', margin: '16px 0' }} />
              <TextType
                text={["From Developers To Gamers"]}
                typingSpeed={50}
                pauseDuration={2000}
                showCursor
                cursorCharacter="▎"
                deletingSpeed={50}
                variableSpeedEnabled={false}
                variableSpeedMin={60}
                variableSpeedMax={120}
                cursorBlinkDuration={0.5}
              />
            </Box>

            <Routes>
              <Route path='/' element={<Specs />} />
              <Route path='/benchmark' element={<Benchmark />} />
            </Routes>

          </Box>
        </Box>
      </context.Provider>
    </ThemeProvider>
  );
}

export default App;