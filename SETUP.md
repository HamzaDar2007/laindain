# Financial System - Electron Frontend Setup Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Backend API running on `http://localhost:3000/api`

## Installation Steps

### 1. Install Dependencies

```bash
cd frontend
npm install
```

This will install all required packages including:
- Electron
- React & React DOM
- Redux Toolkit
- Tailwind CSS
- i18next
- And all other dependencies

### 2. Start Development Server

```bash
npm run dev
```

This command will:
1. Start Vite development server on `http://localhost:5173`
2. Launch Electron window
3. Enable hot-reload for instant updates

### 3. Using the Application

#### First Time Setup
1. **Register**: Create a new user account
2. **Login**: Sign in with your credentials
3. **Create Tenant**: Set up your organization
4. **Start Using**: Create accounts, journal entries, etc.

#### Language Switching
- Click the language button in the header
- Toggle between English and Urdu
- Layout automatically switches between LTR and RTL

#### Creating Accounts
1. Go to "Chart of Accounts"
2. Click "Create Account"
3. Fill in details (name, type, level)
4. Code is auto-generated in format: `0-00-000-0000`
5. Level 4 accounts are automatically marked as posting accounts

#### Journal Entries
1. Go to "Journal Entries"
2. Click "Create Entry"
3. Add multiple lines (minimum 2)
4. Enter debits and credits
5. Ensure debits = credits
6. Save as draft or post immediately

## Building for Production

### Build Application

```bash
npm run build
```

This creates optimized production files in `dist/` and `dist-electron/`

### Create Installer

```bash
npm run build:electron
```

This creates platform-specific installers in `build/`:
- **Windows**: `.exe` installer
- **macOS**: `.dmg` file
- **Linux**: `.AppImage` and `.deb` packages

## Troubleshooting

### Port Already in Use
If port 5173 is busy:
1. Change port in `vite.config.ts`
2. Update port in `electron/main.ts`

### API Connection Issues
1. Ensure backend is running on `http://localhost:3000`
2. Check `src/store/common/apiHelper.ts` for API URL
3. Verify CORS is enabled on backend

### Electron Window Not Opening
1. Check console for errors
2. Try: `npm run dev` again
3. Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

### Build Errors
1. Run type check: `npm run type-check`
2. Run linter: `npm run lint`
3. Fix any TypeScript or ESLint errors

## Development Tips

### Hot Reload
- React components reload automatically
- Electron main process requires restart
- Use `Ctrl+R` to reload renderer

### DevTools
- Opens automatically in development
- Press `Ctrl+Shift+I` to toggle
- Use Redux DevTools extension

### Debugging
1. Main process: Use `console.log` in `electron/main.ts`
2. Renderer: Use browser DevTools
3. Check terminal for main process logs

## Project Structure

```
frontend/
├── electron/              # Electron main process
│   ├── main.ts           # Entry point
│   ├── app-window.ts     # Window management
│   ├── preload.ts        # IPC bridge
│   └── ipc/              # IPC handlers
├── src/                  # React application
│   ├── components/       # Reusable components
│   ├── pages/            # Page components
│   ├── store/            # Redux state
│   ├── i18n/             # Translations
│   └── utils/            # Utilities
├── public/               # Static files
├── resources/            # App icons
└── package.json          # Dependencies
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Start development server
3. ✅ Register and login
4. ✅ Create your organization
5. ✅ Set up chart of accounts
6. ✅ Create journal entries
7. ✅ Generate reports

## Support

For issues or questions:
1. Check this guide
2. Review backend documentation
3. Check console for errors
4. Verify API is running

Happy accounting! 🎉
