# 🔧 API Setup & Arabic Language Features Guide

## 🤖 Claude AI Integration

### How It Works

The app uses **Anthropic's Claude API** to provide real-time Arabic text feedback and suggestions. When you write a sentence, Claude analyzes it for:

- **Grammar & Syntax** (القواعد والصيغة)
- **Eloquence & Style** (الفصاحة والأسلوب)
- **Word Choice** (اختيار الكلمات)
- **Flow & Rhythm** (التدفق والإيقاع)
- **Literary Quality** (الجودة الأدبية)

---

## 🔑 Getting Your API Key

### Step 1: Create an Anthropic Account
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up with email
3. Verify your email
4. Create a billing account

### Step 2: Generate API Key
1. In the Console, click **"API Keys"** in the sidebar
2. Click **"Create Key"**
3. Give it a name: `Arabic Book Writer`
4. Copy the key (you'll only see it once!)
5. Save it somewhere safe

### Step 3: Set Up for Local Development

**Option A: Add to `.env` file**
```
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

**Option B: Prompt for key in app**
The app will ask for your API key when you first use the AI feedback feature.

---

## 🌍 Arabic Language Support Details

### Supported Arabic Variants

The app is optimized for **Modern Standard Arabic (MSA)** - الفصحى:
- Classical yet contemporary
- Used in formal writing, literature, and news
- Universally understood across Arab world
- Perfect for literary works

### Why Our Arabic is Excellent

#### 1. **Font Stack**
The app uses a carefully curated font hierarchy:
```css
"Amiri", "Arabic Typesetting", "Droid Arabic Naskh", serif
```

**Why these fonts:**
- **Amiri**: Beautiful, readable, literary feel
- **Arabic Typesetting**: Professional fallback
- **Droid Arabic Naskh**: Universal compatibility
- **Serif**: Traditional typography for serious writing

#### 2. **RTL (Right-to-Left) Implementation**
```html
<html lang="ar" dir="rtl">
```

**Features:**
- Proper text direction
- Correct input field behavior
- Logical DOM order
- Mirrored UI elements

#### 3. **Unicode Full Support**
- All Arabic diacritical marks (التشكيل)
  - Fatha (فَتْحَة): َ
  - Damma (ضَمَّة): ُ
  - Kasra (كَسْرَة): ِ
  - Shadda (شَدَّة): ّ
  - Sukun (سُكُون): ْ
  - And more...

---

## 📝 AI Feedback System

### How to Get the Best Feedback

#### 1. **Write Naturally First**
```
Not ideal: اكتب جملة قصيرة جداً
Better: اكتب جملة متوازنة الطول تحتوي على أفكار واضحة ومعبرة
```

#### 2. **Use Complete Sentences**
The AI works better with:
- Full grammatically complete sentences
- Proper sentence structure
- Meaningful content

#### 3. **Check Feedback Suggestions**
Each feedback includes:
- **نقاط قوة** (Strengths): What works well
- **اقتراح تحسين** (Improvement Suggestion): Optional refinement

---

## 🎯 AI Prompt Engineering

### Default Arabic Prompt (in App)

```javascript
const prompt = `
أنت محرر عربي متخصص في تحسين النصوص الأدبية. قيّم الجملة التالية وقدم تحسينات إذا لزم الأمر. 
ركز على: الإيقاع، اختيار الكلمات، التدفق، والجمال الأدبي. 
الرد يجب أن يكون موجزاً وفي 2-3 جمل فقط.

الجملة: "${text}"

رد على شكل:
- نقاط قوة: [...]
- اقتراح تحسين (اختياري): [...]
`
```

### How to Customize the Prompt

Edit the prompt in `ArabicBookWriter.jsx` around line 130:

```javascript
const getAIFeedback = useCallback(async (text) => {
  if (!text.trim()) {
    setAiSuggestion('');
    return;
  }

  setIsLoadingAI(true);
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            // ✨ EDIT THIS PART:
            content: `أنت محرر عربي متخصص...` // Your custom prompt here
          }
        ]
      })
    });
    // ... rest of function
  }
}, []);
```

### Example Custom Prompts

#### For Poetry
```javascript
content: `أنت متخصص في الشعر العربي. قيّم هذا البيت من حيث:
- الوزن الشعري
- القافية والروي
- الصور البيانية
- الجمال الصوتي

البيت: "${text}"`
```

#### For Dialogue
```javascript
content: `أنت متخصص في الحوار الروائي. قيّم هذا الحوار من حيث:
- الطبيعية والصدقية
- شخصية الشخصيات
- الإيقاع والديناميكية

الحوار: "${text}"`
```

#### For Descriptive Writing
```javascript
content: `أنت متخصص في الكتابة الوصفية. قيّم هذا الوصف من حيث:
- الحيوية والألوان
- الحواس الخمس
- الجمال الأدبي
- الوضوح

الوصف: "${text}"`
```

---

## 🔍 Common Arabic Writing Issues & Solutions

### Issue 1: Diacritical Marks Not Showing
**Solution**: They display correctly; it's your font setting

### Issue 2: Text Direction Wrong
**Solution**: Make sure browser language is set to Arabic or refresh with Ctrl+F5

### Issue 3: AI Feedback Not Appearing
**Troubleshoot**:
1. Check if API key is set
2. Check browser console for errors (F12)
3. Ensure sentence has meaningful text
4. Wait 2-3 seconds for API response

### Issue 4: Words Look "Broken"
**Solution**: This is normal for Arabic text - font is rendering correctly

---

## 📚 Arabic Typography Best Practices

### For Beautiful Arabic Writing:

#### 1. **Sentence Length**
- Ideal: 15-25 words
- Minimum: 5-7 words
- Maximum: 35+ words (can work but harder to read)

#### 2. **Word Choice**
- Use precise, specific words
- Avoid repetition
- Vary your vocabulary

#### 3. **Grammar**
- Use proper case ending (إعراب)
- Correct verb conjugation (تصريف)
- Proper preposition usage

#### 4. **Style**
- Be consistent with tone
- Use metaphors sparingly but effectively
- Balance simple and complex sentences

---

## 🚀 Advanced API Usage

### Using a Different Claude Model

Edit the model name in API call:

```javascript
body: JSON.stringify({
  model: 'claude-opus-4-20250805', // Change this line
  // OR: 'claude-haiku-3-5-20241022' for faster, lighter feedback
  max_tokens: 500,
  // ...
})
```

**Available models**:
- `claude-opus-4-20250805` - Most intelligent
- `claude-sonnet-4-20250514` - Best balance (default)
- `claude-haiku-3-5-20241022` - Fastest

### Adjusting Response Length

```javascript
max_tokens: 500  // Current: ~200 words
// Increase to 1000 for longer feedback
// Decrease to 200 for brief suggestions
```

---

## 💰 API Costs

**Anthropic Pricing** (as of 2024):
- **Input tokens**: ~$0.003 per 1M tokens
- **Output tokens**: ~$0.015 per 1M tokens

**Per 100 sentences**:
- Approximately: $0.10-0.20
- Average sentence: 15-20 words = 50-100 tokens

**Tips to reduce costs**:
1. Only use AI when you want feedback
2. Use shorter sentences
3. Batch multiple sentences together

---

## 🔒 Security & Privacy

### API Key Security
- ✅ **DO**: Use environment variables in production
- ✅ **DO**: Keep key secret and rotate regularly
- ❌ **DON'T**: Commit API key to GitHub
- ❌ **DON'T**: Expose key in browser console

### Data Privacy
- All text processing happens in Claude's secure servers
- No data is stored on your device beyond localStorage
- Check Anthropic's privacy policy for details

---

## 🐛 Debugging

### Enable Console Logging

Add this to `ArabicBookWriter.jsx`:

```javascript
const getAIFeedback = useCallback(async (text) => {
  console.log('Sending text:', text); // Add this
  
  try {
    const response = await fetch('...', {
      // ...
    });
    const data = await response.json();
    console.log('API Response:', data); // Add this
    // ...
  } catch (error) {
    console.error('API Error:', error); // Already exists
  }
}, []);
```

### Check Browser Developer Tools
1. Press F12
2. Go to Network tab
3. Look for requests to `api.anthropic.com`
4. Check response status and content

---

## 🔗 Useful Resources

- [Anthropic API Docs](https://docs.anthropic.com)
- [Claude Model Card](https://www.anthropic.com/claude)
- [Arabic Language Resources](https://www.almaany.com)
- [Unicode Arabic Block](https://unicode.org/charts/PDF/U0600.pdf)

---

## ✨ Tips for Best Results

1. **Short Feedback Rounds**: Ask for feedback on 5-10 sentences at a time
2. **Iterate**: Write → Get feedback → Refine → Move on
3. **Track Themes**: Use the theme panel to maintain consistency
4. **Celebrate Progress**: Aim for quality over speed
5. **Experiment**: Try different writing modes

---

**Happy Writing with AI Support! كتابة سعيدة مع دعم ذكي! 🚀**
