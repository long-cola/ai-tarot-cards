import React, { useState, useEffect, useRef } from 'react';
import { Topic, TopicEvent, DrawnCard, Language } from '../types';
import { MAJOR_ARCANA } from '../constants';
import { getTarotReading } from '../services/bailianService';
import { addTopicEvent } from '../services/topicService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TopicDetailPageProps {
  topic: Topic;
  events: TopicEvent[];
  language: Language;
  onBack: () => void;
  onEventAdded?: (event: TopicEvent) => void;
}

const markdownComponents = {
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-[20px] font-bold leading-[28px] tracking-[0.5px] mb-4 text-[rgba(253,230,138,0.9)]">
      {children}
    </h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-[14px] font-semibold leading-[22px] mb-2 text-[#FCD34D]">
      {children}
    </h3>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="list-disc list-inside space-y-2 text-[#A38FFF] text-[14px] leading-[22px] my-4">{children}</ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="list-decimal list-inside space-y-2 text-[#A38FFF] text-[14px] leading-[22px] my-4">{children}</ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="leading-[22px]">{children}</li>
  ),
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong className="text-[#FCD34D] font-semibold">{children}</strong>
  ),
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="leading-[22px] text-[#A38FFF] break-words mb-4 text-[14px] font-semibold">{children}</p>
  ),
};

