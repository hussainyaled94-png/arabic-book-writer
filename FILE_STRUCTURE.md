# 📁 Project File Structure & Explanation

## Complete File Breakdown

```
arabic-book-writer/
│
├── 📄 index.html                 # Entry HTML - Browser loads this first
├── 📄 main.jsx                   # React entry point - Mounts app to DOM
├── 📄 App.jsx                    # Root React component - Wraps everything
├── 📄 ArabicBookWriter.jsx       # Main app logic & UI - 400+ lines
├── 📄 index.css                  # Global styles & animations
│
├── 📦 package.json               # Dependencies & build scripts
├── ⚙️ vite.config.js            # Vite bundler configuration
├── 📋 vercel.json               # Vercel deployment config
│
├── 📚 README.md                 # Full documentation (you are here)
├── ⚡ QUICKSTART.md             # 2-minute deployment guide
├── 📖 FILE_STRUCTURE.md         # This file
├── .gitignore                   # Files to ignore in Git
│
└── (generated on build)
    └── dist/                    # Production build (created by `npm run build`)
        ├── index.html
        ├── assets/
        │   ├── main-*.js
        │   └── index-*.css
```

---

## 🔍 File Details

### Core Application Files

#### `index.html`
**Purpose**: Browser entry point
**Contains**:
- Meta tags for mobile, SEO, theme colors
- Google Fonts import (Arabic fonts)
- Tailwind CSS CDN link
- Scrollbar styling
- Root div where React mounts

**Edit this for**:
- Changing page title
- Adding new fonts
- SEO meta tags
- Custom CSS animations

---

#### `main.jsx`
**Purpose**: React bootstrap
**Contains**:
- React import
- ReactDOM import
- App component mounting

**Edit this for**:
- Adding global providers
- Authentication wrappers
- Error boundaries

---

#### `App.jsx`
**Purpose**: Root wrapper
**Contains**:
- Single import of ArabicBookWriter
- Simple export

**Edit this for**:
- Adding multiple top-level routes
- Adding navigation between sections

---

#### `ArabicBookWriter.jsx` ⭐
**Purpose**: Main application logic (THE IMPORTANT ONE)
**Contains** (600+ lines):
- State management (100 sentences, modes, themes)
- LocalStorage persistence
- AI API integration with Claude
- UI components and styling
- All interactive features

**Key sections**:
```javascript
// State declarations (lines ~40-50)
const [sentences, setSentences] = useState([]);
const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
const [mode, setMode] = useState('guided');

// Effect hooks (lines ~60-90)
// Load/save from localStorage
// Calculate statistics
// Show milestones

// AI feedback function (lines ~110-150)
const getAIFeedback = useCallback(async (text) => { ... })

// UI JSX (lines ~150+)
// Header with navigation
// Main editor area
// Sidebar with stats
// Modals and panels
```

**Edit this for**:
- Changing colors: Search `orange-600`, `amber-600`, etc.
- Modifying AI prompts: Search `أنت محرر عربي`
- Adding new modes
- Changing typography
- Adding new features

**Key features in this file**:
1. **State Management**: React hooks for all data
2. **Auto-Save**: localStorage persistence
3. **AI Integration**: Anthropic API calls
4. **RTL Support**: `dir="rtl"` and proper text direction
5. **Dark Mode**: Theme toggle with CSS variables
6. **Progress Tracking**: Real-time statistics
7. **Responsive Design**: Tailwind CSS grid system

---

#### `index.css`
**Purpose**: Global styles
**Contains**:
- CSS variables (colors, fonts)
- Custom scrollbar styling
- Print styles
- Animations
- Reduced motion support

**Edit this for**:
- Changing global colors
- Adding new animations
- Modifying scrollbar appearance
- Print styling

---

### Configuration Files

#### `package.json`
**Purpose**: Node.js project configuration
**Contains**:
- Project metadata
- npm dependencies
- Build scripts
- Version info

**Key scripts**:
```json
"dev": "vite"              // Start local dev server
"build": "vite build"      // Build for production
"preview": "vite preview"  // Preview production build
```

**To add dependencies**:
```bash
npm install some-package
```

