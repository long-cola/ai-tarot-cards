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

        {/* Tarot Cards Illustration */}
        <div className="mb-8">
          <div className="w-48 h-64 flex items-center justify-center">
            {/* Placeholder for tarot cards illustration */}
            <div className="relative w-full h-full">
              {/* Center card */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-48 bg-gradient-to-br from-purple-600/80 to-purple-800/80 rounded-2xl border-2 border-purple-400/30 shadow-2xl backdrop-blur-sm transform rotate-0 z-30 flex items-center justify-center">
                <span className="text-4xl">🔮</span>
              </div>
              {/* Left card */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-48 bg-gradient-to-br from-purple-600/60 to-purple-800/60 rounded-2xl border-2 border-purple-400/20 shadow-xl backdrop-blur-sm transform -rotate-12 -translate-x-12 z-20" />
              {/* Right card */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-48 bg-gradient-to-br from-purple-600/60 to-purple-800/60 rounded-2xl border-2 border-purple-400/20 shadow-xl backdrop-blur-sm transform rotate-12 translate-x-12 z-20" />
            </div>
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
