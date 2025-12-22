import React from 'react';
import { Button, Input, QuickQuestionCard } from './ui';
import SEOHead from './SEOHead';
import { FAQSchema } from './FAQSchema';

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
    <>
      <SEOHead
        title={isZh ? '神秘塔罗 AI - AI驱动的塔罗牌占卜体验' : 'Mystic Tarot AI - AI-Powered Tarot Reading Experience'}
        description={isZh
          ? '体验沉浸式AI塔罗牌占卜，由阿里云百炼Qwen模型驱动的深度解读。洗牌仪式、神秘氛围，探索命运的指引。'
          : 'Experience immersive AI-powered Tarot readings with deep interpretations by Alibaba Bailian Qwen models. Card shuffling rituals, mystical atmosphere, explore fate\'s guidance.'}
        url="https://ai-tarotcard.com/"
        lang={isZh ? 'zh-CN' : 'en'}
        schemaType="WebSite"
      />
      <FAQSchema language={language} />
      <div className="min-h-screen flex flex-col items-center justify-center px-4 md:px-6 pt-20 md:pt-24 pb-8 md:pb-12 relative overflow-hidden">
      {/* Starry Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Generate white dots as stars - sample positions from CSS */}
        <div className="absolute w-[3px] h-[3px] rounded-full bg-white" style={{ left: '1041px', top: '512px' }} />
        <div className="absolute w-[4px] h-[4px] rounded-full bg-white" style={{ left: '1801px', top: '8px' }} />
        <div className="absolute w-[3px] h-[3px] rounded-full bg-white" style={{ left: '1337px', top: '464px' }} />
        <div className="absolute w-[3px] h-[3px] rounded-full bg-white" style={{ left: '636px', top: '1170px' }} />
        <div className="absolute w-[4px] h-[4px] rounded-full bg-white" style={{ left: '1401px', top: '109px' }} />
        <div className="absolute w-[1.5px] h-[1.5px] rounded-full bg-white" style={{ left: '1305px', top: '78px' }} />
        <div className="absolute w-[4px] h-[4px] rounded-full bg-white" style={{ left: '180px', top: '699px' }} />
        <div className="absolute w-[2px] h-[2px] rounded-full bg-white" style={{ left: '1330px', top: '185px' }} />
        <div className="absolute w-[2px] h-[2px] rounded-full bg-white" style={{ left: '743px', top: '1072px' }} />
        <div className="absolute w-[1px] h-[1px] rounded-full bg-white" style={{ left: '113px', top: '407px' }} />
        <div className="absolute w-[3px] h-[3px] rounded-full bg-white" style={{ left: '1829px', top: '377px' }} />
        <div className="absolute w-[3px] h-[3px] rounded-full bg-white" style={{ left: '647px', top: '273px' }} />
        <div className="absolute w-[3px] h-[3px] rounded-full bg-white" style={{ left: '294px', top: '944px' }} />
        <div className="absolute w-[4px] h-[4px] rounded-full bg-white" style={{ left: '1325px', top: '1053px' }} />
        <div className="absolute w-[4px] h-[4px] rounded-full bg-white" style={{ left: '1686px', top: '359px' }} />
        <div className="absolute w-[3px] h-[3px] rounded-full bg-white" style={{ left: '1879px', top: '111px' }} />
        <div className="absolute w-[2px] h-[2px] rounded-full bg-white" style={{ left: '1740px', top: '296px' }} />
        <div className="absolute w-[2px] h-[2px] rounded-full bg-white" style={{ left: '1054px', top: '600px' }} />
        <div className="absolute w-[1px] h-[1px] rounded-full bg-white" style={{ left: '417px', top: '682px' }} />
        <div className="absolute w-[4px] h-[4px] rounded-full bg-white" style={{ left: '1879px', top: '772px' }} />
      </div>

      {/* Main Content Container */}
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-3 md:gap-4 relative z-10">

        {/* Tarot Cards Illustration - Three cards in fan layout using real image */}
        <div className="mb-3 md:mb-4 relative">
          <div className="w-[280px] sm:w-[400px] md:w-[500px] h-[200px] sm:h-[280px] md:h-[320px] flex items-center justify-center relative">
            {/* Left card */}
            <img
              src="/img/tarot-card-back.png"
              alt={isZh ? "塔罗牌背面 - 神秘图案" : "Tarot Card Back - Mystical Design"}
              loading="eager"
              width="140"
              height="245"
              className="absolute left-[20px] sm:left-[40px] md:left-[60px] top-1/2 -translate-y-1/2 w-[80px] sm:w-[110px] md:w-[140px] h-auto transform -rotate-[20deg] z-10 drop-shadow-2xl"
            />

            {/* Center card */}
            <img
              src="/img/tarot-card-back.png"
              alt={isZh ? "塔罗牌背面 - 中央主牌" : "Tarot Card Back - Center Card"}
              loading="eager"
              width="160"
              height="280"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] sm:w-[130px] md:w-[160px] h-auto transform rotate-0 z-30 drop-shadow-2xl"
            />

            {/* Right card */}
            <img
              src="/img/tarot-card-back.png"
              alt={isZh ? "塔罗牌背面 - 神秘符号" : "Tarot Card Back - Mystical Symbol"}
              loading="eager"
              width="140"
              height="245"
              className="absolute right-[20px] sm:right-[40px] md:right-[60px] top-1/2 -translate-y-1/2 w-[80px] sm:w-[110px] md:w-[140px] h-auto transform rotate-[20deg] z-10 drop-shadow-2xl"
            />

            {/* Floating golden stars around the cards */}
            <div className="absolute top-[5%] left-[25%] text-[#d4af37] text-sm md:text-lg animate-pulse">✦</div>
            <div className="absolute top-[15%] right-[20%] text-[#d4af37] text-sm animate-pulse" style={{ animationDelay: '0.5s' }}>✦</div>
            <div className="absolute bottom-[20%] left-[15%] text-[#d4af37] text-sm animate-pulse" style={{ animationDelay: '1s' }}>✦</div>
            <div className="absolute bottom-[15%] right-[25%] text-[#d4af37] text-sm md:text-lg animate-pulse" style={{ animationDelay: '1.5s' }}>✦</div>
            <div className="absolute top-[40%] left-[10%] text-[#d4af37] text-xs animate-pulse" style={{ animationDelay: '2s' }}>✦</div>
            <div className="absolute top-[45%] right-[12%] text-[#d4af37] text-xs animate-pulse" style={{ animationDelay: '2.5s' }}>✦</div>
          </div>
        </div>

        {/* Input Section */}
        <div className="w-full max-w-md md:max-w-2xl space-y-4 md:space-y-6">
          <Input
            placeholder={isZh ? '在此输入阁下心中的困惑...' : 'Enter your confusion here...'}
            value={localQuestion}
            onChange={(e) => setLocalQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
          />

          <div className="flex flex-col items-center gap-4 md:gap-6">
            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              disabled={!localQuestion.trim()}
              className="w-full sm:w-auto"
            >
              {isZh ? '开始占卜' : 'Start Reading'}
            </Button>
          </div>
        </div>

        {/* Quick Questions */}
        <div className="w-full max-w-md md:max-w-2xl mt-6 md:mt-8">
          <p className="text-[rgba(205,191,238,0.5)] text-[14px] md:text-[16px] leading-[17px] md:leading-[19px] mb-3 md:mb-4 text-center">
            {isZh ? '灵感示例，点击试一试' : 'Inspiration examples, click to try'}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 max-w-[629px] mx-auto">
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
    </>
  );
};
