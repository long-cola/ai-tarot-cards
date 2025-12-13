import React, { useState } from 'react';
import { Topic, TopicEvent, DrawnCard, Language } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TopicDetailPageProps {
  topic: Topic;
  events: TopicEvent[];
  language: Language;
  onBack: () => void;
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

export const TopicDetailPage: React.FC<TopicDetailPageProps> = ({
  topic,
  events,
  language,
  onBack,
}) => {
  const isZh = language === 'zh';
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set(['baseline']));

  const toggleEvent = (eventId: string) => {
    setExpandedEvents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const getCardName = (card: DrawnCard) => {
    return isZh ? card.nameCn : card.name;
  };

  const getCardStatus = (card: DrawnCard) => {
    if (isZh) {
      return card.isReversed ? '逆位' : '正位';
    }
    return card.isReversed ? 'Reversed' : 'Upright';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isZh ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // Sort events by created_at ascending (oldest first) for chronological order
  const sortedEvents = [...events].sort((a, b) => {
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm">{isZh ? '返回' : 'Back'}</span>
        </button>

        {/* Topic Title */}
        <div className="text-center mb-8">
          <h1 className="text-[24px] font-medium text-white">"{topic.title}"</h1>
        </div>

        {/* Baseline Reading Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleEvent('baseline')}
            className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-4 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              <div className="text-left">
                <div className="text-[14px] text-slate-400 mb-1">
                  {formatDate(topic.created_at)}
                </div>
                <div className="text-[16px] text-white font-medium">
                  {isZh ? '老板今天骂我了' : 'Initial Reading'}
                </div>
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 text-white/60 transition-transform ${
                expandedEvents.has('baseline') ? 'rotate-180' : ''
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {expandedEvents.has('baseline') && (
            <div className="mt-4 space-y-6 animate-fade-in">
              {/* Baseline Cards */}
              {topic.baseline_cards && topic.baseline_cards.length > 0 && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <h3 className="text-[14px] text-amber-400 mb-4 tracking-wide">
                    {isZh ? '塔罗结果' : 'Tarot Cards'}
                  </h3>
                  <div className="flex justify-center gap-4">
                    {topic.baseline_cards.map((card, idx) => (
                      <div key={card.id} className="flex flex-col items-center gap-2 w-28">
                        <div
                          className="w-full aspect-[2/3.5] rounded-lg overflow-hidden border-2 border-amber-400/60 shadow-2xl"
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
                          <p className="text-white/80 text-[13px]">
                            {getCardName(card)} ({getCardStatus(card)})
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Baseline Reading */}
              {topic.baseline_reading && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <h3 className="text-[14px] text-amber-400 mb-4 tracking-wide">
                    {isZh ? '塔罗解读' : 'Reading Interpretation'}
                  </h3>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                      linkTarget="_blank"
                    >
                      {topic.baseline_reading}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Events Section */}
        {sortedEvents.length > 0 && (
          <div className="space-y-6">
            {sortedEvents.map((event) => (
              <div key={event.id}>
                <button
                  onClick={() => toggleEvent(event.id)}
                  className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-4 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                    <div className="text-left">
                      <div className="text-[14px] text-slate-400 mb-1">
                        {formatDate(event.created_at)}
                      </div>
                      <div className="text-[16px] text-white font-medium">
                        {event.name}
                      </div>
                    </div>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 text-white/60 transition-transform ${
                      expandedEvents.has(event.id) ? 'rotate-180' : ''
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {expandedEvents.has(event.id) && (
                  <div className="mt-4 space-y-6 animate-fade-in">
                    {/* Event Cards */}
                    {event.cards && event.cards.length > 0 && (
                      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <h3 className="text-[14px] text-amber-400 mb-4 tracking-wide">
                          {isZh ? '抽牌结果' : 'Cards Drawn'}
                        </h3>
                        <div className="flex justify-center gap-4">
                          {event.cards.map((card, idx) => (
                            <div key={card.id} className="flex flex-col items-center gap-2 w-28">
                              <div
                                className="w-full aspect-[2/3.5] rounded-lg overflow-hidden border-2 border-amber-400/60 shadow-2xl"
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
                                <p className="text-white/80 text-[13px]">
                                  {getCardName(card)} ({getCardStatus(card)})
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Event Reading */}
                    {event.reading && (
                      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <h3 className="text-[14px] text-amber-400 mb-4 tracking-wide">
                          {isZh ? '抽牌解读' : 'Reading'}
                        </h3>
                        <div className="prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={markdownComponents}
                            linkTarget="_blank"
                          >
                            {event.reading}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
