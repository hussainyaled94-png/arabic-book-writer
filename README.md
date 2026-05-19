# 📖 ورشة الكتابة العربية
## Arabic Book Writer - AI-Powered Writing Studio

A beautiful, modern Arabic book writing application that helps you write a complete 100-sentence book with intelligent AI feedback and guidance. Built with React, Tailwind CSS, and Claude AI.

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## ✨ Features

### Writing Modes
- **📝 Sequential Mode**: Write sentences 1-100 in order
- **🎨 Free-Form Mode**: Write any sentence at any time
- **✨ Guided Mode**: Get AI suggestions and prompts

### AI-Powered Assistance
- **Arabic-Specific Feedback**: Real-time suggestions in Modern Standard Arabic
- **Literary Quality Analysis**: Grammar, eloquence, flow, and style evaluation
- **Smart Suggestions**: Context-aware improvements for each sentence

### Tracking & Analytics
- **Progress Visualization**: Real-time progress bar and statistics
- **Word Count Tracking**: Monitor your writing volume
- **Milestone Celebrations**: Achievements at 25%, 50%, 75%, and 100%
- **Sentence Metadata**: Track word count and completion status

### Advanced Features
- **Theme & Character Tracker**: Manage plot themes and character information
- **Dark/Light Mode**: Eye-comfortable writing environment
- **Auto-Save**: Automatic localStorage persistence
- **Export Functionality**: Download your completed book as text
- **Beautiful Arabic Typography**: Professional fonts optimized for Arabic

---

## 🚀 Deployment

### Option 1: Deploy to Vercel (Recommended)

**Easiest way - Click and deploy:**

1. **Fork or clone this repository**
   ```bash
   git clone https://github.com/yourusername/arabic-book-writer.git
   cd arabic-book-writer
   ```

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

**That's it!** Your app will be live at `your-project.vercel.app`

---

### Option 2: Deploy to GitHub Pages

1. **Update `vite.config.js`** with base path:
   ```javascript
   export default defineConfig({
     base: '/arabic-book-writer/', // Replace with your repo name
     // ... rest of config
   })
   ```

2. **Add build and deploy scripts** to `package.json`:
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     },
     "devDependencies": {
       "gh-pages": "^6.1.0"
     }
   }
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

---

### Option 3: Run Locally

**Prerequisites**: Node.js 16+ and npm

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Visit `http://localhost:3000` in your browser.

---

## 🔐 API Configuration

### Setting Up Claude AI Integration

The app uses Anthropic's Claude AI for real-time Arabic text feedback. Two options:

#### Option A: Browser-Based (Easiest for Testing)
The app makes API calls directly from the browser. You'll need to provide your API key when prompted.

**To get an API key:**
1. Sign up at [Anthropic Console](https://console.anthropic.com)
2. Create an API key
3. The app will use this for Claude feedback

#### Option B: Vercel Environment Variable (Production)
For production deployment, set your API key as an environment variable:

1. In Vercel dashboard:
   - Go to your project settings
   - Click "Environment Variables"
   - Add: `ANTHROPIC_API_KEY` = your API key

2. The app will automatically use this key for API calls

**Security Note**: Never commit API keys to GitHub. Always use environment variables.

---

## 📝 How to Use

### Getting Started
1. **Open the app** - The interface will be in Arabic (RTL)
2. **Choose a writing mode**:
   - Sequential: Start with sentence 1
   - Free-Form: Jump to any sentence
   - Guided: Get AI suggestions

3. **Write your sentences** - Type naturally in Arabic
4. **Get AI Feedback** - Suggestions appear automatically

### Tips for Better Results
- **Write naturally first**, then refine based on AI suggestions
- **Track themes and characters** using the Settings panel
- **Aim for 15-20 words** per sentence for good flow
- **Use diverse sentence structures** for engaging prose
- **Celebrate milestones** at 25, 50, 75, 100 sentences

### Exporting Your Work
- Click "تحميل النص" (Download Text) to save as `.txt`
- Data is automatically saved to browser storage
- Your book persists even if you close the browser

---

## 🎨 Customization

### Change Color Scheme
Edit colors in `ArabicBookWriter.jsx`:
```javascript
// Change from: 'from-amber-600 to-orange-600'
// To: 'from-blue-600 to-purple-600'
```

### Modify AI Feedback
Edit the system prompt in `ArabicBookWriter.jsx`:
```javascript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  // ... modify the prompt here for different feedback types
})
```

### Add New Writing Modes
Add a new mode option in the mode selector section and implement its logic.

---

## 📊 Project Structure

```
arabic-book-writer/
├── index.html              # HTML entry point
├── main.jsx               # React entry point
├── App.jsx               # Root component
├── ArabicBookWriter.jsx  # Main application component
├── index.css             # Global styles
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
├── vercel.json           # Vercel deployment config
└── .gitignore           # Git ignore rules
```

---

## 🔧 Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Integration**: Anthropic Claude API
- **Storage**: Browser localStorage
- **Deployment**: Vercel / GitHub Pages / Custom Server

---

## 🌍 Language Support

- **UI Language**: Arabic (العربية)
- **Writing Language**: Arabic (Modern Standard Arabic - الفصحى)
- **Text Direction**: RTL (Right-to-Left) with full Unicode support

---

## 💡 Features Explained

### 1. **Story Arc Builder**
- Visual progress tracking
- Organized by sentence position
- Helps maintain narrative flow

### 2. **AI Feedback System**
- Analyzes each sentence for:
  - Grammatical correctness
  - Eloquence and style
  - Word choice optimization
  - Flow and rhythm
- Provides constructive suggestions in Arabic

### 3. **Progress Tracking**
- Real-time statistics
- Word count monitoring
- Achievement badges
- Visual progress bars

### 4. **Theme Management**
- Track story themes
- Manage character information
- Maintain narrative consistency

### 5. **Multiple Export Options**
- Download as plain text
- Print-ready formatting
- Browser storage backup

---

## 🐛 Troubleshooting

### API Key Issues
- Ensure you have a valid Anthropic API key
- Check that the key has proper permissions
- Verify the key is set in environment variables (for production)

### Storage Issues
- Clear browser cache if data doesn't persist
- Check localStorage is enabled
- Try incognito/private mode to test clean state

### Text Direction Issues
- Ensure your browser supports RTL
- Clear cache if direction appears incorrect
- Try a different browser

---

## 📈 Future Enhancements

- [ ] Multi-language support
- [ ] Cloud synchronization
- [ ] Collaborative editing
- [ ] Advanced grammar checking
- [ ] PDF export with formatting
- [ ] Writing goals and statistics
- [ ] Reading time estimation
- [ ] Tone analysis
- [ ] Plagiarism checker
- [ ] Mobile app version

---

## 📄 License

MIT License - Feel free to use this for personal or commercial projects.

---

## 🤝 Contributing

Want to improve the app? Contributions welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📞 Support

- **Issues**: Open a GitHub issue
- **Questions**: Check the FAQ in the app
- **Feedback**: Use the feedback button in settings

---

## 🙏 Acknowledgments

- Anthropic for Claude AI
- React community
- Tailwind CSS
- All Arabic typography providers

---

## 📖 Additional Resources

- [Anthropic API Documentation](https://docs.anthropic.com)
- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Vite Documentation](https://vitejs.dev)
- [Arabic Typography Guide](https://fonts.google.com/?query=arabic)

---

**Happy Writing! 🎉**

*كتابة سعيدة!*

---

Made with ❤️ for Arabic writers everywhere.
