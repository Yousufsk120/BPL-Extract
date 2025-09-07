import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import NewsAnalytics from './pages/NewsAnalytics';
import SocialMedia from './pages/SocialMedia';
import Predictions from './pages/Predictions';
import './App.css';

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
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/news" element={<NewsAnalytics />} />
            <Route path="/social" element={<SocialMedia />} />
            <Route path="/predictions" element={<Predictions />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;