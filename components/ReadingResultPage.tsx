import React from 'react';
import { Button } from './ui';
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
    <h2 className="text-xl font-semibold text-amber-200/90 tracking-wide mb-3 border-l-4 border-amber-400/40 pl-3 mt-4">
      {children}
    </h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-lg font-semibold text-amber-100/90 mb-2 mt-3">
      {children}
    </h3>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="list-disc list-inside space-y-2 text-slate-200/90 my-3">{children}</ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="list-decimal list-inside space-y-2 text-slate-200/90 my-3">{children}</ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong className="text-amber-300 font-semibold">{children}</strong>
  ),
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="leading-relaxed text-slate-200/90 break-words mb-3">{children}</p>
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
    <div className="min-h-screen pt-24 pb-12 px-4 relative overflow-hidden">
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
        <div className="absolute w-[2px] h-[2px] rounded-full bg-white" style={{ left: '743px', top: '1072px' }} />
        <div className="absolute w-[1px] h-[1px] rounded-full bg-white" style={{ left: '113px', top: '407px' }} />
      </div>

      <div className="mx-auto relative z-10" style={{ maxWidth: '800px' }}>
        {/* Question Title */}
        <div className="text-center mb-8">
          <p className="text-[16px] leading-[19px] mb-3" style={{ color: 'rgba(205, 191, 238, 0.5)' }}>
            {isZh ? '遇事问题' : 'Your Question'}
          </p>
          <h1 className="text-[24px] font-bold leading-[29px]" style={{ color: '#E2DBFF' }}>"{question}"</h1>
        </div>

        {/* Cards Display */}
        <div className="flex justify-center gap-6 mb-8">
          {cards.map((card, idx) => (
            <div key={card.id} className="flex flex-col items-center gap-3 w-32">
              <div
                className="w-full aspect-[2/3.5] rounded-lg overflow-hidden border-2 border-amber-400/40 shadow-2xl"
                style={{
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
              <div className="text-center">
                <p className="text-amber-400 text-sm font-medium mb-1">
                  {getCardPosition(card.position)}
                </p>
                <p className="text-white/80 text-xs">
                  {getCardName(card)} ({getCardStatus(card)})
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Reading Content */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-[24px] font-bold leading-[29px]" style={{ color: '#E2DBFF' }}>
              {isZh ? '命运之解读' : 'Reading Interpretation'}
            </h2>
          </div>

          {showLoginPrompt ? (
            <div className="rounded-[16px] p-8" style={{ backgroundColor: 'rgba(40, 36, 70, 0.8)', borderColor: '#443E71', border: '1px solid' }}>
              <div className="flex flex-col items-center justify-center py-12 space-y-6">
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
                  className="px-8 py-4 rounded-[12px] text-[18px] font-bold hover:opacity-90 transition-opacity"
                  style={{
                    backgroundColor: 'rgb(221, 132, 37)',
                    color: '#000000',
                    minWidth: '228px',
                    height: '56px'
                  }}
                >
                  {isZh ? '登录后查看命运之启示' : 'Login to View Your Reading'}
                </button>
              </div>
            </div>
          ) : isLoading ? (
            <div className="rounded-[16px] p-8" style={{ backgroundColor: 'rgba(40, 36, 70, 0.8)', borderColor: '#443E71', border: '1px solid' }}>
              <div className="flex flex-col items-center justify-center py-12 space-y-6">
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
            </div>
          ) : (
            <div className="rounded-[16px] p-8" style={{ backgroundColor: 'rgba(40, 36, 70, 0.8)', borderColor: '#443E71', border: '1px solid' }}>
              <div className="max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                >
                  {reading}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons - Only show when not loading */}
        {!isLoading && reading && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onSaveTopic}
              disabled={isSaving || topicCreated}
              className="px-8 py-4 rounded-[12px] text-[20px] font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{
                backgroundColor: 'rgb(221, 132, 37)',
                color: '#000000',
                minWidth: '228px',
                height: '56px'
              }}
            >
              {topicCreated
                ? (isZh ? '已创建命题' : 'Topic Created')
                : isSaving
                ? (isZh ? '保存中...' : 'Saving...')
                : (isZh ? '保存为命题' : 'Save as Topic')}
            </button>
            <button
              onClick={onTryAgain}
              className="px-8 py-4 rounded-[12px] text-[20px] font-bold hover:opacity-90 transition-opacity border"
              style={{
                backgroundColor: 'transparent',
                color: '#E2DBFF',
                borderColor: '#443E71',
                minWidth: '228px',
                height: '56px'
              }}
            >
              {isZh ? '再次占卜' : 'Try Again'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
