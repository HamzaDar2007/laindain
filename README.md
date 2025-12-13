# Financial System - Electron Frontend

A professional Electron desktop application with React + TypeScript for multi-tenant double-entry accounting.

## 🚀 Quick Start

### Development Mode

```bash
# Install dependencies
npm install

# Run in development mode (Electron + Vite)
npm run dev
```

The app will open as an Electron window with hot-reload enabled.

### Production Build

```bash
# Build the application
npm run build

# Build Electron installer
npm run build:electron
```

The installer will be created in the `build/` directory.

## ✨ Features

- ✅ **Electron Desktop App** - Native Windows/Mac/Linux application
- ✅ **Bilingual** - English & Urdu with RTL support
- ✅ **Auto Account Codes** - Format: `0-00-000-0000`
- ✅ **Double-Entry Accounting** - Journal validation
- ✅ **Multi-Tenancy** - Multiple organizations
- ✅ **Professional UI** - Tailwind CSS design

## 📁 Project Structure

```
frontend/
├── electron/          # Electron main process
├── src/              # React application
│   ├── components/   # UI components
│   ├── pages/        # Page components
│   ├── store/        # Redux state
│   ├── i18n/         # Translations
│   └── utils/        # Utilities
├── public/           # Static files
└── resources/        # App icons
```

## 🔧 Configuration

Update API URL in `src/store/common/apiHelper.ts`:

```typescript
const API_BASE_URL = 'http://localhost:3000/api';
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:electron` - Create installer
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript

## 🎯 Key Features

### Account Code Generation
Automatic hierarchical codes:
- Level 1: `1-00-000-0000` (Assets)
- Level 2: `1-01-000-0000`
- Level 3: `1-01-001-0000`
- Level 4: `1-01-001-0001` (Posting)

### Language Switching
Toggle English ↔ Urdu with automatic RTL/LTR layout.

### Journal Entries
Multi-line entries with real-time debit/credit validation.

## 📦 Tech Stack

- Electron 28
- React 18
- TypeScript 5
- Redux Toolkit
- Tailwind CSS
- i18next
- Vite

## 📄 License

MIT
