import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, Sparkles, Save, Download, ChevronRight, ChevronLeft, BarChart3, Settings, CheckCircle2, Flame, Zap } from 'lucide-react';

const ArabicBookWriter = () => {
  // Core state
  const [sentences, setSentences] = useState([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [mode, setMode] = useState('guided'); // 'sequential', 'free-form', 'guided'
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

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('arabicBook');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setSentences(data.sentences || []);
        setMode(data.mode || 'guided');
        setThemes(data.themes || []);
        setCharacters(data.characters || []);
      } catch (e) {
        console.error('Failed to load saved data');
      }
    }
  }, []);

  // Initialize with empty sentences
  useEffect(() => {
    if (sentences.length === 0) {
      const initial = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        text: '',
        wordCount: 0,
        aiNotes: '',
        completed: false
      }));
      setSentences(initial);
    }
  }, []);

  // Save to localStorage whenever sentences change
  useEffect(() => {
    if (sentences.length > 0) {
      localStorage.setItem('arabicBook', JSON.stringify({
        sentences,
        mode,
        themes,
        characters,
        lastSaved: new Date().toISOString()
      }));
    }
  }, [sentences, mode, themes, characters]);

  // Calculate stats
  useEffect(() => {
    const totalWords = sentences.reduce((sum, s) => sum + (s.text?.split(/\s+/).length || 0), 0);
    const completedCount = sentences.filter(s => s.text.trim().length > 0).length;
    const avgLength = completedCount > 0 ? Math.round(totalWords / completedCount) : 0;
    setStats({ totalWords, avgSentenceLength: avgLength });

    // Check for milestones
    const completed = sentences.filter(s => s.text.trim().length > 0).length;
    if ([25, 50, 75, 100].includes(completed) && sentences[completed - 1]?.text) {
      setShowMilestone(completed);
      setTimeout(() => setShowMilestone(null), 3000);
    }
  }, [sentences]);

  // Get AI feedback for Arabic text
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
              content: `أنت محرر عربي متخصص في تحسين النصوص الأدبية. قيّم الجملة التالية وقدم تحسينات إذا لزم الأمر. ركز على: الإيقاع، اختيار الكلمات، التدفق، والجمال الأدبي. الرد يجب أن يكون موجزاً وفي 2-3 جمل فقط.

الجملة: "${text}"

رد على شكل:
- نقاط قوة: [...]
- اقتراح تحسين (اختياري): [...]`
            }
          ]
        })
      });

      const data = await response.json();
      const suggestion = data.content?.[0]?.text || 'لا توجد ملاحظات';
      setAiSuggestion(suggestion);
    } catch (error) {
      console.error('API Error:', error);
      setAiSuggestion('خطأ في الاتصال - تحقق من مفتاح API');
    }
    setIsLoadingAI(false);
  }, []);

  // Update sentence text
  const updateSentence = (index, text) => {
    const newSentences = [...sentences];
    newSentences[index] = {
      ...newSentences[index],
      text,
      wordCount: text.split(/\s+/).length,
      completed: text.trim().length > 0
    };
    setSentences(newSentences);
    getAIFeedback(text);
  };

  // Navigation
  const goToSentence = (index) => {
    setCurrentSentenceIndex(Math.max(0, Math.min(99, index)));
    setAiSuggestion('');
  };

  const currentSentence = sentences[currentSentenceIndex];
  const completedCount = sentences.filter(s => s.completed).length;
  const progressPercent = (completedCount / 100) * 100;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950 text-slate-50' : 'bg-amber-50 text-slate-900'}`}
      dir="rtl"
      style={{
        fontFamily: '"Arabic Typesetting", "Amiri", "Droid Arabic Naskh", serif',
        backgroundImage: theme === 'dark' 
          ? 'radial-gradient(circle at 20% 50%, rgba(120,80,60,0.1) 0%, transparent 50%)'
          : 'radial-gradient(circle at 80% 80%, rgba(217,119,6,0.08) 0%, transparent 50%)'
      }}
    >
      {/* Header */}
      <header className={`border-b ${theme === 'dark' ? 'border-slate-800 bg-slate-900/50' : 'border-amber-200 bg-white/40'} backdrop-blur sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              ورشة الكتابة العربية
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700' : 'bg-amber-100 hover:bg-amber-200'}`}
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>
            <button
              onClick={() => setShowThemePanel(!showThemePanel)}
              className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700' : 'bg-amber-100 hover:bg-amber-200'}`}
              title="الشخصيات والمواضيع"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Milestone Celebration */}
      {showMilestone && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-40">
          <div className="animate-bounce text-center">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-3xl font-bold text-orange-600">{showMilestone} جملة مكتملة!</p>
            <p className="text-lg text-slate-600 mt-2">تقدم رائع! استمر في الكتابة 🌟</p>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2">
            {/* Mode Selector */}
            <div className={`rounded-xl border mb-6 p-4 ${theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-amber-200 bg-white/60'}`}>
              <label className="block text-sm font-semibold mb-3">أسلوب الكتابة:</label>
              <div className="flex gap-3 flex-wrap">
                {[
                  { id: 'sequential', label: '📝 متسلسل', desc: 'اكتب من الجملة 1 إلى 100' },
                  { id: 'free-form', label: '🎨 حر', desc: 'اكتب أي جملة' },
                  { id: 'guided', label: '✨ موجه', desc: 'احصل على اقتراحات' }
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`flex-1 p-3 rounded-lg transition-all ${mode === m.id
                      ? theme === 'dark'
                        ? 'bg-orange-600 text-white'
                        : 'bg-orange-500 text-white'
                      : theme === 'dark'
                      ? 'bg-slate-700 hover:bg-slate-600'
                      : 'bg-amber-100 hover:bg-amber-200'
                    }`}
                    title={m.desc}
                  >
                    <span className="text-sm font-medium">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sentence Editor */}
            {currentSentence && (
              <div className={`rounded-xl border p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-amber-200 bg-white/60'}`}>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-lg font-semibold">الجملة {currentSentenceIndex + 1} من 100</label>
                    <span className={`text-sm px-3 py-1 rounded-full ${currentSentence.completed ? 'bg-green-500/20 text-green-700' : 'bg-gray-400/20'}`}>
                      {currentSentence.wordCount} كلمة
                    </span>
                  </div>
                  <div className="h-2 bg-gray-300 rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-600 transition-all duration-300"
                      style={{ width: `${(currentSentenceIndex / 100) * 100}%` }}
                    />
                  </div>
                </div>

                <textarea
                  value={currentSentence.text}
                  onChange={(e) => updateSentence(currentSentenceIndex, e.target.value)}
                  placeholder="اكتب جملتك هنا... (اكتب بشكل طبيعي وجميل)"
                  className={`w-full p-4 rounded-lg border-2 focus:outline-none focus:border-orange-500 transition-colors text-lg leading-relaxed ${
                    theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-slate-50'
                      : 'bg-white border-amber-200 text-slate-900'
                  }`}
                  style={{ minHeight: '120px', direction: 'rtl', fontFamily: '"Amiri", serif' }}
                  spellCheck="false"
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
                    <div className="flex gap-2 items-start">
                      {isLoadingAI ? (
                        <>
                          <Zap className="w-5 h-5 text-blue-500 animate-spin mt-1" />
                          <div className="text-sm">جاري تحليل النص...</div>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                          <div className="text-sm whitespace-pre-wrap leading-relaxed">{aiSuggestion}</div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className={`mt-6 flex gap-3 items-center justify-center`}>
              <button
                onClick={() => goToSentence(currentSentenceIndex - 1)}
                disabled={currentSentenceIndex === 0}
                className={`p-2 rounded-lg transition-colors ${
                  currentSentenceIndex === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : theme === 'dark'
                    ? 'bg-slate-700 hover:bg-slate-600'
                    : 'bg-amber-100 hover:bg-amber-200'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <input
                type="number"
                min="1"
                max="100"
                value={currentSentenceIndex + 1}
                onChange={(e) => goToSentence(parseInt(e.target.value) - 1)}
                className={`w-16 p-2 text-center rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-slate-700 border-slate-600'
                    : 'bg-white border-amber-200'
                }`}
              />

              <button
                onClick={() => goToSentence(currentSentenceIndex + 1)}
                disabled={currentSentenceIndex === 99}
                className={`p-2 rounded-lg transition-colors ${
                  currentSentenceIndex === 99
                    ? 'opacity-50 cursor-not-allowed'
                    : theme === 'dark'
                    ? 'bg-slate-700 hover:bg-slate-600'
                    : 'bg-amber-100 hover:bg-amber-200'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sidebar: Stats & Progress */}
          <div className="space-y-6">
            {/* Progress Card */}
            <div className={`rounded-xl border p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-amber-200 bg-white/60'}`}>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                التقدم
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>الجمل المكتملة</span>
                    <span className="font-bold text-orange-600">{completedCount}/100</span>
                  </div>
                  <div className="h-3 bg-gray-300 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
                <div className="pt-3 border-t grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-500">إجمالي الكلمات</div>
                    <div className="text-2xl font-bold text-amber-600">{stats.totalWords}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">متوسط الطول</div>
                    <div className="text-2xl font-bold text-amber-600">{stats.avgSentenceLength}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Streaks & Achievements */}
            <div className={`rounded-xl border p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-amber-200 bg-white/60'}`}>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                الإنجازات
              </h3>
              <div className="space-y-2 text-sm">
                {progressPercent >= 25 && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    الربع الأول ✓
                  </div>
                )}
                {progressPercent >= 50 && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    النصف الأول ✓
                  </div>
                )}
                {progressPercent >= 75 && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    نهاية المطاف ✓
                  </div>
                )}
                {progressPercent === 100 && (
                  <div className="flex items-center gap-2 text-amber-600 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    الكتاب مكتمل! 🎊
                  </div>
                )}
              </div>
            </div>

            {/* Export & Save */}
            <div className={`rounded-xl border p-6 space-y-3 ${theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-amber-200 bg-white/60'}`}>
              <button
                onClick={() => {
                  const text = sentences.map(s => s.text).filter(t => t.trim()).join('\n\n');
                  const element = document.createElement('a');
                  element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
                  element.download = 'كتابي.txt';
                  element.click();
                }}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                تحميل النص
              </button>
              <div className="text-xs text-center text-gray-500">
                <Save className="w-3 h-3 inline mr-1" />
                يتم الحفظ تلقائياً
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Theme Panel */}
      {showThemePanel && (
        <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4`}>
          <div className={`rounded-xl max-w-md w-full p-6 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
            <h2 className="text-xl font-bold mb-4">الشخصيات والمواضيع</h2>

            {/* Add Theme */}
            <div className="mb-4">
              <label className="text-sm font-semibold block mb-2">موضوع جديد:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="مثال: الحب، الوحدة، الأمل..."
                  value={currentTheme}
                  onChange={(e) => setCurrentTheme(e.target.value)}
                  className={`flex-1 p-2 rounded border ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-300'}`}
                />
                <button
                  onClick={() => {
                    if (currentTheme.trim()) {
                      setThemes([...themes, currentTheme]);
                      setCurrentTheme('');
                    }
                  }}
                  className="px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                >
                  ➕
                </button>
              </div>
            </div>

            {/* Themes List */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {themes.map((t, i) => (
                  <div
                    key={i}
                    className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {t}
                    <button
                      onClick={() => setThemes(themes.filter((_, idx) => idx !== i))}
                      className="hover:font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Character */}
            <div className="mb-4">
              <label className="text-sm font-semibold block mb-2">شخصية جديدة:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="اسم الشخصية..."
                  value={currentCharacter}
                  onChange={(e) => setCurrentCharacter(e.target.value)}
                  className={`flex-1 p-2 rounded border ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-300'}`}
                />
                <button
                  onClick={() => {
                    if (currentCharacter.trim()) {
                      setCharacters([...characters, currentCharacter]);
                      setCurrentCharacter('');
                    }
                  }}
                  className="px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                >
                  ➕
                </button>
              </div>
            </div>

            {/* Characters List */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {characters.map((c, i) => (
                  <div
                    key={i}
                    className="bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    👤 {c}
                    <button
                      onClick={() => setCharacters(characters.filter((_, idx) => idx !== i))}
                      className="hover:font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowThemePanel(false)}
              className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArabicBookWriter;
