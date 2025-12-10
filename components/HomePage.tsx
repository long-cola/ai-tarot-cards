import React from 'react';
import { Button, Input, QuickQuestionCard } from './ui';

interface HomePageProps {
  language: 'zh' | 'en';
  onQuestionSubmit: (question: string) => void;
  onQuickQuestionClick: (question: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  language,
  onQuestionSubmit,
  onQuickQuestionClick,
}) => {
  const [localQuestion, setLocalQuestion] = React.useState('');
  const isZh = language === 'zh';

  const quickQuestions = isZh
    ? [
        '我爱不爱我前任?',
        '这段关系是否值得继续?',
        '哪个更加适合另一个我?',
        '要不要接受这份工作机会?',
        '是否能够开始新的事业项目?',
      ]
    : [
        'Do I still love my ex?',
        'Is this relationship worth continuing?',
        'Which one is more suitable for me?',
        'Should I accept this job opportunity?',
        'Should I start a new business project?',
      ];

  const handleSubmit = () => {
    if (localQuestion.trim()) {
      onQuestionSubmit(localQuestion.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && localQuestion.trim()) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-12">
      {/* Main Content Container */}
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-8">

        {/* Tarot Cards Illustration - Three cards in fan layout */}
        <div className="mb-8 relative">
          <div className="w-[400px] h-[280px] flex items-center justify-center relative">
            {/* Left card */}
            <div className="absolute left-[50px] top-1/2 -translate-y-1/2 w-[120px] h-[200px] transform -rotate-[25deg] z-10">
              <div className="w-full h-full rounded-2xl bg-[#1a0f2e] border-2 border-[#d4af37] shadow-2xl relative overflow-hidden">
                {/* Corner decorations */}
                <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-[#d4af37] opacity-80"></div>
                <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-[#d4af37] opacity-80"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-[#d4af37] opacity-80"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-[#d4af37] opacity-80"></div>

                {/* Stars decoration */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1">
                  <span className="text-[#d4af37] text-xs">✦</span>
                  <span className="text-[#d4af37] text-xs">✦</span>
                  <span className="text-[#d4af37] text-xs">✦</span>
                </div>

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/80 to-purple-950/80">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg">
                    <span className="text-2xl">🔮</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center card */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[130px] h-[220px] transform rotate-0 z-30">
              <div className="w-full h-full rounded-2xl bg-[#1a0f2e] border-[3px] border-[#d4af37] shadow-2xl relative overflow-hidden">
                {/* Ornate corner decorations */}
                <div className="absolute top-2 left-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" className="fill-[#d4af37]">
                    <circle cx="3" cy="3" r="1.5"/>
                    <path d="M0,3 L3,3 M3,0 L3,3"/>
                  </svg>
                </div>
                <div className="absolute top-2 right-2 transform rotate-90">
                  <svg width="16" height="16" viewBox="0 0 16 16" className="fill-[#d4af37]">
                    <circle cx="3" cy="3" r="1.5"/>
                    <path d="M0,3 L3,3 M3,0 L3,3"/>
                  </svg>
                </div>
                <div className="absolute bottom-2 left-2 transform -rotate-90">
                  <svg width="16" height="16" viewBox="0 0 16 16" className="fill-[#d4af37]">
                    <circle cx="3" cy="3" r="1.5"/>
                    <path d="M0,3 L3,3 M3,0 L3,3"/>
                  </svg>
                </div>
                <div className="absolute bottom-2 right-2 transform rotate-180">
                  <svg width="16" height="16" viewBox="0 0 16 16" className="fill-[#d4af37]">
                    <circle cx="3" cy="3" r="1.5"/>
                    <path d="M0,3 L3,3 M3,0 L3,3"/>
                  </svg>
                </div>

                {/* Stars around the frame */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1">
                  <span className="text-[#d4af37] text-sm">✦</span>
                  <span className="text-[#d4af37] text-sm">✦</span>
                  <span className="text-[#d4af37] text-sm">✦</span>
                </div>

                {/* Center illustration */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <div className="relative">
                    {/* Radial background */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/40 via-purple-600/40 to-purple-800/40 blur-xl"></div>

                    {/* Crystal ball with wing */}
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-700 shadow-2xl flex items-center justify-center border-2 border-purple-300/30">
                        <span className="text-3xl">🔮</span>
                      </div>
                      {/* Golden wing decoration */}
                      <div className="absolute -right-2 top-1/2 -translate-y-1/2 text-2xl opacity-90">✨</div>
                    </div>

                    {/* Rose decoration */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xl">🌹</div>
                  </div>

                  {/* Bottom text */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full">
                    <div className="text-center text-[#d4af37] text-[8px] font-bold tracking-wider border-t border-b border-[#d4af37]/30 py-1">
                      TAROT CARD APP
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right card */}
            <div className="absolute right-[50px] top-1/2 -translate-y-1/2 w-[120px] h-[200px] transform rotate-[25deg] z-10">
              <div className="w-full h-full rounded-2xl bg-[#1a0f2e] border-2 border-[#d4af37] shadow-2xl relative overflow-hidden">
                {/* Corner decorations */}
                <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-[#d4af37] opacity-80"></div>
                <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-[#d4af37] opacity-80"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-[#d4af37] opacity-80"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-[#d4af37] opacity-80"></div>

                {/* Stars decoration */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1">
                  <span className="text-[#d4af37] text-xs">✦</span>
                  <span className="text-[#d4af37] text-xs">✦</span>
                  <span className="text-[#d4af37] text-xs">✦</span>
                </div>

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/80 to-purple-950/80">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg">
                    <span className="text-2xl">🔮</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating golden stars around the cards */}
            <div className="absolute top-0 left-[30%] text-[#d4af37] text-lg animate-pulse">✦</div>
            <div className="absolute top-[10%] right-[25%] text-[#d4af37] text-sm animate-pulse" style={{ animationDelay: '0.5s' }}>✦</div>
            <div className="absolute bottom-[15%] left-[20%] text-[#d4af37] text-sm animate-pulse" style={{ animationDelay: '1s' }}>✦</div>
            <div className="absolute bottom-[10%] right-[30%] text-[#d4af37] text-lg animate-pulse" style={{ animationDelay: '1.5s' }}>✦</div>
          </div>
        </div>

        {/* Input Section */}
        <div className="w-full max-w-2xl space-y-4">
          <Input
            placeholder={isZh ? '在此输入你困扰下心中的困惑...' : 'Enter your question here...'}
            value={localQuestion}
            onChange={(e) => setLocalQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
          />

          <div className="flex flex-col items-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              disabled={!localQuestion.trim()}
              className="min-w-[200px]"
            >
              {isZh ? '开始占卜' : 'Start Reading'}
            </Button>

            <p className="text-white/40 text-sm">
              {isZh ? '没账示例，点击试一试' : 'No account needed, try it now'}
            </p>
          </div>
        </div>

        {/* Quick Questions */}
        <div className="w-full max-w-2xl mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quickQuestions.map((q, index) => (
              <QuickQuestionCard
                key={index}
                question={q}
                onClick={() => onQuickQuestionClick(q)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
