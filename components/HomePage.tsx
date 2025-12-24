import React from 'react';
import { Button, Input, QuickQuestionCard } from './ui';
import { WhyChooseSection } from './WhyChooseSection';
import { BlogSection } from './BlogSection';
import { FAQSection } from './FAQSection';
import SEOHead from './SEOHead';
import { FAQSchema } from './FAQSchema';

interface HomePageProps {
  language: 'zh' | 'en';
  question?: string;
  onQuestionSubmit: (question: string) => void;
  onQuickQuestionClick: (question: string) => void;
  onBlogClick?: (blogId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  language,
  question = '',
  onQuestionSubmit,
  onQuickQuestionClick,
  onBlogClick,
}) => {
  const [localQuestion, setLocalQuestion] = React.useState('');
  const isZh = language === 'zh';

  React.useEffect(() => {
    if (question) {
      setLocalQuestion(question);
    }
  }, [question]);

  const quickQuestions = isZh
    ? [
        '✨ 我应该辞职吗？',
        '✨ 这段关系该继续吗？',
        '✨ 我应该搬到另一个城市吗？',
        '✨ 我应该接受这个工作机会吗？',
        '✨ 我应该开始创业吗？',
      ]
    : [
        '✨ Should I quit my job?',
        '✨ Should this relationship continue?',
        '✨ Should I move to another city?',
        '✨ Should I accept this job offer?',
        '✨ Should I start a business project',
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
        title={isZh ? '免费AI塔罗占卜 - 爱情事业财运解读 | 神秘塔罗在线' : 'Free AI Tarot Reading - Love, Career & Life Guidance | Mystic Tarot'}
        description={isZh
          ? '免费在线AI塔罗占卜，3秒获得专业解读。爱情、事业、财运、人生决策即时指引。神秘三牌阵洞察过去现在未来，24小时随时占卜，AI深度解析命运走向。'
          : 'Free online AI tarot reading in 3 seconds. Get instant insights on love, career, money & life decisions. Three-card spread reveals past, present, future. 24/7 mystical guidance powered by AI.'}
        url={isZh ? '/zh/' : '/'}
        lang={isZh ? 'zh-CN' : 'en'}
        schemaType="WebSite"
      />
      <FAQSchema language={language} />

      {/* Main Container with Background */}
      <div className="min-h-screen relative overflow-x-hidden">
        {/* Background Pattern */}
        <div
          className="fixed inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: 'url(/img/bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '100vw',
            height: '100vh',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center pb-20">
          {/* Hero Section */}
          <div className="w-full flex flex-col items-center gap-12 pt-32 md:pt-40 pb-16 px-8 md:px-16">
            {/* Title */}
            <div className="flex flex-col items-center gap-4 text-center px-4">
              <h1
                style={{
                  fontFamily: "'Noto Serif SC', serif",
                  fontWeight: 700,
                  fontSize: 'clamp(28px, 5vw, 32px)',
                  lineHeight: '48px',
                  color: '#E8E3FF',
                  maxWidth: '641px',
                }}
              >
                {isZh
                  ? '免费在线塔罗牌占卜：AI即时解读您的命运'
                  : 'Free Tarot Card Reading Online: Instant AI Insights for Your Destiny'}
              </h1>

              <p
                style={{
                  fontFamily: "'Noto Serif SC', serif",
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '22px',
                  color: '#CDBFEE',
                  maxWidth: '1000px',
                  padding: '0 16px',
                }}
              >
                {isZh
                  ? '用我们尖端的AI塔罗占卜平台解锁生命的奥秘。无论您是在寻求爱情与关系的清晰指引，探索职业道路，还是寻找每日灵性指导，我们的虚拟塔罗牌都能为您提供即时、个性化的解读。'
                  : 'Unlock the mysteries of your life with our cutting-edge AI Tarot Reading platform. Whether you are seeking clarity on love and relationships, navigating your career path, or looking for daily spiritual guidance, our virtual tarot deck is here to provide instant, personalized interpretations.'}
              </p>
            </div>

            {/* Input Section */}
            <div className="w-full flex flex-col items-center gap-4">
              <Input
                placeholder={isZh ? '请输入您的问题' : 'Please enter the question'}
                value={localQuestion}
                onChange={(e) => setLocalQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
              />

              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                disabled={!localQuestion.trim()}
                style={{
                  opacity: localQuestion.trim() ? 1 : 0.5,
                }}
              >
                {isZh ? '开始' : 'Start'}
              </Button>
            </div>

            {/* Quick Questions */}
            <div className="w-full flex flex-col items-center gap-4">
              <p
                style={{
                  fontFamily: "'Noto Serif SC', serif",
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '19px',
                  color: 'rgba(205, 191, 238, 0.5)',
                  textAlign: 'center',
                }}
              >
                {isZh
                  ? '不知道问什么？试试这些热门问题'
                  : 'Not sure what to ask? Try these popular questions'}
              </p>

              <div className="flex flex-wrap justify-center items-center gap-4 px-4">
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

          {/* Why Choose Section */}
          <div className="w-full py-20 px-8 md:px-16">
            <WhyChooseSection language={language} />
          </div>

          {/* Blog Section */}
          <div className="w-full py-20 px-8 md:px-16">
            <BlogSection language={language} onBlogClick={onBlogClick} />
          </div>

          {/* FAQ Section */}
          <div className="w-full py-20 px-8 md:px-16">
            <FAQSection language={language} />
          </div>
        </div>
      </div>
    </>
  );
};
