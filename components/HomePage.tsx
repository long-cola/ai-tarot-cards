import React from 'react';
import { Button, Input, QuickQuestionCard } from './ui';

interface HomePageProps {
  language: 'zh' | 'en';
  question?: string;
  onQuestionSubmit: (question: string) => void;
  onQuickQuestionClick: (question: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  language,
  question = '',
  onQuestionSubmit,
  onQuickQuestionClick,
}) => {
  const [localQuestion, setLocalQuestion] = React.useState('');
  const isZh = language === 'zh';

  // Sync with parent question prop
  React.useEffect(() => {
    if (question) {
      setLocalQuestion(question);
    }
  }, [question]);

  const quickQuestions = isZh
    ? [
        '✨ 我要不要辞职？',
        '✨ 这段关系是否继续？',
        '✨ 要不要搬到另一个城市？',
        '✨ 要不要接受这份工作机会？',
        '✨ 是否应该开始创业项目？',
      ]
    : [
        '✨ Should I quit my job?',
        '✨ Should this relationship continue?',
        '✨ Should I move to another city?',
        '✨ Should I accept this job offer?',
        '✨ Should I start a business project?',
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

        {/* Tarot Cards Illustration - Three cards in fan layout using real image */}
        <div className="mb-8 relative">
          <div className="w-[500px] h-[320px] flex items-center justify-center relative">
            {/* Left card */}
            <img
              src="/img/tarot-card-back.png"
              alt="Tarot Card"
              className="absolute left-[60px] top-1/2 -translate-y-1/2 w-[140px] h-auto transform -rotate-[20deg] z-10 drop-shadow-2xl"
            />

            {/* Center card */}
            <img
              src="/img/tarot-card-back.png"
              alt="Tarot Card"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-auto transform rotate-0 z-30 drop-shadow-2xl"
            />

            {/* Right card */}
            <img
              src="/img/tarot-card-back.png"
              alt="Tarot Card"
              className="absolute right-[60px] top-1/2 -translate-y-1/2 w-[140px] h-auto transform rotate-[20deg] z-10 drop-shadow-2xl"
            />

            {/* Floating golden stars around the cards */}
            <div className="absolute top-[5%] left-[25%] text-[#d4af37] text-lg animate-pulse">✦</div>
            <div className="absolute top-[15%] right-[20%] text-[#d4af37] text-sm animate-pulse" style={{ animationDelay: '0.5s' }}>✦</div>
            <div className="absolute bottom-[20%] left-[15%] text-[#d4af37] text-sm animate-pulse" style={{ animationDelay: '1s' }}>✦</div>
            <div className="absolute bottom-[15%] right-[25%] text-[#d4af37] text-lg animate-pulse" style={{ animationDelay: '1.5s' }}>✦</div>
            <div className="absolute top-[40%] left-[10%] text-[#d4af37] text-xs animate-pulse" style={{ animationDelay: '2s' }}>✦</div>
            <div className="absolute top-[45%] right-[12%] text-[#d4af37] text-xs animate-pulse" style={{ animationDelay: '2.5s' }}>✦</div>
          </div>
        </div>

        {/* Input Section */}
        <div className="w-full max-w-2xl space-y-6">
          <Input
            placeholder={isZh ? '在此输入阁下心中的困惑...' : 'Enter your confusion here...'}
            value={localQuestion}
            onChange={(e) => setLocalQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
          />

          <div className="flex flex-col items-center gap-6">
            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              disabled={!localQuestion.trim()}
            >
              {isZh ? '开始占卜' : 'Start Reading'}
            </Button>
          </div>
        </div>

        {/* Quick Questions */}
        <div className="w-full max-w-2xl mt-8">
          <p className="text-[rgb(205,190,238)] text-[16px] mb-4">
            {isZh ? '灵感示例，点击试一试' : 'Inspiration examples, click to try'}
          </p>
          <div className="flex flex-wrap gap-3">
            {quickQuestions.map((q, index) => (
              <QuickQuestionCard
                key={index}
                question={q}
                onClick={() => onQuickQuestionClick(q.replace('✨ ', ''))}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