---

#### `vite.config.js`
**Purpose**: Build tool configuration
**Contains**:
- React plugin configuration
- Dev server settings
- Build output options
- Optimization settings

**Edit for**:
- Changing port number
- Adding aliases
- Performance optimization

---

#### `vercel.json`
**Purpose**: Vercel deployment instructions
**Contains**:
- Build command
- Start command
- Framework type
- Environment variables config

**Edit for**:
- Adding environment variables
- Changing build/start commands

---

### Documentation Files

#### `README.md`
**Purpose**: Full project documentation
**Contains**:
- Feature descriptions
- Deployment instructions
- API setup guide
- Troubleshooting
- Project structure

---

#### `QUICKSTART.md`
**Purpose**: Fast 2-minute deployment
**Contains**:
- Quick Vercel deployment steps
- Local development setup
- Basic customization tips

---

### Git Files

#### `.gitignore`
**Purpose**: Tell Git which files to ignore
**Contains**:
- node_modules/
- dist/ (build output)
- .env files
- IDE files (.vscode, .idea)

---

## 🔄 How Files Work Together

```
Browser Loads
    ↓
index.html (Tailwind CSS + Fonts)
    ↓
main.jsx (Mounts React)
    ↓
App.jsx (Renders root component)
    ↓
ArabicBookWriter.jsx (Main app logic)
    ↓
State hooks + Effects
    ├── Load from localStorage
    ├── Render UI with Tailwind
    ├── Handle user input
    ├── Call Claude API for feedback
    └── Save to localStorage
```

---

## 📝 Common Edits

### Change App Colors
**File**: `ArabicBookWriter.jsx`
**Search**: `orange-600`, `amber-600`, `orange-500`
**Replace with**: Your color (e.g., `blue-600`, `purple-600`)

### Modify AI Feedback Prompt
**File**: `ArabicBookWriter.jsx`
**Search**: `أنت محرر عربي`
**Edit**: The prompt text to change AI behavior

### Add New Feature
1. **Add state** to `ArabicBookWriter.jsx`
2. **Create handler function**
3. **Add UI button/input**
4. **Update localStorage save**

### Change Fonts
**File**: `index.html`
**Edit**: Google Fonts import line

### Modify Page Title
**File**: `index.html`
**Edit**: `<title>` tag

---

## 🚀 Build Process

When you run `npm run build`:
1. Vite bundles all files
2. Creates `dist/` folder
3. Minifies JavaScript
4. Optimizes CSS
5. Generates sourceless output
6. Ready for Vercel deployment

---

## 📦 Dependencies

**Minimal but powerful**:
- `react@18.2.0` - UI framework
- `react-dom@18.2.0` - Browser rendering
- `lucide-react@0.383.0` - Icons (minimal download)

**CSS**:
- Tailwind CSS via CDN (no npm install needed)
- Google Fonts (Arabic fonts via CDN)

**No heavy dependencies** = Fast load time ⚡

---

## ✅ Deployment Checklist

Before deploying to production:

- [ ] Test locally: `npm run build && npm run preview`
- [ ] Get Anthropic API key
- [ ] Set environment variable in Vercel
- [ ] Test AI feedback works
- [ ] Check responsive design on mobile
- [ ] Verify localStorage persistence
- [ ] Test all writing modes
- [ ] Verify Arabic text renders correctly
- [ ] Check dark/light mode toggle
- [ ] Test export functionality

---

## 🔗 Quick Links

- **Main App**: `ArabicBookWriter.jsx`
- **Styles**: `index.css` + Tailwind in `index.html`
- **Config**: `vite.config.js`, `vercel.json`
- **Deployment**: `README.md` → Deployment section

---

## 💡 Tips

1. **Backup localStorage**: Browser dev tools → Application → Local Storage
2. **Test changes**: Always `npm run dev` before committing
3. **No build needed for CSS**: Tailwind is in CDN
4. **Fonts auto-load**: Google Fonts via `index.html`
5. **Dark mode works**: Uses system preference + toggle

---

**Next Step**: Deploy using instructions in `README.md` or `QUICKSTART.md`
