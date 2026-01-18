import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import SEOHead from './SEOHead';
import { BreadcrumbNav, getBreadcrumbsForQuickReading } from './BreadcrumbNav';
import { ShareButton } from './ShareButton';
import { ScrollToTopButton } from './ScrollToTopButton';
import { markdownComponents, markdownSchema, normalizeMarkdown } from './markdownConfig';

interface Card {
  id: string;
  name: string;
  nameCn: string;
  imageUrl?: string;
  isReversed: boolean;
  position: number;
}

interface ReadingResultPageProps {
  question: string;
  cards: Card[];
  reading: string;
  language: 'zh' | 'en';
  isLoading: boolean;
  drawCount: number;
  allowGuestReading: boolean;
  onSaveTopic: () => void;
  onTryAgain: () => void;
  isSaving: boolean;
  topicCreated: boolean;
  user?: { id: string; email: string; name?: string } | null;
  onLogin?: () => void;
  onUpgrade?: () => void;
}

export const ReadingResultPage: React.FC<ReadingResultPageProps> = ({
  question,
  cards,
  reading,
  language,
  isLoading,
  drawCount,
  allowGuestReading,
  onSaveTopic,
  onTryAgain,
  isSaving,
  topicCreated,
  user,
  onLogin,
  onUpgrade,
}) => {
  const isZh = language === 'zh';

  // Show login prompt if user is not logged in and reading is empty
  const showLoginPrompt = !allowGuestReading && !user && !reading && !isLoading;

  // Show upgrade prompt if user is logged in but reading is empty (quota exhausted)
  const showUpgradePrompt = !allowGuestReading && user && !reading && !isLoading;

  const getCardPosition = (position: number) => {
    if (isZh) {
      return drawCount === 1 ? '单牌' : (['过去', '现在', '未来'][position] || '事件');
    }
    return drawCount === 1 ? 'Card' : (['Past', 'Present', 'Future'][position] || 'Event');
  };

  const getCardName = (card: Card) => {
    return isZh ? card.nameCn : card.name;
  };

  const getCardStatus = (card: Card) => {
    if (isZh) {
      return card.isReversed ? '逆位' : '正位';
    }
    return card.isReversed ? 'Reversed' : 'Upright';
  };

  return (
    <>
      <SEOHead
        title={isZh
          ? `${question.substring(0, 40)} - AI塔罗占卜结果 | 神秘塔罗`
          : `${question.substring(0, 40)} - AI Tarot Result | Mystic Tarot`}
        description={isZh
          ? `免费AI塔罗占卜结果：${cards.map(c => c.nameCn).join('、')}。专业解读爱情事业财运，洞察过去现在未来。`
          : drawCount === 1
            ? `Free one card tarot draw: ${cards.map(c => c.name).join(', ')}. Quick meaning and focused guidance.`
            : `Free AI tarot reading: ${cards.map(c => c.name).join(', ')}. Professional insights on love, career, fortune. Past, present, future revealed.`}
        url={typeof window !== 'undefined' ? window.location.pathname + window.location.search : (isZh ? '/zh/' : '/')}
        lang={isZh ? 'zh-Hans' : 'en'}
        schemaType="Article"
        type="article"
      />
      <div className="min-h-screen pt-28 md:pt-[136px] pb-8 md:pb-12 px-4 md:px-6 relative overflow-hidden">
      {/* Breadcrumb Navigation */}
      <div className="max-w-full sm:max-w-[600px] md:max-w-[800px] mx-auto relative z-10">
        <BreadcrumbNav
          items={getBreadcrumbsForQuickReading(language)}
          language={language}
        />
      </div>

      {/* Starry Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[3.04px] h-[3.04px] rounded-full bg-white" style={{ left: '1041.07px', top: '512.86px' }} />
        <div className="absolute w-[3.91px] h-[3.91px] rounded-full bg-white" style={{ left: '1801.13px', top: '8.32px' }} />
        <div className="absolute w-[2.76px] h-[2.76px] rounded-full bg-white" style={{ left: '1337.61px', top: '464.88px' }} />
        <div className="absolute w-[2.66px] h-[2.66px] rounded-full bg-white" style={{ left: '636.66px', top: '1170.93px' }} />
        <div className="absolute w-[3.83px] h-[3.83px] rounded-full bg-white" style={{ left: '1401.35px', top: '109.2px' }} />
        <div className="absolute w-[1.29px] h-[1.29px] rounded-full bg-white" style={{ left: '1305.53px', top: '78.16px' }} />
        <div className="absolute w-[3.91px] h-[3.91px] rounded-full bg-white" style={{ left: '180.85px', top: '699.26px' }} />
        <div className="absolute w-[2.22px] h-[2.22px] rounded-full bg-white" style={{ left: '1330.95px', top: '185.83px' }} />
        <div className="absolute w-[2.03px] h-[2.03px] rounded-full bg-white" style={{ left: '743.22px', top: '1072.71px' }} />
        <div className="absolute w-[1.1px] h-[1.1px] rounded-full bg-white" style={{ left: '113.53px', top: '407.83px' }} />
        <div className="absolute w-[2.7px] h-[2.7px] rounded-full bg-white" style={{ left: '1829.39px', top: '377.25px' }} />
        <div className="absolute w-[3.15px] h-[3.15px] rounded-full bg-white" style={{ left: '647.93px', top: '273.7px' }} />
        <div className="absolute w-[3.06px] h-[3.06px] rounded-full bg-white" style={{ left: '294.91px', top: '944.17px' }} />
        <div className="absolute w-[3.6px] h-[3.6px] rounded-full bg-white" style={{ left: '1325.16px', top: '1053.49px' }} />
        <div className="absolute w-[3.54px] h-[3.54px] rounded-full bg-white" style={{ left: '1686.04px', top: '359.38px' }} />
        <div className="absolute w-[2.44px] h-[2.44px] rounded-full bg-white" style={{ left: '797px', top: '580px' }} />
      </div>

      <div className="mx-auto relative z-10 flex flex-col items-center gap-12 md:gap-[72px] max-w-full sm:max-w-[600px] md:max-w-[800px] w-full">
        {/* Question and Cards Section */}
        <div className="flex flex-col items-center gap-10 md:gap-[56px] w-full">
          {/* Question Title */}
          <div className="flex flex-col items-center gap-3 md:gap-[17px] w-full px-4">
            <p className="text-[14px] md:text-[16px] leading-[17px] md:leading-[19px] text-center" style={{ color: 'rgba(205, 191, 238, 0.5)' }}>
              {isZh ? '阁下的问题' : 'Your Question'}
            </p>
            <h1 className="text-[22px] sm:text-[28px] md:text-[32px] font-bold leading-[26px] sm:leading-[34px] md:leading-[38px] text-center" style={{ color: '#E2DBFF' }}>
              "{question}"
            </h1>
          </div>

          {/* Cards Display */}
          <div className="flex justify-center sm:justify-between items-center gap-4 sm:gap-8 md:gap-[100px] w-full flex-wrap sm:flex-nowrap">
            {cards.map((card, idx) => (
              <div key={card.id} className="flex flex-col justify-center items-center gap-4 md:gap-[24px]">
                <div
                  className="rounded-[8px] md:rounded-[12px] overflow-hidden shadow-2xl"
                  style={{
                    width: window.innerWidth < 640 ? '110px' : window.innerWidth < 768 ? '140px' : '180px',
                    height: window.innerWidth < 640 ? '193px' : window.innerWidth < 768 ? '246px' : '316px',
                    transform: card.isReversed ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                >
                  {card.imageUrl ? (
                    <img
                      src={card.imageUrl}
                      alt={`${getCardName(card)} - ${getCardStatus(card)} (${getCardPosition(card.position)})`}
                      loading="lazy"
                      width="180"
                      height="316"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-700/20 to-black flex items-center justify-center">
                      <span className="text-purple-300/40 text-2xl sm:text-3xl md:text-4xl">☾</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center gap-1">
                  <p
                    className="text-[16px] sm:text-[18px] md:text-[20px] leading-[20px] sm:leading-[22px] md:leading-[24px] font-semibold text-center"
                    style={{ color: '#E2DBFF' }}
                  >
                    {getCardName(card)}
                  </p>
                  <p
                    className="text-[12px] sm:text-[13px] md:text-[14px] leading-[16px] sm:leading-[17px] md:leading-[18px] font-normal text-center"
                    style={{ color: '#DD8424' }}
                  >
                    {getCardStatus(card)}
                  </p>
                  <p
                    className="text-[14px] sm:text-[16px] md:text-[18px] leading-[18px] sm:leading-[20px] md:leading-[22px] font-normal text-center"
                    style={{
                      background: 'linear-gradient(90deg, #D5C8FF 0%, #807899 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {getCardPosition(card.position)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reading Content Container */}
        <div className="flex flex-col justify-center items-center gap-6 md:gap-[32px] w-full rounded-[16px] md:rounded-[24px] px-4 sm:px-6 md:px-[32px] py-5 md:py-[24px]"
          style={{
            background: 'rgba(40, 36, 70, 0.5)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)'
          }}
        >
          {/* Title with decorative lines */}
          <div className="flex justify-center items-center gap-4 md:gap-[32px] w-full">
            <div className="w-[60px] sm:w-[90px] md:w-[125px] h-[1px]" style={{ background: 'linear-gradient(90deg, rgba(128, 120, 153, 0) 0%, #D5C8FF 100%)' }} />
            <h2 className="text-[20px] md:text-[24px] font-black leading-[24px] md:leading-[29px] text-center whitespace-nowrap" style={{ color: '#B7ACDC' }}>
              {isZh ? '命运之解读' : 'Reading'}
            </h2>
            <div className="w-[60px] sm:w-[90px] md:w-[125px] h-[1px]" style={{ background: 'linear-gradient(90deg, #D5C8FF 0%, rgba(128, 120, 153, 0) 100%)' }} />
          </div>

          {showLoginPrompt ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-6 w-full">
              <div className="text-center space-y-4">
                <div className="text-5xl mb-4">🔮</div>
                <p className="text-[18px] font-medium" style={{ color: '#E2DBFF' }}>
                  {isZh ? '命运之启示已准备就绪' : 'Your Reading Awaits'}
                </p>
                <p className="text-[14px] text-slate-300/80">
                  {isZh ? '登录后即可查看完整的塔罗解读' : 'Log in to reveal your full tarot reading'}
                </p>
              </div>
              <button
                onClick={onLogin}
                className="flex justify-center items-center px-[64px] py-[12px] rounded-[100px] text-[16px] font-bold hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor: '#DD8424',
                  color: '#000000',
                  opacity: 0.8
                }}
              >
                {isZh ? '登录后查看命运之启示' : 'Login to View Your Reading'}
              </button>
            </div>
          ) : showUpgradePrompt ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-6 w-full">
              <div className="text-center space-y-4">
                <div className="text-5xl mb-4">💎</div>
                <p className="text-[18px] font-medium" style={{ color: '#E2DBFF' }}>
                  {isZh ? '今日免费次数已用完' : 'Daily Free Readings Exhausted'}
                </p>
                <p className="text-[14px] text-slate-300/80">
                  {isZh ? '升级为 Pro 用户，享受每日 30 次免费占卜' : 'Upgrade to Pro for 30 daily readings'}
                </p>
              </div>
              <button
                onClick={onUpgrade}
                className="flex justify-center items-center px-[64px] py-[12px] rounded-[100px] text-[16px] font-bold hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor: '#DD8424',
                  color: '#000000',
                  opacity: 0.8
                }}
              >
                {isZh ? '升级为 Pro 用户' : 'Upgrade to Pro'}
              </button>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-6 w-full">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-slate-700"></div>
                <div className="absolute inset-0 rounded-full border-2 border-t-amber-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl animate-pulse">👁️</span>
                </div>
              </div>
              <p className="text-[16px] animate-pulse" style={{ color: '#E2DBFF' }}>
                {isZh ? '正在解读中...' : 'Reading in progress...'}
              </p>
            </div>
          ) : (
            <div className="w-full">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, [rehypeSanitize, markdownSchema]]}
                components={markdownComponents}
                linkTarget="_blank"
              >
                {normalizeMarkdown(reading)}
              </ReactMarkdown>
            </div>
          )}

          {/* Description and Action Buttons - Only show when not loading */}
          {!isLoading && reading && (
            <>
              <div className="flex flex-col items-start gap-4 md:gap-[20px] w-full">
                {drawCount === 3 && (
                  <p className="text-[12px] md:text-[14px] leading-[18px] md:leading-[22px] text-center w-full px-2" style={{ color: 'rgba(205, 191, 238, 0.5)' }}>
                    {isZh
                      ? '将你的问题创建为一个人生大命题吧！创建后，当你需要对这个人生大命题进行新的启示时，可以再次进行抽牌，延续人生大命题，查看演进记录。'
                      : 'Create a big topic from your question! After creation, when you need new insights, you can draw cards again to continue and view the evolution.'
                    }
                  </p>
                )}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 md:gap-[20px] w-full">
                  {drawCount === 3 && (
                    <button
                      onClick={onSaveTopic}
                      disabled={isSaving || topicCreated}
                      className="flex-1 flex justify-center items-center px-8 md:px-[64px] py-3 md:py-[12px] rounded-[100px] text-[14px] md:text-[16px] font-bold hover:opacity-90 transition-opacity disabled:opacity-50 min-h-[40px] md:h-[43px]"
                      style={{
                        backgroundColor: '#DD8424',
                        color: '#000000',
                        opacity: 0.8
                      }}
                    >
                      {topicCreated
                        ? (isZh ? '已创建命题' : 'Topic Created')
                        : isSaving
                        ? (isZh ? '保存中...' : 'Saving...')
                        : (isZh ? '保存为人生大命题' : 'Save as Big Topic')}
                    </button>
                  )}
                  <button
                    onClick={onTryAgain}
                    className="flex-1 flex justify-center items-center px-6 md:px-[20px] py-3 md:py-[7px] rounded-[100px] text-[14px] md:text-[16px] font-bold hover:opacity-90 transition-opacity min-h-[40px] md:h-[43px]"
                    style={{
                      backgroundColor: 'rgba(189, 161, 255, 0.2)',
                      border: '1px solid rgba(189, 161, 255, 0.2)',
                      color: '#BDA1FF',
                      opacity: 0.8
                    }}
                  >
                    {isZh ? '再次占卜' : 'Try Again'}
                  </button>
                </div>
                {/* Share Button */}
                <div className="w-full flex justify-center mt-2">
                  <ShareButton
                    shareParams={{
                      shareType: 'quick',
                      question,
                      cards,
                      reading,
                      language,
                    }}
                    question={question}
                    language={language}
                    variant="secondary"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>

    {/* Scroll to Top Button */}
    <ScrollToTopButton showAfter={300} />
    </>
  );
};
