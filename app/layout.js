'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'; 
import './globals.css';
import { Analytics } from "@vercel/analytics/react"


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
