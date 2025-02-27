import React from 'react';
import RoutineTracker from './components/RoutineTracker';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import './App.css';

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  
  return (
    <motion.button
      className="fixed top-4 right-4 p-3 rounded-full shadow-md z-10 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
      onClick={toggleDarkMode}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
    </motion.button>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen transition-colors duration-200 bg-gray-50 dark:bg-gray-900">
        <ThemeToggle />
        <RoutineTracker />
      </div>
    </ThemeProvider>
  );
};

export default App;
