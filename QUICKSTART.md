# 🚀 Quick Start - Deploy in 2 Minutes

## Fastest Way to Deploy (Vercel)

### Step 1: Prepare Your Repository
```bash
# Clone this repo or create a new one
git clone https://github.com/yourusername/arabic-book-writer.git
cd arabic-book-writer

# Add all files to git
git add .
git commit -m "Add Arabic book writer app"
git push origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Click "Deploy"
5. **Done!** Your app is live 🎉

### Step 3 (Optional): Configure API Key
For AI feedback to work:
1. Get API key from [console.anthropic.com](https://console.anthropic.com)
2. In Vercel dashboard: Settings → Environment Variables
3. Add `ANTHROPIC_API_KEY` with your key
4. Redeploy

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:3000
```

---

## That's It! 🎉

Your Arabic book writing app is now live and ready to use!

**Default AI Mode**: Will prompt for API key when you use AI features
**Production Mode**: Uses environment variable you set in Vercel

---

## Customization

Edit `ArabicBookWriter.jsx` to:
- Change colors (search for `orange-600`)
- Modify AI prompts (search for `أنت محرر عربي`)
- Add new features

---

## Need Help?

- Check the full [README.md](./README.md)
- Review feature documentation
- Test locally before deploying

---

**Happy Writing! كتابة سعيدة! ✍️**
