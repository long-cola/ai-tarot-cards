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
  const popularReadings = isZh
    ? [
        { label: '他会联系我吗塔罗占卜', href: '/zh/will-he-contact-me-tarot' },
        { label: '爱情塔罗占卜', href: '/zh/love-tarot-reading' },
        { label: '我是否该辞职塔罗占卜', href: '/zh/should-i-leave-my-job-tarot' },
        { label: '事业塔罗占卜', href: '/zh/career-tarot-reading' },
        { label: '每日塔罗指引', href: '/zh/daily-tarot-guidance' },
      ]
    : [
        { label: 'Will He Contact Me Tarot', href: '/will-he-contact-me-tarot' },
        { label: 'Love Tarot Reading', href: '/love-tarot-reading' },
        { label: 'Should I Leave My Job Tarot', href: '/should-i-leave-my-job-tarot' },
        { label: 'Career Tarot Reading', href: '/career-tarot-reading' },
        { label: 'Daily Tarot Guidance', href: '/daily-tarot-guidance' },
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
        lang={isZh ? 'zh-Hans' : 'en'}
        schemaType="SoftwareApplication"
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

            {/* Popular Tarot Readings */}
            <div className="w-full flex flex-col items-center gap-4 mt-2">
              <h2
                className="text-[18px] md:text-[20px] font-semibold text-center"
                style={{ color: '#E8E3FF', fontFamily: "'Noto Serif SC', serif" }}
              >
                {isZh ? '热门塔罗占卜' : 'Popular Tarot Readings'}
              </h2>
              <div className="flex flex-wrap justify-center items-center gap-4 px-4 text-[14px] md:text-[15px]">
                {popularReadings.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-[#BDA1FF] hover:text-[#E2DBFF] transition-colors underline underline-offset-4"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            {/* SEO Content Section */}
            <div className="w-full max-w-4xl px-4 mt-12">
              <div className="prose prose-invert prose-sm max-w-none">
                {isZh ? (
                  <div className="text-white/70 leading-relaxed space-y-4">
                    <h2 className="text-[20px] font-semibold text-white/90 mb-4">什么是AI塔罗占卜？</h2>
                    <p>
                      AI塔罗占卜是一个结合古老塔罗智慧与现代人工智能技术的在线工具平台。我们的使命是帮助你在爱情、事业、财运和人生重要决策中获得清晰的洞察和指引。无论你是在思考"他会联系我吗"、"我该辞职吗"，还是寻求每日灵性指导，我们的AI都能为你提供即时、个性化的塔罗解读。
                    </p>
                    <p>
                      与传统塔罗占卜不同，AI塔罗不是预测未来，而是帮助你探索可能性、理清思路、倾听内心的声音。我们的平台24小时随时可用，让你在需要时随时获得支持和启发。
                    </p>
                    <h3 className="text-[18px] font-semibold text-white/90 mt-6 mb-3">为什么选择我们的AI塔罗服务？</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>即时解读</strong>：3秒内获得专业的塔罗牌解读，无需等待</li>
                      <li><strong>深度洞察</strong>：结合经典塔罗象征意义和AI智能分析，提供有意义的反思</li>
                      <li><strong>隐私保护</strong>：你的问题和解读完全私密，无需担心隐私泄露</li>
                      <li><strong>多场景覆盖</strong>：爱情关系、职业发展、财务决策、每日指引等全方位支持</li>
                    </ul>
                    <p className="mt-4">
                      无论你是塔罗新手还是资深爱好者，我们的平台都能为你提供有价值的洞察。开始你的免费塔罗之旅，让AI帮助你发现内心深处的答案。
                    </p>
                  </div>
                ) : (
                  <div className="text-white/70 leading-relaxed space-y-4">
                    <h2 className="text-[20px] font-semibold text-white/90 mb-4">What is AI Tarot Reading?</h2>
                    <p>
                      AI Tarot is an online platform that combines ancient tarot wisdom with modern artificial intelligence technology. Our mission is to help you gain clarity and guidance on love, career, money, and life decisions. Whether you are wondering "Will he contact me?", "Should I leave my job?", or seeking daily spiritual guidance, our AI provides instant, personalized tarot interpretations.
                    </p>
                    <p>
                      Unlike traditional fortune-telling, AI Tarot does not predict the future. Instead, it helps you explore possibilities, clarify your thoughts, and listen to your inner voice. Our platform is available 24/7, providing support and inspiration whenever you need it.
                    </p>
                    <h3 className="text-[18px] font-semibold text-white/90 mt-6 mb-3">Why Choose Our AI Tarot Service?</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Instant Insights</strong>: Get professional tarot readings in 3 seconds, no waiting required</li>
                      <li><strong>Deep Analysis</strong>: Combines classic tarot symbolism with AI intelligence for meaningful reflection</li>
                      <li><strong>Privacy Protected</strong>: Your questions and readings are completely private and confidential</li>
                      <li><strong>Comprehensive Coverage</strong>: Support for love relationships, career development, financial decisions, daily guidance, and more</li>
                    </ul>
                    <p className="mt-4">
                      Whether you are new to tarot or an experienced enthusiast, our platform offers valuable insights for everyone. Start your free tarot journey today and let AI help you discover the answers within.
                    </p>
                  </div>
                )}
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
