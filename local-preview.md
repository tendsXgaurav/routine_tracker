# Local Development and Preview Guide

This guide shows you how to run and preview your Routine Tracker App locally before deployment.

## Prerequisites

- Node.js (version 14.x or newer recommended)
- npm or yarn package manager

## Running the Development Server

1. Open your terminal and navigate to the project directory:
   ```bash
   cd /home/backspace/App
   ```

2. Install dependencies (if you haven't already):
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

4. Your app should automatically open in your default browser. If not, open:
   ```
   http://localhost:3000
   ```

## Building for Production Preview

If you want to preview the production build:

1. Create a production build:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Serve the production build locally:
   ```bash
   # Install serve globally if you don't have it
   npm install -g serve
   # or
   yarn global add serve
   
   # Serve the build folder
   serve -s build
   ```

3. Open the URL provided by the serve command (typically http://localhost:5000)

## Verifying Features

While previewing your app, check these features:

- [ ] Adding new tasks
- [ ] Editing existing tasks
- [ ] Deleting tasks
- [ ] Task notifications
- [ ] Current task display
- [ ] Upcoming tasks display
- [ ] Data persistence (reload the page to verify)
- [ ] Responsive design (try different screen sizes)

## Troubleshooting

### Common Issues

1. **Blank screen or errors in console**:
   - Check for JavaScript errors in the browser console
   - Verify all dependencies are installed correctly

2. **Changes not updating**:
   - Try clearing the browser cache
   - Restart the development server

3. **Local storage issues**:
   - Clear local storage in browser dev tools
   - Check storage quota limits

4. **Build errors**:
   - Look for error messages in the terminal
   - Check for linting or syntax errors

5. **Port already in use**:
   - Kill the process using the port:
     ```bash
     npx kill-port 3000
     # or
     sudo lsof -i :3000
     sudo kill -9 [PID]
     ```
   - Start with a different port:
     ```bash
     PORT=3001 npm start
     ```

### Debugging Tools

- Browser Developer Tools (F12 or Ctrl+Shift+I)
- React Developer Tools extension
- Redux DevTools (if using Redux)
