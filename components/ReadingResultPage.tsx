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
}

const markdownComponents = {
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-[17px] font-semibold text-amber-200/90 tracking-wide mb-3 border-l-4 border-amber-400/40 pl-3">
      {children}
    </h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-[15px] font-semibold text-amber-100/90 mb-2">
      {children}
    </h3>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="list-disc list-inside space-y-2 text-slate-200/90 text-[14px]">{children}</ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="list-decimal list-inside space-y-2 text-slate-200/90 text-[14px]">{children}</ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong className="text-amber-300 font-semibold">{children}</strong>
  ),
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="leading-relaxed text-slate-200/90 break-words mb-2 text-[14px]">{children}</p>
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
}) => {
  const isZh = language === 'zh';

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
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Question Title */}
        <div className="text-center mb-8">
          <p className="text-white/60 text-sm mb-2">
            {isZh ? '遇事问题' : 'Your Question'}
          </p>
          <h1 className="text-2xl font-medium text-white">"{question}"</h1>
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
          <div className="text-center mb-6 relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"></div>
            <h2 className="text-amber-400 text-lg font-medium tracking-wide inline-block bg-[#1a1b3a] px-4 relative z-10">
              {isZh ? '命运之解读' : 'Reading Interpretation'}
            </h2>
          </div>

          {isLoading ? (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="flex flex-col items-center justify-center py-12 space-y-6">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-2 border-slate-700"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-t-amber-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl animate-pulse">👁️</span>
                  </div>
                </div>
                <p className="text-purple-100/90 text-sm animate-pulse">
                  {isZh ? '正在解读中...' : 'Reading in progress...'}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 space-y-6">
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                  linkTarget="_blank"
                >
                  {reading}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {!isLoading && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={onSaveTopic}
              disabled={isSaving || topicCreated}
            >
              {topicCreated
                ? (isZh ? '已创建命题' : 'Topic Created')
                : isSaving
                ? (isZh ? '保存中...' : 'Saving...')
                : (isZh ? '保存为命题' : 'Save as Topic')}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onTryAgain}
            >
              {isZh ? '再次占卜' : 'Try Again'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
