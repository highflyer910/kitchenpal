import React, { createContext, useState, useContext, useEffect } from 'react';
import { createTheme } from '@mui/material/styles';
import theme1 from './theme1';
import theme2 from './theme2';
import theme3 from './theme3';
import theme4 from './theme4';
import theme5 from './theme5';

const themes = [theme1, theme2, theme3, theme4, theme5];
const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);

  useEffect(() => {
    const savedThemeIndex = localStorage.getItem('themeIndex');
    if (savedThemeIndex !== null) {
      setCurrentThemeIndex(parseInt(savedThemeIndex, 10));
    }
  }, []);

  const toggleTheme = () => {
    setCurrentThemeIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % themes.length;
      localStorage.setItem('themeIndex', newIndex.toString());
      return newIndex;
    });
  };

  const theme = React.useMemo(() => createTheme(themes[currentThemeIndex]), [currentThemeIndex]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};