// This is a simplified API layer that would connect to your backend
// For now it uses localStorage for persistence

export const fetchTasks = async () => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const tasks = localStorage.getItem('routineTasks');
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const saveTasks = async (tasks) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    localStorage.setItem('routineTasks', JSON.stringify(tasks));
    return { success: true, message: 'Tasks saved successfully' };
  } catch (error) {
    console.error("Error saving tasks:", error);
    throw error;
  }
};

export const syncWithCloud = async (tasks, completedTasks) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, you would send this data to your server
    // const response = await fetch('https://your-api.com/sync', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ tasks, completedTasks })
    // });
    // return await response.json();
    
    // For now, just save to localStorage
    localStorage.setItem('routineTasks', JSON.stringify(tasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    
    return {
      success: true,
      message: 'Sync successful',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error syncing with cloud:", error);
    throw error;
  }
};
