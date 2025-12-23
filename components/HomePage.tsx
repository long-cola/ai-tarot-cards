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
        title={isZh ? '免费AI塔罗占卜 - 爱情事业财运解读 | 神秘塔罗在线' : 'Free AI Tarot Reading - Love, Career & Life Guidance | Mystic Tarot'}
        description={isZh
          ? '免费在线AI塔罗占卜，3秒获得专业解读。爱情、事业、财运、人生决策即时指引。神秘三牌阵洞察过去现在未来，24小时随时占卜，AI深度解析命运走向。'
          : 'Free online AI tarot reading in 3 seconds. Get instant insights on love, career, money & life decisions. Three-card spread reveals past, present, future. 24/7 mystical guidance powered by AI.'}
        url={isZh ? '/zh/' : '/'}
        lang={isZh ? 'zh-CN' : 'en'}
        schemaType="WebSite"
      />
      <FAQSchema language={language} />
      <div className="min-h-screen flex flex-col items-center justify-start px-4 md:px-6 pt-16 md:pt-20 pb-16 md:pb-20 relative overflow-hidden">
        {/* Starry Background Decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[3px] h-[3px] rounded-full bg-white" style={{ left: '1041px', top: '512px' }} />
          <div className="absolute w-[4px] h-[4px] rounded-full bg-white" style={{ left: '1801px', top: '8px' }} />
          <div className="absolute w-[3px] h-[3px] rounded-full bg-white" style={{ left: '1337px', top: '464px' }} />
          <div className="absolute w-[3px] h-[3px] rounded-full bg-white" style={{ left: '636px', top: '1170px' }} />
          <div className="absolute w-[4px] h-[4px] rounded-full bg-white" style={{ left: '1401px', top: '109px' }} />
          <div className="absolute w-[1.5px] h-[1.5px] rounded-full bg-white" style={{ left: '1305px', top: '78px' }} />
          <div className="absolute w-[4px] h-[4px] rounded-full bg-white" style={{ left: '180px', top: '699px' }} />
          <div className="absolute w-[2px] h-[2px] rounded-full bg-white" style={{ left: '1330px', top: '185px' }} />
        </div>

        {/* Main Content Container */}
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-4 md:gap-6 relative z-10">

          {/* Hero Section */}
          <div className="text-center space-y-2 md:space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-400/30 mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <span className="text-purple-200 text-xs md:text-sm font-medium">
                {isZh ? '🎉 免费开始 • AI驱动 • 24/7 在线' : '🎉 Free to Start • AI-Powered • 24/7 Online'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-purple-100 to-purple-300 leading-tight">
              {isZh ? '神秘塔罗 AI' : 'Mystic Tarot AI'}
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-purple-200/90 font-light">
              {isZh
                ? '3秒获得专业AI塔罗解读'
                : 'Get Professional AI Tarot Reading in 3 Seconds'}
            </p>
          </div>

          {/* Tarot Cards Illustration */}
          <div className="relative">
            <div className="w-[240px] sm:w-[320px] md:w-[400px] h-[140px] sm:h-[180px] md:h-[220px] flex items-center justify-center relative">
              {/* Left card */}
              <img
                src="/img/tarot-card-back.png"
                alt={isZh ? "塔罗牌背面" : "Tarot Card Back"}
                loading="eager"
                width="140"
                height="245"
                className="absolute left-[15px] sm:left-[30px] md:left-[40px] top-1/2 -translate-y-1/2 w-[60px] sm:w-[80px] md:w-[100px] h-auto transform -rotate-[20deg] z-10 drop-shadow-2xl"
              />

              {/* Center card */}
              <img
                src="/img/tarot-card-back.png"
                alt={isZh ? "塔罗牌中央" : "Tarot Card Center"}
                loading="eager"
                width="160"
                height="280"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[75px] sm:w-[95px] md:w-[115px] h-auto transform rotate-0 z-30 drop-shadow-2xl"
              />

              {/* Right card */}
              <img
                src="/img/tarot-card-back.png"
                alt={isZh ? "塔罗牌右侧" : "Tarot Card Right"}
                loading="eager"
                width="140"
                height="245"
                className="absolute right-[15px] sm:right-[30px] md:right-[40px] top-1/2 -translate-y-1/2 w-[60px] sm:w-[80px] md:w-[100px] h-auto transform rotate-[20deg] z-10 drop-shadow-2xl"
              />

              {/* Floating stars */}
              <div className="absolute top-[5%] left-[25%] text-[#d4af37] text-xs md:text-sm animate-pulse">✦</div>
              <div className="absolute top-[15%] right-[20%] text-[#d4af37] text-xs animate-pulse" style={{ animationDelay: '0.5s' }}>✦</div>
              <div className="absolute bottom-[20%] left-[15%] text-[#d4af37] text-xs animate-pulse" style={{ animationDelay: '1s' }}>✦</div>
              <div className="absolute bottom-[15%] right-[25%] text-[#d4af37] text-xs md:text-sm animate-pulse" style={{ animationDelay: '1.5s' }}>✦</div>
            </div>
          </div>

          {/* Input Section */}
          <div className="w-full max-w-md md:max-w-2xl space-y-3">
            <div className="text-center mb-2">
              <h2 className="text-lg md:text-xl font-semibold text-purple-200 mb-1">
                {isZh ? '💭 说出你的困惑' : '💭 Share Your Question'}
              </h2>
              <p className="text-xs md:text-sm text-slate-400">
                {isZh ? '输入任何关于爱情、事业、财运的问题' : 'Ask anything about love, career, or finances'}
              </p>
            </div>

            <Input
              placeholder={isZh ? '例如：我要不要换工作？这段感情能走到最后吗？' : 'e.g., Should I change jobs? Will this relationship last?'}
              value={localQuestion}
              onChange={(e) => setLocalQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
            />

            <div className="flex flex-col items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                disabled={!localQuestion.trim()}
                className="w-full sm:w-auto px-8 py-3 text-base font-semibold"
              >
                {isZh ? '🔮 开始占卜（免费）' : '🔮 Start Reading (Free)'}
              </Button>
            </div>
          </div>

          {/* Quick Questions */}
          <div className="w-full max-w-md md:max-w-2xl">
            <p className="text-purple-300/70 text-sm md:text-base mb-3 md:mb-4 text-center font-medium">
              {isZh ? '💡 不知道问什么？试试这些热门问题' : '💡 Not sure what to ask? Try these popular questions'}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 max-w-[629px] mx-auto">
              {quickQuestions.map((q, index) => (
                <QuickQuestionCard
                  key={index}
                  question={q}
                  onClick={() => onQuickQuestionClick(q.replace('✨ ', ''))}
                />
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className="w-full max-w-4xl mt-8 md:mt-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-purple-200 mb-8 md:mb-12">
              {isZh ? '✨ 为什么选择我们' : '✨ Why Choose Us'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Feature 1 */}
              <div className="bg-slate-900/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:border-purple-400/40 transition-all duration-300 hover:transform hover:scale-105">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-lg md:text-xl font-semibold text-purple-200 mb-3">
                  {isZh ? 'AI 深度解读' : 'AI Deep Analysis'}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {isZh
                    ? '阿里云百炼 Qwen 模型驱动，专业级塔罗解读，洞察命运走向。'
                    : 'Powered by Alibaba Bailian Qwen model for professional-grade tarot interpretations.'}
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-slate-900/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:border-purple-400/40 transition-all duration-300 hover:transform hover:scale-105">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-lg md:text-xl font-semibold text-purple-200 mb-3">
                  {isZh ? '3秒即时解读' : '3-Second Instant Reading'}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {isZh
                    ? '无需等待，输入问题后3秒获得详细解读，随时随地占卜。'
                    : 'No waiting. Get detailed readings within 3 seconds of asking your question.'}
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-slate-900/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:border-purple-400/40 transition-all duration-300 hover:transform hover:scale-105">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-lg md:text-xl font-semibold text-purple-200 mb-3">
                  {isZh ? '三牌阵精准分析' : 'Three-Card Precision'}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {isZh
                    ? '过去-现在-未来三牌阵，全面洞察问题的来龙去脉和发展趋势。'
                    : 'Past-Present-Future spread for comprehensive insights into your situation.'}
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-slate-900/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:border-purple-400/40 transition-all duration-300 hover:transform hover:scale-105">
                <div className="text-4xl mb-4">💝</div>
                <h3 className="text-lg md:text-xl font-semibold text-purple-200 mb-3">
                  {isZh ? '免费试用可用' : 'Free Trial Available'}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {isZh
                    ? '无需注册，每天5次免费占卜额度。升级会员可享受无限次数和更多高级功能。'
                    : '5 free readings daily, no registration required. Upgrade to premium for unlimited readings and advanced features.'}
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-slate-900/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:border-purple-400/40 transition-all duration-300 hover:transform hover:scale-105">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-lg md:text-xl font-semibold text-purple-200 mb-3">
                  {isZh ? '命题追踪管理' : 'Topic Tracking'}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {isZh
                    ? '创建人生命题，持续追踪重要决策的演变轨迹。'
                    : 'Create life topics and track the evolution of important decisions.'}
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-slate-900/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:border-purple-400/40 transition-all duration-300 hover:transform hover:scale-105">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-lg md:text-xl font-semibold text-purple-200 mb-3">
                  {isZh ? '24/7 全天候' : '24/7 Available'}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {isZh
                    ? '随时随地，无论白天黑夜，AI塔罗师始终在线为您解惑。'
                    : 'Anytime, anywhere. AI tarot reader is always online to guide you.'}
                </p>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="w-full max-w-4xl mt-12 md:mt-16 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-purple-200 mb-8 md:mb-12">
              {isZh ? '🎴 如何使用' : '🎴 How It Works'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative">
              {/* Step 1 */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-purple-500/20 border-2 border-purple-400/50 rounded-full flex items-center justify-center text-2xl font-bold text-purple-200">
                  1
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-purple-200">
                  {isZh ? '提出问题' : 'Ask Question'}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {isZh
                    ? '在输入框中写下你关心的问题，可以是爱情、事业或任何人生决策。'
                    : 'Type your question about love, career, or any life decision.'}
                </p>
              </div>

              {/* Arrow (hidden on mobile) */}
              <div className="hidden md:flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>

              {/* Step 2 */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-purple-500/20 border-2 border-purple-400/50 rounded-full flex items-center justify-center text-2xl font-bold text-purple-200">
                  2
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-purple-200">
                  {isZh ? '抽取塔罗牌' : 'Draw Cards'}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {isZh
                    ? '凭直觉从牌组中选择三张牌，代表过去、现在和未来。'
                    : 'Choose three cards intuitively representing past, present, and future.'}
                </p>
              </div>

              {/* Arrow (hidden on mobile) */}
              <div className="hidden md:flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>

              {/* Step 3 */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-purple-500/20 border-2 border-purple-400/50 rounded-full flex items-center justify-center text-2xl font-bold text-purple-200">
                  3
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-purple-200">
                  {isZh ? '获得解读' : 'Get Reading'}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {isZh
                    ? 'AI 为您深度解析牌意，提供洞察和建议，帮助您做出决策。'
                    : 'AI provides deep analysis, insights, and guidance to help your decision.'}
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="w-full max-w-4xl mt-12 md:mt-16 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-purple-200 mb-8 md:mb-12">
              {isZh ? '💎 定价说明' : '💎 Pricing'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Free Plan */}
              <div className="bg-slate-900/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 md:p-8 hover:border-purple-400/40 transition-all duration-300">
                <div className="text-center mb-6">
                  <h3 className="text-xl md:text-2xl font-bold text-purple-200 mb-2">
                    {isZh ? '免费体验' : 'Free Trial'}
                  </h3>
                  <div className="text-3xl md:text-4xl font-bold text-purple-100 mb-4">
                    {isZh ? '¥0' : '$0'}
                  </div>
                </div>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>{isZh ? '每天 5 次免费占卜' : '5 free readings per day'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>{isZh ? '仅 3 次事件占卜' : 'Only 3 event readings'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>{isZh ? '基础 AI 塔罗解读' : 'Basic AI tarot readings'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>{isZh ? '无需注册' : 'No registration required'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>{isZh ? '三牌阵解读' : 'Three-card spread'}</span>
                  </li>
                </ul>
              </div>

              {/* Premium Plan */}
              <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-400/40 rounded-2xl p-6 md:p-8 hover:border-purple-400/60 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-purple-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                  {isZh ? '推荐' : 'Popular'}
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-xl md:text-2xl font-bold text-purple-100 mb-2">
                    {isZh ? '高级会员' : 'Premium'}
                  </h3>
                  <div className="text-3xl md:text-4xl font-bold text-purple-100 mb-4">
                    {isZh ? '¥29/月' : '$9.9/mo'}
                  </div>
                </div>
                <ul className="space-y-3 text-sm text-slate-200">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span className="font-semibold">{isZh ? '近乎无限次命题和事件占卜' : 'Near unlimited topic & event readings'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>{isZh ? '深度 AI 解读与建议' : 'Deep AI analysis & guidance'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>{isZh ? '命题追踪与管理' : 'Topic tracking & management'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>{isZh ? '历史记录保存' : 'Extended reading history'}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
                {isZh
                  ? 'AI 塔罗提供免费体验版本，包含每日有限次数的解读。用户可选择升级付费方案，以获得无限使用次数、更深入的解读功能和命题追踪管理。'
                  : 'AI Tarot offers a free trial with limited daily usage for new users. Users can upgrade to a premium plan to unlock unlimited readings, advanced features, topic tracking, and extended history.'}
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="w-full max-w-2xl mt-8 text-center bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-500/30 rounded-2xl p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-purple-100 mb-4">
              {isZh ? '准备好探索命运了吗？' : 'Ready to Explore Your Destiny?'}
            </h2>
            <p className="text-slate-300 mb-6 md:mb-8">
              {isZh
                ? '数千人已经通过神秘塔罗 AI 获得了人生指引。现在轮到你了。'
                : 'Thousands have found guidance through Mystic Tarot AI. Now it\'s your turn.'}
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                if (input) {
                  input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  input.focus();
                }
              }}
              className="px-10 py-4 text-lg font-bold"
            >
              {isZh ? '🎯 立即开始免费占卜' : '🎯 Start Free Reading Now'}
            </Button>
          </div>

        </div>
      </div>
    </>
  );
};
