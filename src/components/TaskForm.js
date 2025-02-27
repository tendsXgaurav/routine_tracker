import React, { useState } from 'react';
import { Plus, X, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const TaskForm = ({ onAddTask, onClose, lastTaskId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [errors, setErrors] = useState({});
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!startTime) {
      newErrors.startTime = 'Start time is required';
    }
    
    if (!endTime) {
      newErrors.endTime = 'End time is required';
    }
    
    if (startTime && endTime) {
      // Convert to minutes for comparison
      const startMinutes = convertTimeToMinutes(startTime);
      const endMinutes = convertTimeToMinutes(endTime);
      
      if (endMinutes <= startMinutes) {
        newErrors.endTime = 'End time must be after start time';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const convertTimeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const newTask = {
      id: lastTaskId + 1,
      title: title.trim(),
      description: description.trim(),
      start: startTime,
      end: endTime
    };
    
    onAddTask(newTask);
    onClose();
  };
  
  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="w-full max-w-md bg-white dark:bg-[#222244] rounded-3xl overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-700/20 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Add New Task</h2>
          <motion.button 
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700/30 text-slate-500 dark:text-slate-400"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={18} />
          </motion.button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Task Title*
            </label>
            <input
              type="text"
              className={`modern-input ${errors.title ? 'border-red-500 dark:border-red-500' : ''}`}
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && (
              <motion.p 
                className="mt-1 text-sm text-red-500 flex items-center"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle size={14} className="mr-1" /> {errors.title}
              </motion.p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Description
            </label>
            <textarea
              className="modern-input min-h-[100px]"
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Start Time*
              </label>
              <div className="relative">
                <Clock size={16} className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500" />
                <input
                  type="time"
                  className={`modern-input pl-10 ${errors.startTime ? 'border-red-500 dark:border-red-500' : ''}`}
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
                {errors.startTime && (
                  <motion.p 
                    className="mt-1 text-sm text-red-500 flex items-center"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertCircle size={14} className="mr-1" /> {errors.startTime}
                  </motion.p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                End Time*
              </label>
              <div className="relative">
                <Clock size={16} className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500" />
                <input
                  type="time"
                  className={`modern-input pl-10 ${errors.endTime ? 'border-red-500 dark:border-red-500' : ''}`}
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
                {errors.endTime && (
                  <motion.p 
                    className="mt-1 text-sm text-red-500 flex items-center"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertCircle size={14} className="mr-1" /> {errors.endTime}
                  </motion.p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t dark:border-gray-700">
            <motion.button
              type="button"
              className="btn border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="btn btn-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus size={18} className="mr-1" />
              Add Task
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default TaskForm;
