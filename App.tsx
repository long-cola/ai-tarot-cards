import React, { useState, useEffect } from 'react';
import { AppPhase, DrawnCard, SPREAD_LABELS, Language } from './types';
import { MAJOR_ARCANA, TRANSLATIONS } from './constants';
import { getTarotReading } from './services/geminiService';
import { Card } from './components/Card';
import { StarryBackground } from './components/StarryBackground';
import ReactMarkdown from 'react-markdown';

// Header with Title and Language Switch
const Header = ({ 
  title, 
  onBack, 
  showBack, 
  language, 
  onToggleLanguage 
}: { 
  title: string, 
  onBack?: () => void, 
  showBack: boolean,
  language: Language,
  onToggleLanguage: () => void
}) => (
  <div className="sticky top-0 z-40 w-full pt-4 pb-4 px-4 bg-slate-950/20 backdrop-blur-sm border-b border-white/5 flex items-center justify-between h-[64px] box-border transition-all duration-300">
     <div className="w-12 flex justify-start">
       {showBack && (
         <button onClick={onBack} className="p-2 text-white/80 hover:text-white transition-colors">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
             <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
           </svg>
         </button>
       )}
     </div>
     
     <h1 className="text-[17px] font-medium tracking-wide text-white/90 font-sans shadow-black drop-shadow-md truncate">
       {title}
     </h1>

     <div className="w-12 flex justify-end">
        <button 
          onClick={onToggleLanguage} 
          className="text-xs font-cinzel border border-white/20 bg-white/5 hover:bg-white/10 text-white/80 px-2 py-1 rounded transition-colors"
        >
          {language === 'zh' ? 'EN' : '中'}
        </button>
     </div>
  </div>
);

// Wisdom Loader Component
const WisdomLoader = ({ language }: { language: Language }) => {
  const quotes = language === 'zh' 
    ? [
      "爱情真正的价值，从来不是让你遇见对的人，而是让你照见真的自己。",
      "对方是深情或薄幸、卓越或平庸，都不重要。",
      "重要的是你能否在心动与心碎中，看清自己的贪嗔痴。",
      "情关不是考验对方的战场，而是修练自我的道场。",
      "所有关系的困境，都是内心投射的倒影。",
      "破情关者，破的是对“被爱”的执迷。",
      "见本性者，见的是本自具足的清明。",
      "原来世上从无他人，唯有你与自己的千百种面相。"
    ]
    : [
      "The true value of love is not meeting the right person, but seeing your true self.",
      "Whether they are devoted or fickle, it does not matter.",
      "What matters is seeing your own attachments amidst the heartbreak.",
      "Relationships are not a battlefield, but a dojo for the self.",
      "All relationship dilemmas are reflections of inner projections.",
      "Breaking emotional barriers is breaking the obsession with 'being loved'.",
      "To see one's true nature is to see the clarity within.",
      "There are no others, only the thousand faces of yourself."
    ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 space-y-8 max-w-lg mx-auto text-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-slate-700"></div>
          <div className="absolute inset-0 rounded-full border-2 border-t-amber-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-xl animate-pulse">👁️</span>
          </div>
        </div>
        
        <div className="min-h-[80px] flex items-center justify-center">
          <p className="text-sm md:text-base text-purple-100/90 font-mystic leading-relaxed tracking-wide animate-fade-in key={index}">
            “{quotes[index]}”
          </p>
        </div>
     </div>
  );
};

