import React, { createContext, useState, useContext, useEffect } from 'react';
import theme1 from './theme1';
import theme2 from './theme2';
import theme3 from './theme3';
import theme4 from './theme4';
import theme5 from './theme5';

const themes = [theme1, theme2, theme3, theme4, theme5];
const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [currentThemeIndex, setCurrentThemeIndex] = useState(() => {
    const savedThemeIndex = localStorage.getItem('themeIndex');
    return savedThemeIndex !== null ? parseInt(savedThemeIndex, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('themeIndex', currentThemeIndex.toString());
  }, [currentThemeIndex]);

  const toggleTheme = () => {
    setCurrentThemeIndex((prevIndex) => (prevIndex + 1) % themes.length);
  };

  return (
    <ThemeContext.Provider value={{ theme: themes[currentThemeIndex], toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const getThemeName = (theme) => {
  switch (theme) {
    case theme1: return 'Burgundy';
    case theme2: return 'Green';
    case theme3: return 'Orange';
    case theme4: return 'B&W';
    case theme5: return 'Dark';
    default: return 'Custom';
  }
};