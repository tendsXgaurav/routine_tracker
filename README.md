# Routine Tracker App

A task management application that helps users track their daily routines with features like:

- Current task tracking with real-time updates
- Upcoming task notifications
- Complete task management (add, edit, delete)
- Local storage for persistence
- Cloud sync simulation (ready for backend integration)

## Features

- **Task Management**: Add, edit, and delete tasks in your daily routine
- **Real-time Tracking**: See your current active task and upcoming tasks at a glance
- **Reminders**: Get notifications 5 minutes before a task starts
- **Task Completion**: Mark tasks as completed to track your progress
- **Data Persistence**: Your tasks are saved in local storage
- **Cloud Sync**: Simulated cloud sync (ready to integrate with a real backend)

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/routine-tracker.git
   cd routine-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

### Usage

1. Add new tasks by clicking the "+" button
2. Edit tasks by clicking the edit icon
3. Delete tasks by clicking the delete icon
4. Mark tasks as complete by clicking the checkbox
5. View your current task in the "Current Task" section
6. Check upcoming tasks in the "Upcoming Tasks" section

## Deployment

To build for production:

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `build/` directory, ready to be deployed.

## Technologies Used

- React.js
- CSS (or styled-components/other CSS frameworks)
- Local Storage API
- Notification API

## Future Enhancements

- Backend integration for real cloud sync
- User authentication
- Task categories and filtering
- Analytics dashboard
- Mobile app version

## License

This project is licensed under the MIT License - see the LICENSE file for details.