const App: React.FC = () => {
  const [phase, setPhase] = useState<AppPhase>(AppPhase.INPUT);
  const [question, setQuestion] = useState('');
  const [deck, setDeck] = useState<typeof MAJOR_ARCANA>([]);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [reading, setReading] = useState('');
  const [isReadingLoading, setIsReadingLoading] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [language, setLanguage] = useState<Language>('zh');
  const [errorMsg, setErrorMsg] = useState('');

  const t = TRANSLATIONS[language];
  
  // Initialize Deck
  useEffect(() => {
    setDeck([...MAJOR_ARCANA]);
  }, []);

  // Daily Limit Check
  const checkDailyLimit = (): boolean => {
    const STORAGE_KEY = 'mystic_tarot_usage';
    const MAX_DAILY = 5;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    let usageData = { date: today, count: 0 };
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date === today) {
          usageData = parsed;
        }
      }
    } catch (e) {
      console.warn("Storage error", e);
    }

    if (usageData.count >= MAX_DAILY) {
      return false;
    }

    // Increment and save
    usageData.count += 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usageData));
    return true;
  };

  // Handle Input Submit
  const handleStart = () => {
    if (!question.trim()) return;
    
    // Check limit before starting
    if (!checkDailyLimit()) {
      setErrorMsg(t.limitReached);
      return;
    }
    setErrorMsg('');

    setPhase(AppPhase.SHUFFLING);
  };

  // Shuffle Logic
  useEffect(() => {
    if (phase === AppPhase.SHUFFLING) {
      const shuffleInterval = setInterval(() => {
        setDeck(prev => [...prev].sort(() => Math.random() - 0.5));
      }, 100);

      const timer = setTimeout(() => {
        clearInterval(shuffleInterval);
        setPhase(AppPhase.DRAWING);
      }, 3000);

      return () => {
        clearInterval(shuffleInterval);
        clearTimeout(timer);
      };
    }
  }, [phase]);

  // Draw Logic
  const handleCardDraw = (index: number) => {
    if (drawnCards.length >= 3 || isInteracting) return;

    setIsInteracting(true);

    const selectedBaseCard = deck[index];
    const isReversed = Math.random() > 0.5;
    
    const newCard: DrawnCard = {
      ...selectedBaseCard,
      isReversed,
      position: drawnCards.length
    };

    const newDrawn = [...drawnCards, newCard];
    setDrawnCards(newDrawn);
    
    const newDeck = [...deck];
    newDeck.splice(index, 1);
    setDeck(newDeck);

    if (newDrawn.length === 3) {
      setTimeout(() => setPhase(AppPhase.REVEAL), 1500); 
    } else {
      setTimeout(() => {
        setIsInteracting(false);
      }, 500);
    }
  };

  // Analysis Logic
  useEffect(() => {
    if (phase === AppPhase.REVEAL) {
      const timer = setTimeout(async () => {
        setPhase(AppPhase.ANALYSIS);
        setIsReadingLoading(true);
        const result = await getTarotReading(question, drawnCards, language);
        setReading(result);
        setIsReadingLoading(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [phase, drawnCards, question, language]);

  const resetApp = () => {
    setPhase(AppPhase.INPUT);
    setQuestion('');
    setDrawnCards([]);
    setReading('');
    setDeck([...MAJOR_ARCANA]);
    setIsInteracting(false);
    setErrorMsg('');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };

  return (
    <div className="min-h-full flex flex-col items-center overflow-x-hidden font-sans relative">
      <StarryBackground />

      <Header 
        title={t.appTitle} 
        showBack={phase !== AppPhase.INPUT} 
        onBack={resetApp} 
        language={language}
        onToggleLanguage={toggleLanguage}
      />

      <main className="relative z-10 w-full flex-1 flex flex-col items-center px-4 py-4 min-h-0">
        
        {/* Phase: INPUT */}
        {phase === AppPhase.INPUT && (
          <div className="w-full max-w-md animate-fade-in flex flex-col justify-center flex-1 space-y-12">
            <div className="text-center space-y-6">
              <div className="w-32 h-32 mx-auto bg-purple-900/20 rounded-full flex items-center justify-center border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.2)] relative group">
                <div className="absolute inset-0 rounded-full border border-purple-400/20 animate-ping opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-amber-500/10 rounded-full animate-spin-slow opacity-50"></div>
                <span className="text-6xl drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] transform group-hover:scale-110 transition-transform duration-500">🔮</span>
              </div>
              <div>
                 <h2 className="text-3xl font-mystic font-light text-purple-50 tracking-wide drop-shadow-md">{t.startTitle}</h2>
                 <p className="text-sm text-purple-300/70 mt-3 font-mystic tracking-widest">{t.startSubtitle}</p>
              </div>
            </div>
            
            <div className="space-y-6 px-4">
              <div className="relative">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => {
                    setQuestion(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder={t.placeholder}
                  className={`w-full bg-slate-900/40 backdrop-blur-md border ${errorMsg ? 'border-red-500/50' : 'border-purple-500/30'} rounded-2xl px-6 py-5 text-center text-lg focus:outline-none focus:border-amber-500/60 focus:bg-slate-900/60 transition-all placeholder:text-slate-500 text-amber-50 shadow-inner`}
                  onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                />
                {errorMsg && (
                  <div className="absolute -bottom-6 left-0 w-full text-center text-red-400 text-xs tracking-wider animate-pulse">
                    {errorMsg}
                  </div>
                )}
              </div>
              
              <button
                onClick={handleStart}
                disabled={!question.trim()}
                className="w-full bg-gradient-to-br from-purple-800 to-indigo-900 hover:from-purple-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed text-amber-100 font-bold tracking-[0.2em] py-5 rounded-2xl shadow-[0_8px_30px_rgba(88,28,135,0.3)] border border-white/5 transition-all transform active:scale-95"
              >
                {t.startBtn}
              </button>
            </div>
            
            <div className="text-center opacity-40 text-[10px] tracking-[0.3em] text-slate-400 font-cinzel pt-12">
               Mystic Tarot AI
            </div>
          </div>
        )}

        {/* Phase: SHUFFLING */}
        {phase === AppPhase.SHUFFLING && (
          <div className="flex flex-col items-center justify-center flex-1 animate-fade-in w-full">
             <div className="relative w-40 h-64">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div 
                    key={i}
                    className="absolute inset-0 rounded-xl bg-slate-800 border-2 border-purple-900/80 shadow-2xl"
                    style={{
                      transform: `translate(${Math.sin(Date.now() / 80 + i) * 20}px, ${Math.cos(Date.now() / 80 + i) * 10}px) rotate(${Math.sin(Date.now() / 150 + i) * 12}deg)`,
                      transition: 'transform 0.05s linear',
                      zIndex: i
                    }}
                  >
                     <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-800/40 via-slate-900 to-black flex items-center justify-center rounded-lg overflow-hidden">
                        <div className="absolute inset-0 border border-white/5 rounded-lg"></div>
                        <span className="text-purple-500/20 text-5xl font-mystic">☾</span>
                     </div>
                  </div>
                ))}
             </div>
             <p className="mt-16 text-amber-200/90 tracking-[0.3em] text-lg animate-pulse font-mystic drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
               {t.shuffling}
             </p>
          </div>
        )}

        {/* Phase: DRAWING */}
        {phase === AppPhase.DRAWING && (
          <div className="w-full h-full flex flex-col animate-fade-in relative pt-4">
            <div className="text-center z-20 mb-4">
               <h2 className="text-xl text-purple-100 mb-1 tracking-widest font-mystic">{t.drawTitle}</h2>
               <div className="flex justify-center gap-1">
                 {[0, 1, 2].map(i => (
                   <div key={i} className={`w-2 h-2 rounded-full transition-colors duration-300 ${drawnCards.length > i ? 'bg-amber-500' : 'bg-slate-700'}`}></div>
                 ))}
               </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 sm:gap-6 w-full max-w-lg mx-auto mb-4 z-20 px-2">
              {[0, 1, 2].map((slot) => (
                <div key={slot} className="aspect-[2/3.5] border border-purple-500/20 rounded-lg flex items-center justify-center bg-slate-900/40 backdrop-blur-sm relative transition-all duration-500 shadow-inner">
                  {drawnCards[slot] ? (
                     <div className="animate-fade-in w-full h-full p-1">
                        <Card card={drawnCards[slot]} isRevealed={false} className="w-full h-full" language={language} />
                     </div>
                  ) : (
                    <div className="text-center opacity-30">
                       <div className="text-xl mb-1 font-mystic text-purple-200">{slot + 1}</div>
                       <div className="text-[8px] uppercase tracking-widest font-cinzel">
                        {language === 'zh' ? (['过去', '现在', '未来'][slot]) : (['Past', 'Present', 'Future'][slot])}
                       </div>
                    </div>
                  )}
                  {drawnCards.length === slot && !isInteracting && (
                    <div className="absolute inset-0 border border-amber-500/50 rounded-lg animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.15)] pointer-events-none"></div>
                  )}
                </div>
              ))}
            </div>

            <div className={`relative flex-1 w-full min-h-[300px] flex justify-center items-end perspective-1000 overflow-hidden ${isInteracting ? 'pointer-events-none grayscale-[0.5]' : ''} transition-all duration-500`}>
               <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-slate-950 via-purple-950/30 to-transparent pointer-events-none"></div>

               <div className="relative w-full max-w-md h-64 mb-6">
                 {deck.map((card, index) => {
                    const total = deck.length;
                    const center = (total - 1) / 2;
                    const offset = index - center;
                    
                    const degreePerCard = 4; 
                    const rotation = offset * degreePerCard;
                    const translateY = Math.abs(offset) * 2 + (Math.abs(offset) > 5 ? Math.abs(offset) : 0); 
                    const translateX = offset * 12;

                    return (
                      <div 
                        key={card.id}
                        onClick={() => handleCardDraw(index)}
                        className="absolute bottom-0 left-1/2 cursor-pointer transition-all duration-300 group touch-manipulation"
                        style={{
                          width: '80px',
                          height: '128px',
                          marginLeft: '-40px',
                          transformOrigin: '50% 120%', 
                          transform: `translateX(${translateX}px) rotate(${rotation}deg) translateY(${translateY}px)`,
                          zIndex: index + 10,
                        }}
                      >
                        <div className="w-full h-full rounded-md bg-slate-800 border border-purple-500/40 shadow-xl group-hover:-translate-y-4 transition-transform relative overflow-hidden">
                           <div className="absolute inset-0 bg-gradient-to-br from-purple-700/20 to-black"></div>
                           <div className="absolute inset-1 border border-white/5 rounded-sm flex items-center justify-center">
                              <span className="text-purple-300/20 text-xl font-mystic">☾</span>
                           </div>
                        </div>
                      </div>
                    );
                 })}
               </div>
               <p className="absolute bottom-4 text-xs text-slate-500 tracking-widest font-cinzel opacity-60">SCROLL OR TAP TO DRAW</p>
            </div>
          </div>
        )}

        {/* Phase: REVEAL & ANALYSIS */}
        {(phase === AppPhase.REVEAL || phase === AppPhase.ANALYSIS) && (
          <div className="w-full flex flex-col items-center space-y-6 animate-fade-in pb-20">
             
             <div className="text-center w-full px-4 py-6 bg-gradient-to-b from-purple-900/10 to-transparent rounded-b-3xl -mt-4 mb-4">
                <span className="block text-xs font-bold text-amber-600/80 uppercase tracking-widest mb-2 font-cinzel">{t.questionLabel}</span>
                <p className="text-lg text-slate-200 font-mystic leading-relaxed">“{question}”</p>
             </div>

            <div className="flex justify-center gap-3 md:gap-6 px-2 w-full max-w-3xl">
              {drawnCards.map((card, idx) => (
                <div key={card.id} className="flex flex-col items-center gap-3 flex-1 max-w-[120px]">
                  <div className="animate-card-flip shadow-2xl shadow-purple-900/40 rounded-lg w-full aspect-[2/3.5] relative" style={{ animationDelay: `${idx * 0.8}s`, animationFillMode: 'both' }}>
                    <Card card={card} isRevealed={true} className="w-full h-full" language={language} />
                  </div>
                  <div className="w-full opacity-0 animate-fade-in" style={{ animationDelay: `${idx * 0.8 + 0.5}s`, animationFillMode: 'forwards' }}>
                    <span className="text-[10px] md:text-xs uppercase tracking-[0.1em] text-amber-500/80 text-center font-bold border-t border-amber-500/20 pt-2 font-mystic block w-full">
                       {language === 'zh' ? ['过去', '现在', '未来'][card.position] : ['The Past', 'The Present', 'The Future'][card.position]}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full max-w-2xl mt-4 bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/5 p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] relative overflow-hidden mx-4 animate-fade-in" style={{ animationDelay: '3s' }}>
              {isReadingLoading ? (
                 <WisdomLoader language={language} />
              ) : (
                <div className="prose prose-invert prose-sm sm:prose-base prose-p:text-slate-300 prose-p:leading-loose prose-headings:text-amber-100 prose-strong:text-amber-400 max-w-none font-mystic">
                  <ReactMarkdown>{reading}</ReactMarkdown>
                  
                  <div className="pt-8 pb-2 flex justify-center">
                    <button 
                      onClick={resetApp}
                      className="px-8 py-3 bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 rounded-full text-xs text-purple-100 uppercase tracking-[0.2em] transition-all"
                    >
                      {t.againBtn}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {(phase === AppPhase.INPUT || phase === AppPhase.ANALYSIS) && (
         <div className="fixed bottom-4 left-0 w-full text-center pointer-events-none z-0">
             <div className="text-[10px] text-slate-700 uppercase tracking-widest font-cinzel opacity-50">Mystic Tarot v1.1</div>
         </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes flipIn {
          0% { opacity: 0; transform: rotateY(90deg) scale(0.9); }
          100% { opacity: 1; transform: rotateY(0deg) scale(1); }
        }
        .animate-card-flip {
          animation: flipIn 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes spinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-reverse {
          animation: spinReverse 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
