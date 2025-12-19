import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
  onSaveTopic: () => void;
  onTryAgain: () => void;
  isSaving: boolean;
  topicCreated: boolean;
  user?: { id: string; email: string; name?: string } | null;
  onLogin?: () => void;
}

const markdownComponents = {
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-xl font-semibold text-amber-200/90 tracking-wide mb-3 border-l-4 border-amber-400/40 pl-3">
      {children}
    </h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-lg font-semibold text-amber-100/90 mb-2">
      {children}
    </h3>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="list-disc list-inside space-y-2 text-slate-200/90">{children}</ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="list-decimal list-inside space-y-2 text-slate-200/90">{children}</ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong className="text-amber-300 font-semibold">{children}</strong>
  ),
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="leading-relaxed text-slate-200/90 break-words mb-2">{children}</p>
  ),
};

export const ReadingResultPage: React.FC<ReadingResultPageProps> = ({
  question,
  cards,
  reading,
  language,
  isLoading,
  onSaveTopic,
  onTryAgain,
  isSaving,
  topicCreated,
  user,
  onLogin,
}) => {
  const isZh = language === 'zh';

  // Show login prompt if user is not logged in and reading is empty
  const showLoginPrompt = !user && !reading && !isLoading;

  const getCardPosition = (position: number) => {
    if (isZh) {
      return ['过去', '现在', '未来'][position] || '事件';
    }
    return ['Past', 'Present', 'Future'][position] || 'Event';
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
    <div className="min-h-screen pt-[136px] pb-12 px-4 relative overflow-hidden">
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

      <div className="mx-auto relative z-10 flex flex-col items-center gap-[72px] max-w-[800px] w-full">
        {/* Question and Cards Section */}
        <div className="flex flex-col items-center gap-[56px] w-full">
          {/* Question Title */}
          <div className="flex flex-col items-center gap-[17px] w-full">
            <p className="text-[16px] leading-[19px] text-center" style={{ color: 'rgba(205, 191, 238, 0.5)' }}>
              {isZh ? '阁下的问题' : 'Your Question'}
            </p>
            <h1 className="text-[32px] font-bold leading-[38px] text-center" style={{ color: '#E2DBFF' }}>
              "{question}"
            </h1>
          </div>

          {/* Cards Display */}
          <div className="flex justify-between items-center gap-[100px] w-full">
            {cards.map((card, idx) => (
              <div key={card.id} className="flex flex-col justify-center items-center gap-[24px]" style={{ width: '180px' }}>
                <div
                  className="rounded-[12px] overflow-hidden shadow-2xl"
                  style={{
                    width: '180px',
                    height: '316px',
                    transform: card.isReversed ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                >
                  {card.imageUrl ? (
                    <img
                      src={card.imageUrl}
                      alt={getCardName(card)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-700/20 to-black flex items-center justify-center">
                      <span className="text-purple-300/40 text-4xl">☾</span>
                    </div>
                  )}
                </div>
                <p
                  className="text-[24px] leading-[29px] font-normal text-center"
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
            ))}
          </div>
        </div>

        {/* Reading Content Container */}
        <div className="flex flex-col justify-center items-center gap-[32px] w-full rounded-[24px] px-[32px] py-[24px]"
          style={{
            background: 'rgba(40, 36, 70, 0.5)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)'
          }}
        >
          {/* Title with decorative lines */}
          <div className="flex justify-center items-center gap-[32px] w-full">
            <div className="w-[125px] h-[1px]" style={{ background: 'linear-gradient(90deg, rgba(128, 120, 153, 0) 0%, #D5C8FF 100%)' }} />
            <h2 className="text-[24px] font-black leading-[29px] text-center" style={{ color: '#B7ACDC', minWidth: '120px' }}>
              {isZh ? '命运之解读' : 'Reading'}
            </h2>
            <div className="w-[125px] h-[1px]" style={{ background: 'linear-gradient(90deg, #D5C8FF 0%, rgba(128, 120, 153, 0) 100%)' }} />
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
            <div className="w-full bg-slate-800/60 border border-white/5 rounded-xl p-4 text-sm text-slate-200 break-words whitespace-pre-wrap overflow-wrap-anywhere">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {reading}
              </ReactMarkdown>
            </div>
          )}

          {/* Description and Action Buttons - Only show when not loading */}
          {!isLoading && reading && (
            <>
              <div className="flex flex-col items-start gap-[20px] w-full">
                <p className="text-[14px] leading-[22px] text-center w-full" style={{ color: 'rgba(205, 191, 238, 0.5)' }}>
                  {isZh
                    ? '将你的问题创建为一个人生命题吧！创建后，当你需要对这个人生命题进行新的启示时，可以再次进行抽牌，延续人生命题，查看演进记录。'
                    : 'Create a life topic from your question! After creation, when you need new insights, you can draw cards again to continue and view the evolution.'
                  }
                </p>
                <div className="flex items-start gap-[20px] w-full">
                  <button
                    onClick={onSaveTopic}
                    disabled={isSaving || topicCreated}
                    className="flex-1 flex justify-center items-center px-[64px] py-[12px] rounded-[100px] text-[16px] font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                    style={{
                      backgroundColor: '#DD8424',
                      color: '#000000',
                      opacity: 0.8,
                      height: '43px'
                    }}
                  >
                    {topicCreated
                      ? (isZh ? '已创建命题' : 'Topic Created')
                      : isSaving
                      ? (isZh ? '保存中...' : 'Saving...')
                      : (isZh ? '保存为人生命题' : 'Save as Life Topic')}
                  </button>
                  <button
                    onClick={onTryAgain}
                    className="flex-1 flex justify-center items-center px-[20px] py-[7px] rounded-[100px] text-[16px] font-bold hover:opacity-90 transition-opacity"
                    style={{
                      backgroundColor: 'rgba(189, 161, 255, 0.2)',
                      border: '1px solid rgba(189, 161, 255, 0.2)',
                      color: '#BDA1FF',
                      opacity: 0.8,
                      height: '43px'
                    }}
                  >
                    {isZh ? '再次占卜' : 'Try Again'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
