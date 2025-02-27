import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, Clock, AlertTriangle, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskForm from './TaskForm';

const RoutineTracker = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTask, setActiveTask] = useState(null);
  const [upcomingTask, setUpcomingTask] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showReminder, setShowReminder] = useState(false);
  const [reminderTask, setReminderTask] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [view, setView] = useState('day'); // 'day' or 'tasks'
  
  // Initial routine tasks stored in state so we can add new ones
  const [routineTasks, setRoutineTasks] = useState([
    { id: 1, start: '05:45', end: '06:15', title: 'Morning Run & Rest', description: 'Go for a run outside, return to room, rest for 10 mins, drink water' },
    { id: 2, start: '06:15', end: '06:30', title: 'AI News', description: 'Explore news related to AI (Top crucial which teach something everyday)' },
    { id: 3, start: '06:30', end: '07:30', title: 'Unreal Engine', description: 'Work on Unreal Engine with 5 min break' },
    { id: 4, start: '07:45', end: '08:10', title: 'Breakfast', description: 'Do breakfast' },
    { id: 5, start: '08:15', end: '10:30', title: 'LeetCode Problems', description: 'Solve LeetCode problems for 2 hours with 6 min break after 60 min interval, then 15 min rest' },
    { id: 6, start: '10:30', end: '10:40', title: 'Watch Reels', description: 'Watch reels, end with energetic song to restart' },
    { id: 7, start: '10:45', end: '10:55', title: 'KindNest Planning', description: 'Think about new implementations for KindNest, write in special notebook' },
    { id: 8, start: '11:00', end: '12:30', title: 'Learn Web Dev', description: 'Learn prerequisites (HTML, CSS, JavaScript, React.js)' },
    { id: 9, start: '12:30', end: '13:00', title: 'Lunch Break', description: 'Do your lunch if possible, then take break' },
    { id: 10, start: '13:00', end: '15:00', title: 'LeetCode Session', description: 'Work on LeetCode for 2 hrs with 6 min break at 60 min interval' },
    { id: 11, start: '15:00', end: '15:15', title: 'Music Break', description: 'Take some break, watch music videos' },
    { id: 12, start: '15:16', end: '16:16', title: 'Unreal Engine', description: 'Learn Unreal Engine again' },
    { id: 13, start: '16:16', end: '16:30', title: 'Relaxation', description: 'Take break of 13-14 min, close your eyes and relax' },
    { id: 14, start: '16:30', end: '17:15', title: 'Web Dev Learning', description: 'Learn another 45 min of prerequisites' },
    { id: 15, start: '17:15', end: '18:00', title: 'Tea/Snack Break', description: 'Instead of gym (until Feb 15), eat something or drink tea, call, enjoy' },
    { id: 16, start: '18:06', end: '20:06', title: 'LeetCode Session', description: 'Another 2 hrs session of LeetCode with 6 min break per 60 min interval' },
    { id: 17, start: '20:15', end: '20:45', title: 'Dinner', description: 'Do your dinner' },
    { id: 18, start: '20:45', end: '21:00', title: 'Relaxation', description: 'Take another break of 10 min, relax, listen to energetic music' },
    { id: 19, start: '21:00', end: '22:30', title: 'LeetCode Revision', description: 'Revise all LeetCode problems for 1 hrs & 30 min' },
    { id: 20, start: '22:30', end: '23:11', title: 'Web Dev Learning', description: 'Continue with prerequisites' },
    { id: 21, start: '23:11', end: '23:30', title: 'Standup Comedy', description: 'Watch standup comedy' },
    { id: 22, start: '23:30', end: '23:45', title: 'Prepare for Sleep', description: 'Prepare for sleep' },
    { id: 23, start: '23:45', end: '05:45', title: 'Sleep', description: 'Sleep and wake up at 05:45' },
  ]);

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const savedTasks = localStorage.getItem('routineTasks');
    const savedCompletedTasks = localStorage.getItem('completedTasks');
    
    if (savedTasks) {
      setRoutineTasks(JSON.parse(savedTasks));
    }
    
    if (savedCompletedTasks) {
      setCompletedTasks(JSON.parse(savedCompletedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('routineTasks', JSON.stringify(routineTasks));
  }, [routineTasks]);

  // Save completed tasks to localStorage
  useEffect(() => {
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [completedTasks]);

  // Helper function to parse time - make it a memoized callback to fix dependency issues
  const parseTime = useCallback((timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date(currentTime);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }, [currentTime]);

  // Find current and upcoming tasks
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Convert current time to hours:minutes format
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      
      // Find current active task
      const current = routineTasks.find(task => {
        const start = task.start;
        const end = task.end;
        return currentTimeStr >= start && currentTimeStr < end;
      });
      
      setActiveTask(current || null);
      
      // Find next upcoming task
      if (current) {
        const currentIndex = routineTasks.findIndex(task => task.id === current.id);
        const next = routineTasks[(currentIndex + 1) % routineTasks.length];
        setUpcomingTask(next);
        
        // Set reminder 5 minutes before end of current task
        const endTime = parseTime(current.end);
        const fiveMinsBefore = new Date(endTime.getTime() - 5 * 60 * 1000);
        
        if (now >= fiveMinsBefore && now < endTime && !showReminder) {
          setShowReminder(true);
          setReminderTask(current);
          
          // Show notification
          if (Notification.permission === 'granted') {
            new Notification('Task Ending Soon', {
              body: `"${current.title}" is ending in less than 5 minutes. Next up: "${next.title}"`,
              icon: '/logo192.png'
            });
          }
          
          // Automatically hide reminder after 1 minute
          setTimeout(() => {
            setShowReminder(false);
          }, 60 * 1000);
        }
      } else {
        // Find the next chronological task
        const nextTask = routineTasks.find(task => currentTimeStr < task.start);
        setUpcomingTask(nextTask || routineTasks[0]);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentTime, showReminder, routineTasks, parseTime]); // Added parseTime dependency
  
  // Request notification permission
  useEffect(() => {
    if (Notification && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);
  
  // Mark task as completed
  const completeTask = (taskId) => {
    if (!completedTasks.includes(taskId)) {
      setCompletedTasks([...completedTasks, taskId]);
    }
  };
  
  // Format time for display
  const formatTimeLeft = (end) => {
    const endTime = parseTime(end);
    const diff = endTime - currentTime;
    
    if (diff <= 0) return "Time's up!";
    
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${minutes}m ${seconds}s`;
  };
  
  // Reset completed tasks at midnight
  useEffect(() => {
    if (currentTime.getHours() === 0 && currentTime.getMinutes() === 0 && currentTime.getSeconds() === 0) {
      setCompletedTasks([]);
    }
  }, [currentTime]);
  
  // Add a new task
  const handleAddTask = (newTask) => {
    // Sort tasks chronologically by start time
    const updatedTasks = [...routineTasks, newTask]
      .sort((a, b) => {
        const aMinutes = convertTimeToMinutes(a.start);
        const bMinutes = convertTimeToMinutes(b.start);
        return aMinutes - bMinutes;
      });
    
    setRoutineTasks(updatedTasks);
  };
  
  const convertTimeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };
  
  const getLastTaskId = () => {
    return routineTasks.length > 0 
      ? Math.max(...routineTasks.map(task => task.id))
      : 0;
  };

  // Calculate completion percentage
  const calculateDailyProgress = () => {
    if (routineTasks.length === 0) return 0;
    return Math.round((completedTasks.length / routineTasks.length) * 100);
  };
  
  // AnimatedReminder component definition inside RoutineTracker
  const AnimatedReminder = ({ children, show }) => {
    return (
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    );
  };
  
  return (
    <div className="min-h-screen pt-8 pb-16 px-4 sm:px-6 transition-colors duration-200 bg-slate-50 dark:bg-[#171735]">
      <motion.div 
        className="max-w-md mx-auto"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">My Routine</h1>
          <motion.button
            className="btn bg-gradient-primary p-3 rounded-xl text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTaskForm(true)}
          >
            <Plus size={20} />
          </motion.button>
        </div>

        {/* Date and Progress */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long' })}
            </div>
            <div className="text-xl font-semibold text-slate-800 dark:text-white">
              {currentTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Daily Progress</div>
            <div className="w-24 bg-slate-100 dark:bg-slate-700/30 rounded-full h-2 mb-1">
              <motion.div 
                className="bg-gradient-primary rounded-full h-2"
                initial={{ width: 0 }}
                animate={{ width: `${calculateDailyProgress()}%` }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </div>
            <div className="text-xs font-medium text-slate-600 dark:text-slate-300">{calculateDailyProgress()}% Completed</div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="bg-slate-100 dark:bg-slate-800/20 p-1 rounded-xl mb-6 flex">
          <button 
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${view === 'day' ? 'bg-white dark:bg-slate-700/50 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
            onClick={() => setView('day')}
          >
            Today
          </button>
          <button 
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${view === 'tasks' ? 'bg-white dark:bg-slate-700/50 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
            onClick={() => setView('tasks')}
          >
            All Tasks
          </button>
        </div>
        
        {/* Current Task Card */}
        <motion.div 
          className="card overflow-hidden mb-6"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-gradient-primary p-1">
            <div className="p-5 bg-white dark:bg-[#222244] rounded-t-3xl">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <div className="status-indicator status-active"></div>
                  <h2 className="text-sm font-semibold text-purple-600 dark:text-purple-400">CURRENT TASK</h2>
                </div>
                <div className="flex items-center text-purple-600 dark:text-purple-400 text-sm font-medium">
                  <Clock size={14} className="mr-1" />
                  <span>{activeTask ? `${activeTask.start} - ${activeTask.end}` : "--:-- - --:--"}</span>
                </div>
              </div>
              
              <motion.h3 
                className="text-2xl font-bold mt-3 text-slate-800 dark:text-white"
                key={activeTask ? activeTask.id : 'none'}
                initial={{ y: -5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100 }}
              >
                {activeTask ? activeTask.title : "No active task"}
              </motion.h3>
              
              <motion.p 
                className="text-slate-500 dark:text-slate-400 mt-2 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {activeTask ? activeTask.description : "Take a break or prepare for your next task"}
              </motion.p>
              
              {activeTask && (
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/30">
                  <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    Time Remaining
                  </div>
                  <motion.div
                    className="text-slate-700 dark:text-slate-300 font-bold"
                    key={formatTimeLeft(activeTask.end)}
                    initial={{ scale: 1.1, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 120 }}
                  >
                    {formatTimeLeft(activeTask.end)}
                  </motion.div>
                </div>
              )}
            </div>
          </div>
          
          {activeTask && (
            <div className="p-4 flex justify-end">
              <motion.button
                className={`px-5 py-2 rounded-xl font-medium flex items-center ${
                  completedTasks.includes(activeTask.id) 
                    ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
                }`}
                onClick={() => completeTask(activeTask.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={completedTasks.includes(activeTask.id)}
              >
                <CheckCircle size={18} className="mr-2" />
                {completedTasks.includes(activeTask.id) ? "Completed" : "Mark as Done"}
              </motion.button>
            </div>
          )}
        </motion.div>
        
        {/* Reminder Alert */}
        <AnimatePresence>
          {showReminder && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="card overflow-hidden mb-6"
            >
              <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 flex items-start">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 10, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                >
                  <AlertTriangle size={20} className="text-amber-500 mr-2 mt-1" />
                </motion.div>
                <div>
                  <div className="font-semibold text-amber-800 dark:text-amber-400">Almost time to switch tasks!</div>
                  <div className="text-sm text-amber-700 dark:text-amber-300">
                    <span className="font-medium">{reminderTask?.title}</span> is ending in less than 5 minutes.
                    Prepare for: <span className="font-medium">{upcomingTask?.title}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Next Task Card */}
        <motion.div 
          className="card overflow-hidden mb-6"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="p-5">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2">
                <div className="status-indicator status-upcoming"></div>
                <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400">NEXT UP</h2>
              </div>
              <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm">
                <Clock size={14} className="mr-1" />
                <span>{upcomingTask ? upcomingTask.start : "--:--"}</span>
              </div>
            </div>
            
            <motion.h3 
              className="text-xl font-bold mt-3 text-slate-700 dark:text-white"
              key={upcomingTask ? upcomingTask.id : 'none'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {upcomingTask ? upcomingTask.title : "—"}
            </motion.h3>
            
            <p className="text-slate-500 dark:text-slate-400 mt-2 truncate">
              {upcomingTask ? upcomingTask.description : "—"}
            </p>
          </div>
        </motion.div>
        
        {/* Tasks List */}
        {view === 'tasks' && (
          <motion.div 
            className="card"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="p-5 border-b border-slate-100 dark:border-slate-700/30">
              <h2 className="font-bold text-slate-800 dark:text-white text-lg">All Tasks</h2>
            </div>
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {routineTasks.map((task) => {
                const isActive = activeTask && activeTask.id === task.id;
                const isCompleted = completedTasks.includes(task.id);
                
                return (
                  <motion.div 
                    key={task.id}
                    className={`p-4 border-b border-slate-100 dark:border-slate-700/10 flex items-center ${
                      isActive ? 'bg-purple-50 dark:bg-purple-900/5' : ''
                    }`}
                    whileHover={{ backgroundColor: isActive ? '' : 'rgba(243, 244, 246, 0.5)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: task.id * 0.03 }}
                  >
                    <motion.div 
                      className={`mr-3 rounded-full p-1 ${
                        isCompleted 
                          ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400" 
                          : isActive 
                            ? "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
                            : "bg-slate-100 text-slate-400 dark:bg-slate-700/30 dark:text-slate-500"
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => isActive && !isCompleted ? completeTask(task.id) : null}
                    >
                      <CheckCircle size={18} />
                    </motion.div>
                    <div className="flex-1">
                      <div className={`font-medium ${isActive ? 'text-purple-800 dark:text-purple-300' : isCompleted ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-700 dark:text-slate-300'}`}>
                        {task.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{task.start} - {task.end}</div>
                    </div>
                    {isActive && !isCompleted && (
                      <motion.button 
                        className="px-3 py-1 text-xs bg-gradient-primary text-white rounded-lg"
                        onClick={() => completeTask(task.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Complete
                      </motion.button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
        
        {/* Add Task Modal */}
        <AnimatePresence>
          {showTaskForm && (
            <TaskForm
              onAddTask={handleAddTask}
              onClose={() => setShowTaskForm(false)}
              lastTaskId={getLastTaskId()}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default RoutineTracker;
