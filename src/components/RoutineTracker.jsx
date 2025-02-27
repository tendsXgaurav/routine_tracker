import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Clock, AlertTriangle, Edit, Plus, Save, Trash, X, Cloud } from 'lucide-react';

const RoutineTracker = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTask, setActiveTask] = useState(null);
  const [upcomingTask, setUpcomingTask] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showReminder, setShowReminder] = useState(false);
  const [reminderTask, setReminderTask] = useState(null);
  const [routineTasks, setRoutineTasks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    id: null,
    start: '',
    end: '',
    title: '',
    description: ''
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);
  
  // Load tasks from local storage on initial render
  useEffect(() => {
    const storedTasks = localStorage.getItem('routineTasks');
    const storedCompletedTasks = localStorage.getItem('completedTasks');
    
    if (storedTasks) {
      setRoutineTasks(JSON.parse(storedTasks));
    } else {
      // Default routine tasks if none are stored
      const defaultTasks = [
        { id: 1, start: '05:45', end: '06:15', title: 'Morning Run & Rest', description: 'Go for a run outside, return to room, rest for 10 mins, drink water' },
        { id: 2, start: '06:15', end: '06:30', title: 'AI News', description: 'Explore news related to AI (Top crucial which teach something everyday)' },
        // ... more default tasks
        { id: 23, start: '23:45', end: '05:45', title: 'Sleep', description: 'Sleep and wake up at 05:45' },
      ];
      setRoutineTasks(defaultTasks);
      localStorage.setItem('routineTasks', JSON.stringify(defaultTasks));
    }
    
    if (storedCompletedTasks) {
      setCompletedTasks(JSON.parse(storedCompletedTasks));
    }
  }, []);

  // Save tasks to local storage when they change
  useEffect(() => {
    if (routineTasks.length > 0) {
      localStorage.setItem('routineTasks', JSON.stringify(routineTasks));
    }
  }, [routineTasks]);

  // Save completed tasks to local storage when they change
  useEffect(() => {
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [completedTasks]);

  // Helper function to parse time
  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date(currentTime);
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  // Find current and upcoming tasks
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Find active task
      let active = null;
      let upcoming = null;

      for (const task of routineTasks) {
        const startTime = parseTime(task.start);
        const endTime = parseTime(task.end);
        
        // Handle tasks that span midnight
        if (startTime > endTime) {
          endTime.setDate(endTime.getDate() + 1);
        }

        if (now >= startTime && now < endTime) {
          active = task;
          break;
        }
      }

      // Find upcoming task
      if (active) {
        const activeEndTime = parseTime(active.end);
        let minStartTimeDiff = Infinity;
        
        for (const task of routineTasks) {
          if (task.id === active.id) continue;
          
          const startTime = parseTime(task.start);
          // If the start time is earlier than now, it's likely for tomorrow
          let adjustedStartTime = new Date(startTime);
          if (adjustedStartTime < now) {
            adjustedStartTime.setDate(adjustedStartTime.getDate() + 1);
          }
          
          const timeDiff = adjustedStartTime - now;
          if (timeDiff > 0 && timeDiff < minStartTimeDiff) {
            minStartTimeDiff = timeDiff;
            upcoming = task;
          }
        }
      } else {
        // If no active task, find the next upcoming task
        let minStartTimeDiff = Infinity;
        
        for (const task of routineTasks) {
          const startTime = parseTime(task.start);
          // If the start time is earlier than now, it's likely for tomorrow
          let adjustedStartTime = new Date(startTime);
          if (adjustedStartTime < now) {
            adjustedStartTime.setDate(adjustedStartTime.getDate() + 1);
          }
          
          const timeDiff = adjustedStartTime - now;
          if (timeDiff > 0 && timeDiff < minStartTimeDiff) {
            minStartTimeDiff = timeDiff;
            upcoming = task;
          }
        }
      }

      setActiveTask(active);
      setUpcomingTask(upcoming);
      
      // Show reminder 5 minutes before upcoming task
      if (upcoming) {
        const upcomingStartTime = parseTime(upcoming.start);
        const timeDiff = (upcomingStartTime - now) / 1000 / 60; // convert to minutes
        
        if (timeDiff <= 5 && timeDiff > 0) {
          setShowReminder(true);
          setReminderTask(upcoming);
        } else {
          setShowReminder(false);
          setReminderTask(null);
        }
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentTime, routineTasks]);

  // Mark task as completed
  const completeTask = (task) => {
    if (!completedTasks.find(t => t.id === task.id)) {
      const newCompletedTask = {
        ...task,
        completedAt: new Date().toISOString()
      };
      setCompletedTasks([...completedTasks, newCompletedTask]);
    }
  };

  // Format time to display
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Add a new task
  const addTask = () => {
    const taskId = routineTasks.length > 0 
      ? Math.max(...routineTasks.map(t => t.id)) + 1 
      : 1;
    
    const taskToAdd = {
      ...newTask,
      id: taskId
    };
    
    const updatedTasks = [...routineTasks, taskToAdd].sort((a, b) => {
      const aTime = parseTime(a.start);
      const bTime = parseTime(b.start);
      return aTime - bTime;
    });
    
    setRoutineTasks(updatedTasks);
    setShowTaskForm(false);
    setNewTask({
      id: null,
      start: '',
      end: '',
      title: '',
      description: ''
    });
  };

  // Edit an existing task
  const startEditing = (task) => {
    setEditingTask({...task});
    setIsEditing(true);
  };

  const saveEdit = () => {
    const updatedTasks = routineTasks.map(task => 
      task.id === editingTask.id ? editingTask : task
    ).sort((a, b) => {
      const aTime = parseTime(a.start);
      const bTime = parseTime(b.start);
      return aTime - bTime;
    });
    
    setRoutineTasks(updatedTasks);
    setIsEditing(false);
    setEditingTask(null);
  };

  // Delete a task
  const deleteTask = (taskId) => {
    const updatedTasks = routineTasks.filter(task => task.id !== taskId);
    setRoutineTasks(updatedTasks);
    
    // Also remove from completed tasks if present
    const updatedCompletedTasks = completedTasks.filter(task => task.id !== taskId);
    setCompletedTasks(updatedCompletedTasks);
  };

  // Sync data with cloud storage (simulated)
  const syncWithCloud = async () => {
    setIsSyncing(true);
    
    try {
      // Simulate API call to sync data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For a real implementation, you would POST to your backend API
      // Example: await fetch('/api/sync', { method: 'POST', body: JSON.stringify({ routineTasks, completedTasks }) });
      
      setLastSynced(new Date());
      setIsSyncing(false);
    } catch (error) {
      console.error("Sync failed:", error);
      setIsSyncing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Routine Tracker</h1>
            <p className="text-purple-200">{currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <p className="text-purple-200">{formatTime(currentTime)}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowTaskForm(true)}
              className="bg-white text-purple-600 p-2 rounded-full hover:bg-purple-100 transition-colors"
              title="Add new task"
            >
              <Plus size={20} />
            </button>
            <button 
              onClick={syncWithCloud}
              className={`bg-white text-purple-600 p-2 rounded-full hover:bg-purple-100 transition-colors ${isSyncing ? 'animate-pulse' : ''}`}
              disabled={isSyncing}
              title="Sync with cloud"
            >
              <Cloud size={20} />
            </button>
          </div>
        </div>

        {/* Active Task */}
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
            <Clock className="mr-2 text-purple-600" size={20} />
            Current Task
          </h2>
          {activeTask ? (
            <div className="bg-purple-50 p-4 rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-xl text-purple-700">{activeTask.title}</h3>
                  <p className="text-sm text-gray-600">{activeTask.start} - {activeTask.end}</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => completeTask(activeTask)} 
                    className="bg-green-500 text-white p-1 rounded hover:bg-green-600"
                    title="Mark as completed"
                  >
                    <CheckCircle size={16} />
                  </button>
                  <button 
                    onClick={() => startEditing(activeTask)} 
                    className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
                    title="Edit task"
                  >
                    <Edit size={16} />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-gray-700">{activeTask.description}</p>
            </div>
          ) : (
            <p className="text-gray-500 italic">No active task at the moment</p>
          )}
        </div>

        {/* Upcoming Task */}
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
            <AlertTriangle className="mr-2 text-yellow-500" size={20} />
            Upcoming Task
          </h2>
          {upcomingTask ? (
            <div className="bg-yellow-50 p-4 rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-yellow-700">{upcomingTask.title}</h3>
                  <p className="text-sm text-gray-600">{upcomingTask.start} - {upcomingTask.end}</p>
                </div>
                <button 
                  onClick={() => startEditing(upcomingTask)} 
                  className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
                  title="Edit task"
                >
                  <Edit size={16} />
                </button>
              </div>
              <p className="mt-2 text-gray-700">{upcomingTask.description}</p>
            </div>
          ) : (
            <p className="text-gray-500 italic">No upcoming task</p>
          )}
        </div>

        {/* Today's Schedule */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <Clock className="mr-2 text-purple-600" size={20} />
            Today's Schedule
          </h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {routineTasks.map(task => (
              <div 
                key={task.id} 
                className={`p-3 rounded-md border flex justify-between items-center 
                  ${activeTask && task.id === activeTask.id ? 'bg-purple-100 border-purple-300' : 
                    upcomingTask && task.id === upcomingTask.id ? 'bg-yellow-50 border-yellow-200' : 
                    completedTasks.find(t => t.id === task.id) ? 'bg-green-50 border-green-200' : 
                    'bg-gray-50 border-gray-200'}`}
              >
                <div className="flex items-center space-x-3">
                  {completedTasks.find(t => t.id === task.id) && (
                    <CheckCircle className="text-green-500" size={16} />
                  )}
                  <div>
                    <h3 className={`font-medium ${completedTasks.find(t => t.id === task.id) ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-500">{task.start} - {task.end}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => completeTask(task)} 
                    className="text-green-600 hover:text-green-800"
                    title="Mark as completed"
                  >
                    <CheckCircle size={16} />
                  </button>
                  <button 
                    onClick={() => startEditing(task)} 
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit task"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => deleteTask(task.id)} 
                    className="text-red-600 hover:text-red-800"
                    title="Delete task"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reminder Modal */}
        {showReminder && reminderTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-purple-700 flex items-center">
                  <Bell className="mr-2 text-yellow-500" />
                  Upcoming Task Reminder
                </h3>
                <button onClick={() => setShowReminder(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>
              <div className="mb-4">
                <p className="text-lg font-medium">{reminderTask.title}</p>
                <p className="text-sm text-gray-600">Starting at {reminderTask.start}</p>
                <p className="mt-2">{reminderTask.description}</p>
              </div>
              <button 
                onClick={() => setShowReminder(false)}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Edit Task Modal */}
        {isEditing && editingTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-purple-700">Edit Task</h3>
                <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input 
                    type="text" 
                    value={editingTask.title} 
                    onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Start Time</label>
                    <input 
                      type="text" 
                      value={editingTask.start} 
                      onChange={(e) => setEditingTask({...editingTask, start: e.target.value})}
                      placeholder="HH:MM"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">End Time</label>
                    <input 
                      type="text" 
                      value={editingTask.end} 
                      onChange={(e) => setEditingTask({...editingTask, end: e.target.value})}
                      placeholder="HH:MM"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea 
                    value={editingTask.description} 
                    onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    rows="3"
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-3">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={saveEdit}
                    className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add New Task Modal */}
        {showTaskForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-purple-700">Add New Task</h3>
                <button onClick={() => setShowTaskForm(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input 
                    type="text" 
                    value={newTask.title} 
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Start Time</label>
                    <input 
                      type="text" 
                      value={newTask.start} 
                      onChange={(e) => setNewTask({...newTask, start: e.target.value})}
                      placeholder="HH:MM"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">End Time</label>
                    <input 
                      type="text" 
                      value={newTask.end} 
                      onChange={(e) => setNewTask({...newTask, end: e.target.value})}
                      placeholder="HH:MM"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea 
                    value={newTask.description} 
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    rows="3"
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-3">
                  <button 
                    onClick={() => setShowTaskForm(false)}
                    className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={addTask}
                    className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
                    disabled={!newTask.title || !newTask.start || !newTask.end}
                  >
                    Add Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Last Synced Info */}
        {lastSynced && (
          <div className="p-3 text-xs text-gray-500 bg-gray-50 border-t text-center">
            Last synced: {lastSynced.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutineTracker;