export const TopicDetailPage: React.FC<TopicDetailPageProps> = ({
  topic,
  events,
  language,
  onBack,
  onEventAdded,
}) => {
  const isZh = language === 'zh';
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set(['baseline']));

  // Page state: 'detail' | 'shuffling' | 'drawing' | 'reading'
  const [pageState, setPageState] = useState<'detail' | 'shuffling' | 'drawing' | 'reading'>('detail');

  // New event creation states
  const [eventName, setEventName] = useState('');
  const [deck, setDeck] = useState<typeof MAJOR_ARCANA>([]);
  const [drawnCard, setDrawnCard] = useState<DrawnCard | null>(null);
  const [isLoadingReading, setIsLoadingReading] = useState(false);
  const [reading, setReading] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const shuffleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const shuffleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize deck
  useEffect(() => {
    setDeck([...MAJOR_ARCANA]);
    return () => {
      if (shuffleIntervalRef.current) clearInterval(shuffleIntervalRef.current);
      if (shuffleTimeoutRef.current) clearTimeout(shuffleTimeoutRef.current);
    };
  }, []);

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

  // Format card label for AI prompt
  const formatCardLabel = (card: DrawnCard) => {
    const name = isZh ? card.nameCn : card.name;
    const status = isZh ? (card.isReversed ? "逆位" : "正位") : (card.isReversed ? "Reversed" : "Upright");
    return `${name} (${status})`;
  };

  // Start divination - go to shuffling page
  const handleStartDivination = () => {
    if (!eventName.trim()) {
      setError(isZh ? '请先输入事件名称' : 'Please enter event name first');
      return;
    }
    setError('');
    setDeck([...MAJOR_ARCANA]);
    setPageState('shuffling');

    // Start shuffling animation
    if (shuffleIntervalRef.current) clearInterval(shuffleIntervalRef.current);
    if (shuffleTimeoutRef.current) clearTimeout(shuffleTimeoutRef.current);

    shuffleIntervalRef.current = setInterval(() => {
      setDeck(prev => [...prev].sort(() => Math.random() - 0.5));
    }, 100);

    shuffleTimeoutRef.current = setTimeout(() => {
      if (shuffleIntervalRef.current) clearInterval(shuffleIntervalRef.current);
      setPageState('drawing');
    }, 3000);
  };

  // Cancel and go back to detail page
  const handleCancel = () => {
    setPageState('detail');
    setEventName('');
    setDrawnCard(null);
    setReading('');
    setError('');
    if (shuffleIntervalRef.current) clearInterval(shuffleIntervalRef.current);
    if (shuffleTimeoutRef.current) clearTimeout(shuffleTimeoutRef.current);
  };

  // Draw a card
  const handleDrawCard = (index: number) => {
    if (pageState !== 'drawing' || drawnCard) return;

    const selectedCard = deck[index];
    const isReversed = Math.random() > 0.5;

    const card: DrawnCard = {
      ...selectedCard,
      isReversed,
      position: 0
    };

    setDrawnCard(card);
    // Go back to detail page immediately
    setPageState('detail');

    // Auto-generate reading in background
    handleGenerateReading(card);
  };

  // Generate AI reading
  const handleGenerateReading = async (card: DrawnCard) => {
    setIsLoadingReading(true);
    setError('');

    try {
      // Prepare variables for prompt template
      const baselineCards = topic.baseline_cards || [];
      const baselineCardsStr = baselineCards.length
        ? baselineCards.map(c => formatCardLabel(c)).join(isZh ? "，" : ", ")
        : (isZh ? "暂无" : "None");

      const historyStr = events.length
        ? events.map(ev => {
            const dateStr = ev.created_at ? new Date(ev.created_at).toLocaleDateString() : '';
            const cardStr = ev.cards?.map(c => formatCardLabel(c as DrawnCard)).join(isZh ? "，" : ", ");
            return isZh
              ? `${dateStr}、${ev.name}${cardStr ? `、${cardStr}` : ""}`
              : `${dateStr}: ${ev.name}${cardStr ? ` | ${cardStr}` : ""}`;
          }).join(isZh ? "；" : "; ")
        : (isZh ? "暂无历史事件" : "No past events");

      const currentCardStr = formatCardLabel(card);

      // Use prompt_case_zh or prompt_case_en
      const promptKey = isZh ? 'prompt_case_zh' : 'prompt_case_en';
      const variables = {
        question: topic.title,
        baseline_cards: baselineCardsStr,
        baseline_reading: topic.baseline_reading || '',
        history: historyStr,
        event_name: eventName.trim(),
        current_card: currentCardStr
      };

      console.log('[TopicDetailPage] Generating reading with variables:', {
        promptKey,
        variables,
        cardName: currentCardStr
      });

      const readingText = await getTarotReading(
        topic.title,
        [card],
        language,
        promptKey,
        variables
      );

      console.log('[TopicDetailPage] Reading generated successfully, length:', readingText.length);
      setReading(readingText);
    } catch (err: any) {
      console.error("[TopicDetailPage] Failed to generate reading", err);
      setError(isZh ? '生成解读失败，请重试' : 'Failed to generate reading');
    } finally {
      setIsLoadingReading(false);
    }
  };

  // Save event
  const handleSaveEvent = async () => {
    if (!drawnCard || !reading) {
      setError(isZh ? '请先抽牌并生成解读' : 'Please draw a card and generate reading first');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const res = await addTopicEvent(topic.id, {
        name: eventName.trim(),
        cards: [drawnCard],
        reading: reading,
      });

      if (res.event && onEventAdded) {
        onEventAdded(res.event);
      }

      // Go back to detail page and reset form
      setPageState('detail');
      setEventName('');
      setDrawnCard(null);
      setReading('');
      setDeck([...MAJOR_ARCANA]);
    } catch (err: any) {
      console.error("Failed to save event", err);
      const reason = err?.data?.reason;
      if (reason === 'event_quota_exhausted') {
        setError(isZh ? '该命题事件次数已用完，请升级会员' : 'Event quota exhausted for this topic');
      } else if (reason === 'downgraded_topic_locked') {
        setError(isZh ? '降级后仅可在最近的命题继续添加事件' : 'Only the latest topic can receive events after downgrade');
      } else {
        setError(isZh ? '保存失败，请重试' : 'Failed to save event');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Sort events by created_at ascending (oldest first) for chronological order
  const sortedEvents = [...events].sort((a, b) => {
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="w-full mx-auto" style={{ maxWidth: '800px' }}>
        {/* Detail Page */}
        {pageState === 'detail' && (
          <>
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
            <div className="flex flex-col items-center gap-[17px] w-full mb-8">
              <p className="text-[16px] leading-[19px] text-center" style={{ color: 'rgba(205, 191, 238, 0.5)' }}>
                {isZh ? '阁下的问题' : 'Your Question'}
              </p>
              <h1 className="text-[32px] font-bold leading-[38px] text-center" style={{ color: '#E2DBFF' }}>
                "{topic.title}"
              </h1>
            </div>

            {/* Event Input at Top */}
            <div className="mb-8 space-y-4 w-full">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-4 w-full min-h-[72px]">
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder={isZh ? '输入你的事件...' : 'Enter your event...'}
                  className="w-full bg-transparent text-white text-[15px] placeholder-white/40 focus:outline-none"
                />
              </div>
              <div className="flex justify-center">
                <button
                  onClick={handleStartDivination}
                  disabled={!eventName.trim()}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-700 disabled:opacity-50 text-slate-900 font-semibold rounded-xl transition-colors"
                >
                  {isZh ? '开始占卜' : 'Start Reading'}
                </button>
              </div>
              {error && (
                <p className="text-center text-sm text-red-400">{error}</p>
              )}
            </div>

        {/* Baseline Reading Section */}
        <div className="mb-6 w-full">
          <button
            onClick={() => toggleEvent('baseline')}
            className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-4 transition-all min-h-[80px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              <div className="text-left">
                <div className="text-[14px] text-slate-400 mb-1">
                  {formatDate(topic.created_at)}
                </div>
                <div className="text-[18px] text-white font-medium">
                  {topic.title}
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
          <div className="space-y-6 w-full">
            {sortedEvents.map((event) => (
              <div key={event.id} className="w-full">
                <button
                  onClick={() => toggleEvent(event.id)}
                  className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-4 transition-all min-h-[80px]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                    <div className="text-left">
                      <div className="text-[14px] text-slate-400 mb-1">
                        {formatDate(event.created_at)}
                      </div>
                      <div className="text-[18px] text-white font-medium">
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

            {/* Current Reading Result - Show at bottom when drawing/reading */}
            {drawnCard && pageState === 'detail' && (
              <div className="mt-8 space-y-6 animate-fade-in w-full">
                <div className="bg-gradient-to-br from-amber-500/10 to-purple-500/10 backdrop-blur-sm border-2 border-amber-400/40 rounded-xl p-6 w-full">
                  <h3 className="text-[16px] text-amber-300 mb-4 tracking-wide flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    {isZh ? '当前占卜' : 'Current Reading'}: {eventName}
                  </h3>

                  {/* Drawn Card */}
                  <div className="mb-6">
                    <h4 className="text-[14px] text-amber-400 mb-4 tracking-wide">
                      {isZh ? '抽牌结果' : 'Card Drawn'}
                    </h4>
                    <div className="flex justify-center">
                      <div className="flex flex-col items-center gap-2 w-32">
                        <div
                          className="w-full aspect-[2/3.5] rounded-lg overflow-hidden border-2 border-amber-400/80 shadow-2xl"
                          style={{
                            transform: drawnCard.isReversed ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                        >
                          {drawnCard.imageUrl ? (
                            <img
                              src={drawnCard.imageUrl}
                              alt={getCardName(drawnCard)}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-700/20 to-black flex items-center justify-center">
                              <span className="text-purple-300/40 text-4xl">☾</span>
                            </div>
                          )}
                        </div>
                        <div className="text-center">
                          <p className="text-white/80 text-[14px]">
                            {getCardName(drawnCard)} ({getCardStatus(drawnCard)})
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Loading Reading */}
                  {isLoadingReading && (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-2 border-slate-700"></div>
                        <div className="absolute inset-0 rounded-full border-2 border-t-amber-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl animate-pulse">👁️</span>
                        </div>
                      </div>
                      <p className="mt-4 text-purple-100/90 text-sm animate-pulse">
                        {isZh ? '正在解读中...' : 'Reading in progress...'}
                      </p>
                    </div>
                  )}

                  {/* Reading Result */}
                  {reading && !isLoadingReading && (
                    <>
                      <div className="mb-6">
                        <h4 className="text-[14px] text-amber-400 mb-4 tracking-wide">
                          {isZh ? '抽牌解读' : 'Reading'}
                        </h4>
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

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 border-t border-white/10">
                        <button
                          onClick={handleSaveEvent}
                          disabled={isSaving}
                          className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-900 font-semibold rounded-xl transition-colors"
                        >
                          {isSaving ? (isZh ? '保存中...' : 'Saving...') : (isZh ? '保存事件' : 'Save Event')}
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={isSaving}
                          className="w-full sm:w-auto px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-xl transition-colors"
                        >
                          {isZh ? '取消' : 'Cancel'}
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {error && (
                  <p className="text-center text-sm text-red-400">{error}</p>
                )}
              </div>
            )}
          </>
        )}

        {/* Shuffling Page - Fullscreen */}
        {pageState === 'shuffling' && (
          <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900 z-50 flex flex-col items-center justify-center animate-fade-in">
            <div className="relative w-40 h-64">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="absolute inset-0 rounded-xl bg-slate-800 border-2 border-purple-900/80 shadow-2xl"
                  style={{
                    transform: `translate(${Math.sin(Date.now() / 80 + i) * 20}px, ${Math.cos(Date.now() / 80 + i) * 10}px) rotate(${Math.sin(Date.now() / 150 + i) * 12}deg)`,
                    transition: 'transform 0.05s linear',
                    zIndex: i
                  }}
                >
                  <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-800/40 via-slate-900 to-black flex items-center justify-center rounded-lg overflow-hidden">
                    <div className="absolute inset-0 border border-white/5 rounded-lg"></div>
                    <span className="text-purple-500/20 text-5xl font-mystic">☾</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-16 text-amber-200/90 tracking-[0.3em] text-lg animate-pulse">
              {isZh ? '洗牌中...' : 'Shuffling...'}
            </p>
          </div>
        )}

        {/* Drawing Page - Fullscreen */}
        {pageState === 'drawing' && (
          <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900 z-50 flex flex-col items-center justify-center px-4 animate-fade-in">
            <p className="text-center text-purple-100 mb-8 text-xl">{isZh ? '请选择一张牌' : 'Choose a card'}</p>
            <div className="relative w-full max-w-2xl h-64">
              {deck.slice(0, 15).map((card, index) => {
                const total = Math.min(deck.length, 15);
                const center = (total - 1) / 2;
                const offset = index - center;
                const degreePerCard = 4;
                const rotation = offset * degreePerCard;
                const translateY = Math.abs(offset) * 2;
                const translateX = offset * 12;

                return (
                  <div
                    key={card.id}
                    onClick={() => handleDrawCard(index)}
                    className="absolute bottom-0 left-1/2 cursor-pointer transition-all duration-300 group"
                    style={{
                      width: '80px',
                      height: '128px',
                      marginLeft: '-40px',
                      transformOrigin: '50% 120%',
                      transform: `translateX(${translateX}px) rotate(${rotation}deg) translateY(${translateY}px)`,
                      zIndex: index + 10,
                    }}
                  >
                    <div className="w-full h-full rounded-md bg-slate-800 border border-purple-500/40 shadow-xl group-hover:-translate-y-4 transition-transform relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-700/20 to-black"></div>
                      <div className="absolute inset-1 border border-white/5 rounded-sm flex items-center justify-center">
                        <span className="text-purple-300/20 text-xl">☾</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={handleCancel}
              className="mt-12 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
            >
              {isZh ? '取消' : 'Cancel'}
            </button>
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
