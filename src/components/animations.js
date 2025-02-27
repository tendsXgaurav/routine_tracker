import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Animated Task Item
export const AnimatedTaskItem = ({ children, isActive, isCompleted }) => {
  return (
    <motion.div
      initial={{ opacity: 0.8 }}
      animate={{ 
        opacity: 1,
        backgroundColor: isActive ? '#EEF2FF' : isCompleted ? '#F9FAFB' : '#FFFFFF'
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

// Animated Reminder
export const AnimatedReminder = ({ children, show }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ overflow: 'hidden' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Animated Current Task Countdown
export const AnimatedCountdown = ({ timeLeft }) => {
  return (
    <motion.div
      key={timeLeft}
      initial={{ scale: 1.1, opacity: 0.7 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120 }}
    >
      {timeLeft}
    </motion.div>
  );
};

// Animated Task Completion Button
export const AnimatedCompletionButton = ({ isCompleted, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`mt-2 rounded-full p-1 ${
        isCompleted 
          ? "bg-green-100 text-green-600" 
          : "bg-indigo-100 text-indigo-600"
      }`}
    >
      <CheckCircle size={20} />
    </motion.button>
  );
};

// Import this in your file that uses these components
const { CheckCircle } = require('lucide-react');
