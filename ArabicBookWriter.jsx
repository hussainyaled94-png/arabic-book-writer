import React, { useState, useEffect, useCallback } from 'react';

const ArabicBookWriter = () => {
  // Writing state
  const [sentences, setSentences] = useState([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [mode, setMode] = useState('guided');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [theme, setTheme] = useState('light');
  const [stats, setStats] = useState({ totalWords: 0, avgSentenceLength: 0 });
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [themes, setThemes] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [currentTheme, setCurrentTheme] = useState('');
  const [currentCharacter, setCurrentCharacter] = useState('');
  const [showMilestone, setShowMilestone] = useState(null);
  const [activeTab, setActiveTab] = useState('writing');
  const [showModeHelp, setShowModeHelp] = useState(false);

  // Book design state
  const [bookDesign, setBookDesign] = useState({
    title: '',
    author: '',
    authorBio: '',
    description: '',
    category: 'رواية',
    isbn: '',
    publicationDate: new Date().toISOString().split('T')[0],
    dedication: '',
    foreword: '',
    includeTableOfContents: true,
    coverType: 'text',
    coverPrompt: 'كتاب جميل',
    coverImage: null,
    backgroundColor: '#F5E6D3'
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('arabicBook');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setSentences(data.sentences || []);
        setMode(data.mode || 'guided');
        setThemes(data.themes || []);
        setCharacters(data.characters || []);
        setBookDesign({ ...bookDesign, ...data.bookDesign });
      } catch (e) {
        console.error('Load error');
      }
    }
  }, []);

  // Initialize sentences
  useEffect(() => {
    if (sentences.length === 0) {
      const initial = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        text: '',
        wordCount: 0,
        completed: false
      }));
      setSentences(initial);
    }
  }, [sentences.length]);

  // Save to localStorage
  useEffect(() => {
    if (sentences.length > 0) {
      localStorage.setItem('arabicBook', JSON.stringify({
        sentences, mode, themes, characters, bookDesign,
        lastSaved: new Date().toISOString()
      }));
    }
  }, [sentences, mode, themes, characters, bookDesign]);

  // Stats
  useEffect(() => {
    const totalWords = sentences.reduce((sum, s) => sum + (s.text?.split(/\s+/).length || 0), 0);
    const completedCount = sentences.filter(s => s.text.trim().length > 0).length;
    const avgLength = completedCount > 0 ? Math.round(totalWords / completedCount) : 0;
    setStats({ totalWords, avgSentenceLength: avgLength });

    if ([25, 50, 75, 100].includes(completedCount)) {
      setShowMilestone(completedCount);
      setTimeout(() => setShowMilestone(null), 3000);
    }
  }, [sentences]);

  // AI Feedback
  const getAIFeedback = useCallback(async (text) => {
    if (!text.trim()) {
      setAiSuggestion('');
      return;
    }

    setIsLoadingAI(true);
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          messages: [{
            role: 'user',
            content: `أنت محرر عربي. قيّم هذه الجملة وقدم تحسينات (2-3 جمل فقط):

الجملة: "${text}"

الرد:
- نقاط قوة: [...]
- اقتراح: [...]`
          }]
        })
      });

      const data = await response.json();
      setAiSuggestion(data.content?.[0]?.text || 'لا توجد ملاحظات');
    } catch (error) {
      setAiSuggestion('خطأ في الاتصال - تحقق من مفتاح API');
    }
    setIsLoadingAI(false);
  }, []);

  // Update sentence
  const updateSentence = (index, text) => {
    const newSentences = [...sentences];
    newSentences[index] = {
      ...newSentences[index],
      text,
      wordCount: text.split(/\s+/).length,
      completed: text.trim().length > 0
    };
    setSentences(newSentences);

    if (mode === 'guided') {
      getAIFeedback(text);
    }
  };

  // Navigate
  const goToSentence = (index) => {
    const newIndex = Math.max(0, Math.min(99, index));
    
    if (mode === 'sequential') {
      const completed = sentences.filter(s => s.completed).length;
      if (newIndex <= completed) {
        setCurrentSentenceIndex(newIndex);
      }
    } else {
      setCurrentSentenceIndex(newIndex);
    }
    setAiSuggestion('');
  };

  const currentSentence = sentences[currentSentenceIndex];
  const completedCount = sentences.filter(s => s.completed).length;
  const progressPercent = (completedCount / 100) * 100;

  const modeInfo = {
    sequential: {
      label: '📝 متسلسل',
      desc: 'اكتب من 1 إلى 100 بالترتيب',
      longDesc: 'اكتب الجملة الأولى ثم الثانية وهكذا. يمكنك فقط الانتقال للجملة التالية بعد إكمال السابقة.',
      example: 'مثال: قصة تبدأ من البداية (الجملة 1) وتتطور تدريجياً إلى النهاية (الجملة 100)'
    },
    'free-form': {
      label: '🎨 حر',
      desc: 'اكتب أي جملة في أي وقت',
      longDesc: 'انتقل بحرية بين جميع الجمل (100 ← 10 ← 50). مثالي للكتاب الإبداعيين.',
      example: 'مثال: ابدأ بأقوى مشهد (الجملة 75)، ثم البداية (1-10)، ثم الخاتمة'
    },
    guided: {
      label: '✨ موجه',
      desc: 'اكتب واحصل على اقتراحات ذكية فوراً',
      longDesc: 'الذكاء الاصطناعي يقرأ كل جملة وقدم تحسينات فورية للقواعس والأسلوب.',
      example: 'مثال: اكتب "السماء زرقاء" وسيقترح "السماء امتدت زرقاء كالعمق"'
    }
  };

  const info = modeInfo[mode];

  // ============ WRITING TAB ============
  if (activeTab === 'writing') {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-slate-50' : 'bg-amber-50 text-slate-900'}`}
        dir="rtl"
        style={{ fontFamily: '"Arabic Typesetting", "Amiri", serif' }}
      >
        {/* Header */}
        <header className={`border-b ${theme === 'dark' ? 'border-slate-800 bg-slate-900/50' : 'border-amber-200 bg-white/40'} backdrop-blur sticky top-0 z-50`}>
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-3xl">
                📖
              </div>
              <h1 style={{ fontSize: '32px' }} className="font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                ورشة الكتابة العربية
              </h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-4 border-b border-amber-200">
              <button
                onClick={() => setActiveTab('writing')}
                style={{ fontSize: '18px' }}
                className={`pb-3 px-4 font-bold ${activeTab === 'writing' ? 'border-b-4 border-orange-600 text-orange-600' : 'text-gray-600'}`}
              >
                ✍️ الكتابة
              </button>
              <button
                onClick={() => setActiveTab('design')}
                style={{ fontSize: '18px' }}
                className={`pb-3 px-4 font-bold ${activeTab === 'design' ? 'border-b-4 border-orange-600 text-orange-600' : 'text-gray-600'}`}
              >
                📚 تصميم الكتاب
              </button>
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                style={{ fontSize: '20px' }}
                className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-amber-100'}`}
              >
                {theme === 'dark' ? '🌙' : '☀️'}
              </button>
              <button
                onClick={() => setShowThemePanel(!showThemePanel)}
                style={{ fontSize: '20px' }}
                className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-amber-100'}`}
              >
                ⚙️
              </button>
            </div>
          </div>
        </header>

        {/* Milestone */}
        {showMilestone && (
          <div className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none">
            <div className="text-center">
              <div style={{ fontSize: '60px' }} className="mb-4">🎉</div>
              <p style={{ fontSize: '28px' }} className="font-bold text-orange-600">{showMilestone} جملة!</p>
              <p style={{ fontSize: '18px' }} className="text-slate-600 mt-2">رائع! استمر 🌟</p>
            </div>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Editor */}
            <div className="lg:col-span-2">
              {/* Mode Selector */}
              <div className={`rounded-xl border p-6 mb-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-amber-200 bg-white/60'}`}>
                <label style={{ fontSize: '18px' }} className="block font-bold mb-4">أسلوب الكتابة:</label>
                <div className="flex gap-3 flex-wrap mb-4">
                  {['sequential', 'free-form', 'guided'].map(m => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      style={{ fontSize: '16px' }}
                      className={`flex-1 p-4 rounded-lg transition-all font-bold ${mode === m
                        ? 'bg-orange-500 text-white'
                        : theme === 'dark'
                        ? 'bg-slate-700'
                        : 'bg-amber-100'
                      }`}
                    >
                      {modeInfo[m].label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowModeHelp(!showModeHelp)}
                  style={{ fontSize: '16px' }}
                  className="text-orange-600 font-bold"
                >
                  ❓ {showModeHelp ? 'أخفِ' : 'اشرح'} هذا الأسلوب
                </button>

                {showModeHelp && (
                  <div className={`p-4 rounded-lg mt-3 ${theme === 'dark' ? 'bg-slate-700' : 'bg-amber-50'}`}>
                    <p style={{ fontSize: '16px' }} className="font-bold mb-2">{info.label}</p>
                    <p style={{ fontSize: '15px' }} className="mb-3">{info.longDesc}</p>
                    <p style={{ fontSize: '15px' }} className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      📌 {info.example}
                    </p>
                  </div>
                )}
              </div>

              {/* Sentence Editor */}
              {currentSentence && (
                <div className={`rounded-xl border p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-amber-200 bg-white/60'}`}>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <label style={{ fontSize: '20px' }} className="font-bold">الجملة {currentSentenceIndex + 1} من 100</label>
                      <span style={{ fontSize: '16px' }} className={`px-3 py-2 rounded-full ${currentSentence.completed ? 'bg-green-500/20 text-green-700' : 'bg-gray-400/20'}`}>
                        {currentSentence.wordCount} كلمة
                      </span>
                    </div>
                    <div className="h-4 bg-gray-300 rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-600"
                        style={{ width: `${(currentSentenceIndex / 100) * 100}%` }}
                      />
                    </div>
                  </div>

                  <textarea
                    value={currentSentence.text}
                    onChange={(e) => updateSentence(currentSentenceIndex, e.target.value)}
                    placeholder="اكتب جملتك هنا..."
                    style={{ fontSize: '18px' }}
                    className={`w-full p-4 rounded-lg border-2 focus:outline-none focus:border-orange-500 ${
                      theme === 'dark'
                        ? 'bg-slate-700 border-slate-600 text-slate-50'
                        : 'bg-white border-amber-200 text-slate-900'
                    }`}
                    dir="rtl"
                    minHeight="150px"
                  />

                  {/* AI Feedback */}
                  {(aiSuggestion || isLoadingAI) && (
                    <div className={`mt-4 p-4 rounded-lg border-l-4 ${
                      isLoadingAI
                        ? theme === 'dark'
                          ? 'bg-slate-700/50 border-blue-500'
                          : 'bg-blue-50 border-blue-400'
                        : theme === 'dark'
                        ? 'bg-amber-900/30 border-amber-500'
                        : 'bg-amber-50 border-amber-500'
                    }`}>
                      <div className="flex gap-3 items-start">
                        <span style={{ fontSize: '20px' }}>
                          {isLoadingAI ? '⚡' : '✨'}
                        </span>
                        <div style={{ fontSize: '16px' }}>
                          {isLoadingAI ? 'جاري التحليل...' : aiSuggestion}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="mt-6 flex gap-3 items-center justify-center">
                <button
                  onClick={() => goToSentence(currentSentenceIndex - 1)}
                  disabled={currentSentenceIndex === 0}
                  style={{ fontSize: '18px' }}
                  className={`p-3 rounded-lg ${
                    currentSentenceIndex === 0
                      ? 'opacity-50 cursor-not-allowed'
                      : theme === 'dark'
                      ? 'bg-slate-700'
                      : 'bg-amber-100'
                  }`}
                >
                  ←
                </button>

                <input
                  type="number"
                  min="1"
                  max="100"
                  value={currentSentenceIndex + 1}
                  onChange={(e) => goToSentence(parseInt(e.target.value) - 1)}
                  style={{ fontSize: '16px' }}
                  className={`w-20 p-3 text-center rounded-lg border font-bold ${
                    theme === 'dark'
                      ? 'bg-slate-700 border-slate-600'
                      : 'bg-white border-amber-200'
                  }`}
                />

                <button
                  onClick={() => goToSentence(currentSentenceIndex + 1)}
                  disabled={currentSentenceIndex === 99}
                  style={{ fontSize: '18px' }}
                  className={`p-3 rounded-lg ${
                    currentSentenceIndex === 99
                      ? 'opacity-50 cursor-not-allowed'
                      : theme === 'dark'
                      ? 'bg-slate-700'
                      : 'bg-amber-100'
                  }`}
                >
                  →
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Progress */}
              <div className={`rounded-xl border p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-amber-200 bg-white/60'}`}>
                <h3 style={{ fontSize: '18px' }} className="font-bold mb-4">📊 التقدم</h3>
                <div className="space-y-3">
                  <div>
                    <div style={{ fontSize: '14px' }} className="flex justify-between mb-2 font-bold">
                      <span>الجمل المكتملة</span>
                      <span className="text-orange-600">{completedCount}/100</span>
                    </div>
                    <div className="h-4 bg-gray-300 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                  <div style={{ fontSize: '15px' }} className="pt-3 border-t grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-500">إجمالي الكلمات</div>
                      <div className="text-2xl font-bold text-orange-600">{stats.totalWords}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">متوسط الطول</div>
                      <div className="text-2xl font-bold text-orange-600">{stats.avgSentenceLength}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className={`rounded-xl border p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-amber-200 bg-white/60'}`}>
                <h3 style={{ fontSize: '18px' }} className="font-bold mb-4">🔥 الإنجازات</h3>
                <div style={{ fontSize: '15px' }} className="space-y-2">
                  {progressPercent >= 25 && <div className="text-green-600 font-bold">✓ الربع الأول</div>}
                  {progressPercent >= 50 && <div className="text-green-600 font-bold">✓ النصف الأول</div>}
                  {progressPercent >= 75 && <div className="text-green-600 font-bold">✓ نهاية المطاف</div>}
                  {progressPercent === 100 && <div className="text-amber-600 font-bold">✓ مكتمل! 🎊</div>}
                </div>
              </div>

              {/* Export */}
              <div className={`rounded-xl border p-6 space-y-3 ${theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-amber-200 bg-white/60'}`}>
                <button
                  onClick={() => setActiveTab('design')}
                  style={{ fontSize: '16px' }}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg hover:shadow-lg font-bold"
                >
                  📚 تصميم وتحميل
                </button>
                <div style={{ fontSize: '13px' }} className="text-center text-gray-500">
                  💾 يتم الحفظ تلقائياً
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Theme Panel */}
        {showThemePanel && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`rounded-xl max-w-md w-full p-6 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
              <h2 style={{ fontSize: '20px' }} className="font-bold mb-4">الشخصيات والمواضيع</h2>

              <div className="mb-4">
                <label style={{ fontSize: '16px' }} className="font-bold block mb-2">موضوع:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="الحب، الوحدة..."
                    value={currentTheme}
                    onChange={(e) => setCurrentTheme(e.target.value)}
                    style={{ fontSize: '15px' }}
                    className={`flex-1 p-3 rounded border ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-300'}`}
                  />
                  <button
                    onClick={() => {
                      if (currentTheme.trim()) {
                        setThemes([...themes, currentTheme]);
                        setCurrentTheme('');
                      }
                    }}
                    style={{ fontSize: '18px' }}
                    className="px-4 py-3 bg-orange-500 text-white rounded hover:bg-orange-600"
                  >
                    ➕
                  </button>
                </div>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {themes.map((t, i) => (
                  <div key={i} style={{ fontSize: '14px' }} className="bg-amber-100 text-amber-900 px-3 py-2 rounded-full flex items-center gap-2">
                    {t}
                    <button onClick={() => setThemes(themes.filter((_, idx) => idx !== i))}>✕</button>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <label style={{ fontSize: '16px' }} className="font-bold block mb-2">شخصية:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="اسم الشخصية"
                    value={currentCharacter}
                    onChange={(e) => setCurrentCharacter(e.target.value)}
                    style={{ fontSize: '15px' }}
                    className={`flex-1 p-3 rounded border ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-300'}`}
                  />
                  <button
                    onClick={() => {
                      if (currentCharacter.trim()) {
                        setCharacters([...characters, currentCharacter]);
                        setCurrentCharacter('');
                      }
                    }}
                    style={{ fontSize: '18px' }}
                    className="px-4 py-3 bg-orange-500 text-white rounded"
                  >
                    ➕
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {characters.map((c, i) => (
                  <div key={i} style={{ fontSize: '14px' }} className="bg-blue-100 text-blue-900 px-3 py-2 rounded-full flex items-center gap-2">
                    👤 {c}
                    <button onClick={() => setCharacters(characters.filter((_, idx) => idx !== i))}>✕</button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowThemePanel(false)}
                style={{ fontSize: '16px' }}
                className="w-full py-3 bg-orange-500 text-white rounded-lg font-bold"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============ BOOK DESIGN TAB ============
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-slate-50' : 'bg-amber-50 text-slate-900'}`}
      dir="rtl"
      style={{ fontFamily: '"Arabic Typesetting", "Amiri", serif' }}
    >
      {/* Header */}
      <header className={`border-b ${theme === 'dark' ? 'border-slate-800 bg-slate-900/50' : 'border-amber-200 bg-white/40'} backdrop-blur sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-3xl">
              📖
            </div>
            <h1 style={{ fontSize: '32px' }} className="font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              تصميم الكتاب
            </h1>
          </div>

          <div className="flex gap-4 border-b border-amber-200">
            <button
              onClick={() => setActiveTab('writing')}
              style={{ fontSize: '18px' }}
              className={`pb-3 px-4 font-bold ${activeTab === 'writing' ? 'border-b-4 border-orange-600 text-orange-600' : 'text-gray-600'}`}
            >
              ✍️ الكتابة
            </button>
            <button
              onClick={() => setActiveTab('design')}
              style={{ fontSize: '18px' }}
              className={`pb-3 px-4 font-bold ${activeTab === 'design' ? 'border-b-4 border-orange-600 text-orange-600' : 'text-gray-600'}`}
            >
              📚 تصميم الكتاب
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className={`rounded-xl border p-8 ${theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-amber-200 bg-white/60'}`}>
            <h2 style={{ fontSize: '24px' }} className="font-bold mb-6">معلومات الكتاب</h2>

            <div className="space-y-5 mb-6">
              <div>
                <label style={{ fontSize: '16px' }} className="block font-bold mb-2">عنوان الكتاب *</label>
                <input
                  type="text"
                  value={bookDesign.title}
                  onChange={(e) => setBookDesign({ ...bookDesign, title: e.target.value })}
                  placeholder="عنوان كتابك"
                  style={{ fontSize: '16px' }}
                  className={`w-full p-3 rounded border focus:outline-none focus:border-orange-500 ${
                    theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-amber-200'
                  }`}
                />
              </div>

              <div>
                <label style={{ fontSize: '16px' }} className="block font-bold mb-2">اسم المؤلف *</label>
                <input
                  type="text"
                  value={bookDesign.author}
                  onChange={(e) => setBookDesign({ ...bookDesign, author: e.target.value })}
                  placeholder="اسمك"
                  style={{ fontSize: '16px' }}
                  className={`w-full p-3 rounded border ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-amber-200'}`}
                />
              </div>

              <div>
                <label style={{ fontSize: '16px' }} className="block font-bold mb-2">السيرة الذاتية *</label>
                <textarea
                  value={bookDesign.authorBio}
                  onChange={(e) => setBookDesign({ ...bookDesign, authorBio: e.target.value })}
                  placeholder="نبذة عن المؤلف"
                  style={{ fontSize: '16px' }}
                  className={`w-full p-3 rounded border ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-amber-200'}`}
                  rows="3"
                />
              </div>

              <div>
                <label style={{ fontSize: '16px' }} className="block font-bold mb-2">وصف الكتاب *</label>
                <textarea
                  value={bookDesign.description}
                  onChange={(e) => setBookDesign({ ...bookDesign, description: e.target.value })}
                  placeholder="ملخص الكتاب"
                  style={{ fontSize: '16px' }}
                  className={`w-full p-3 rounded border ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-amber-200'}`}
                  rows="3"
                />
              </div>

              <div>
                <label style={{ fontSize: '16px' }} className="block font-bold mb-2">الفئة *</label>
                <select
                  value={bookDesign.category}
                  onChange={(e) => setBookDesign({ ...bookDesign, category: e.target.value })}
                  style={{ fontSize: '16px' }}
                  className={`w-full p-3 rounded border ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-amber-200'}`}
                >
                  <option>رواية</option>
                  <option>قصة قصيرة</option>
                  <option>شعر</option>
                  <option>مقالات</option>
                  <option>دراسة</option>
                  <option>أخرى</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '16px' }} className="block font-bold mb-2">تاريخ النشر *</label>
                <input
                  type="date"
                  value={bookDesign.publicationDate}
                  onChange={(e) => setBookDesign({ ...bookDesign, publicationDate: e.target.value })}
                  style={{ fontSize: '16px' }}
                  className={`w-full p-3 rounded border ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-amber-200'}`}
                />
              </div>

              <div>
                <label style={{ fontSize: '16px' }} className="block font-bold mb-2">ISBN (اختياري)</label>
                <input
                  type="text"
                  value={bookDesign.isbn}
                  onChange={(e) => setBookDesign({ ...bookDesign, isbn: e.target.value })}
                  placeholder="ISBN"
                  style={{ fontSize: '16px' }}
                  className={`w-full p-3 rounded border ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-amber-200'}`}
                />
              </div>

              <div>
                <label style={{ fontSize: '16px' }} className="block font-bold mb-2">الإهداء *</label>
                <textarea
                  value={bookDesign.dedication}
                  onChange={(e) => setBookDesign({ ...bookDesign, dedication: e.target.value })}
                  placeholder="إلى أمي التي..."
                  style={{ fontSize: '16px' }}
                  className={`w-full p-3 rounded border ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-amber-200'}`}
                  rows="2"
                />
              </div>

              <div>
                <label style={{ fontSize: '16px' }} className="block font-bold mb-2">المقدمة *</label>
                <textarea
                  value={bookDesign.foreword}
                  onChange={(e) => setBookDesign({ ...bookDesign, foreword: e.target.value })}
                  placeholder="مقدمة الكتاب"
                  style={{ fontSize: '16px' }}
                  className={`w-full p-3 rounded border ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-amber-200'}`}
                  rows="3"
                />
              </div>
            </div>

            {/* Cover Design */}
            <h3 style={{ fontSize: '22px' }} className="font-bold mb-4">تصميم الغلاف</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label style={{ fontSize: '16px' }} className="block font-bold mb-3">نوع الغلاف:</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setBookDesign({ ...bookDesign, coverType: 'text' })}
                    style={{ fontSize: '15px' }}
                    className={`flex-1 p-3 rounded font-bold ${
                      bookDesign.coverType === 'text' ? 'bg-orange-500 text-white' : theme === 'dark' ? 'bg-slate-700' : 'bg-amber-100'
                    }`}
                  >
                    📝 نص
                  </button>
                  <button
                    onClick={() => setBookDesign({ ...bookDesign, coverType: 'image' })}
                    style={{ fontSize: '15px' }}
                    className={`flex-1 p-3 rounded font-bold ${
                      bookDesign.coverType === 'image' ? 'bg-orange-500 text-white' : theme === 'dark' ? 'bg-slate-700' : 'bg-amber-100'
                    }`}
                  >
                    🖼️ صورة
                  </button>
                </div>
              </div>

              {bookDesign.coverType === 'text' && (
                <div>
                  <label style={{ fontSize: '16px' }} className="block font-bold mb-2">لون الخلفية:</label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="color"
                      value={bookDesign.backgroundColor}
                      onChange={(e) => setBookDesign({ ...bookDesign, backgroundColor: e.target.value })}
                      style={{ fontSize: '16px', width: '60px', height: '50px' }}
                      className="rounded cursor-pointer"
                    />
                    <span style={{ fontSize: '16px' }}>{bookDesign.backgroundColor}</span>
                  </div>
                </div>
              )}

              {bookDesign.coverType === 'image' && (
                <div>
                  <label style={{ fontSize: '16px' }} className="block font-bold mb-2">صورة الغلاف:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setBookDesign({ ...bookDesign, coverImage: event.target?.result });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ fontSize: '15px' }}
                    className={`w-full p-3 rounded border ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-amber-200'}`}
                  />
                </div>
              )}
            </div>

            {/* Export */}
            <button
              onClick={() => {
                if (!bookDesign.title || !bookDesign.author) {
                  alert('الرجاء ملء العنوان واسم المؤلف');
                  return;
                }

                const content = `
${bookDesign.title.toUpperCase()}
${'='.repeat(40)}

تأليف: ${bookDesign.author}

${bookDesign.dedication ? `الإهداء:\n${bookDesign.dedication}\n\n` : ''}

المقدمة:
${bookDesign.foreword}

${'='.repeat(40)}
المحتوى
${'='.repeat(40)}

${sentences.filter(s => s.completed).map((s, i) => `${i + 1}. ${s.text}`).join('\n\n')}

${'='.repeat(40)}
عن المؤلف
${'='.repeat(40)}

${bookDesign.authorBio}

النشر: ${bookDesign.publicationDate}
${bookDesign.isbn ? `ISBN: ${bookDesign.isbn}` : ''}
                `;

                const element = document.createElement('a');
                element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
                element.download = `${bookDesign.title}.txt`;
                element.click();
              }}
              style={{ fontSize: '18px' }}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-lg hover:shadow-lg font-bold"
            >
              📥 تحميل الكتاب
            </button>
          </div>

          {/* Preview */}
          <div className={`rounded-xl border p-8 ${theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-amber-200 bg-white/60'}`}>
            <h2 style={{ fontSize: '24px' }} className="font-bold mb-6">معاينة الغلاف</h2>

            <div
              style={{
                backgroundColor: bookDesign.backgroundColor,
                backgroundImage: bookDesign.coverImage ? `url(${bookDesign.coverImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              className="w-full h-96 rounded-lg flex flex-col items-center justify-center text-center p-6 shadow-lg"
            >
              <h1 style={{ fontSize: '28px' }} className="font-bold mb-4 text-white drop-shadow-lg">
                {bookDesign.title || 'عنوان الكتاب'}
              </h1>
              <p style={{ fontSize: '18px' }} className="text-white drop-shadow-lg">
                {bookDesign.author || 'اسم المؤلف'}
              </p>
            </div>

            <div style={{ fontSize: '15px' }} className="mt-6 space-y-3">
              <p><strong>الفئة:</strong> {bookDesign.category}</p>
              <p><strong>عدد الجمل:</strong> {completedCount}/100</p>
              <p><strong>عدد الكلمات:</strong> {stats.totalWords}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArabicBookWriter;
