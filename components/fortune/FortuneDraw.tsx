import React, { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { DrawnCard } from '../../types';
import { MAJOR_ARCANA } from '../../constants';
import { getTarotReading } from '../../services/bailianService';
import { buildLocalFortuneReading, FortuneReadingTopic } from './fortuneReading';
import { markdownComponents, markdownSchema, normalizeMarkdown } from '../markdownConfig';
import { Button } from '../ui/Button';

interface FortuneDrawProps {
  defaultCount: 1 | 3;
  allowedCounts: Array<1 | 3>;
  topic: FortuneReadingTopic;
  defaultQuestion: string;
}

const AI_ERROR_SENTINEL = 'Connection to the spiritual realm';

const shuffleDeck = () => {
  const shuffled = [...MAJOR_ARCANA];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const drawCards = (count: number): DrawnCard[] => {
  const shuffled = shuffleDeck();
  return shuffled.slice(0, count).map((card, index) => ({
    ...card,
    isReversed: Math.random() > 0.5,
    position: index,
  }));
};

export const FortuneDraw: React.FC<FortuneDrawProps> = ({
  defaultCount,
  allowedCounts,
  topic,
  defaultQuestion,
}) => {
  const [drawCount, setDrawCount] = useState<1 | 3>(defaultCount);
  const [question, setQuestion] = useState(defaultQuestion);
  const [cards, setCards] = useState<DrawnCard[]>([]);
  const [reading, setReading] = useState('');
  const [readingSource, setReadingSource] = useState<'local' | 'ai'>('local');
  const [isReadingLoading, setIsReadingLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState<'idle' | 'loading' | 'failed' | 'success'>('idle');

  const supportsToggle = allowedCounts.length > 1;
  const hasResult = cards.length > 0 && reading;
  const cardGridCols = cards.length > 1 ? 'md:grid-cols-3' : 'md:grid-cols-1';

  const drawnCards = useMemo(() => cards, [cards]);

  useEffect(() => {
    setCards([]);
    setReading('');
    setAiStatus('idle');
    setReadingSource('local');
  }, [drawCount]);

  const handleDraw = async () => {
    const nextCards = drawCards(drawCount);
    setCards(nextCards);

    const localReading = buildLocalFortuneReading(nextCards, topic, question);
    setReading(localReading);
    setReadingSource('local');
    setAiStatus('loading');
    setIsReadingLoading(true);

    try {
      const aiReading = await getTarotReading(question || defaultQuestion, nextCards, 'en');
      if (aiReading && !aiReading.includes(AI_ERROR_SENTINEL)) {
        setReading(aiReading);
        setReadingSource('ai');
        setAiStatus('success');
      } else {
        setAiStatus('failed');
      }
    } catch (error) {
      setAiStatus('failed');
    } finally {
      setIsReadingLoading(false);
    }
  };

  return (
    <div id="fortune-draw" className="w-full max-w-5xl mx-auto mt-10">
      <div className="bg-[#0F172A]/60 border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-[20px] md:text-[24px] font-semibold text-[#E8E3FF]">
                Draw your fortune cards
              </h2>
              <p className="text-[13px] md:text-[14px] text-white/70 mt-2">
                Choose 1 card for a quick signal or 3 cards for a fuller story.
              </p>
            </div>
            {supportsToggle && (
              <div className="flex items-center gap-2">
                {allowedCounts.map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setDrawCount(count)}
                    className={`px-4 py-2 rounded-full text-[12px] md:text-[13px] font-semibold transition-colors ${
                      drawCount === count
                        ? 'bg-[#DD8424] text-black'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {count}-Card
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <input
              type="text"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Enter your focus question"
              className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-[13px] md:text-[14px] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#DD8424]"
            />
            <Button size="md" onClick={handleDraw} disabled={isReadingLoading}>
              Draw Now
            </Button>
          </div>

          {cards.length > 0 && (
            <div className={`grid grid-cols-1 ${cardGridCols} gap-4`}>
              {drawnCards.map((card) => (
                <div
                  key={`${card.name}-${card.position}`}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center"
                >
                  <img
                    src={card.imageUrl}
                    alt={`${card.name} card`}
                    className={`w-24 h-40 object-cover rounded-lg shadow-lg ${card.isReversed ? 'rotate-180' : ''}`}
                    loading="lazy"
                  />
                  <p className="text-[13px] text-[#E8E3FF] mt-3 font-semibold">
                    {card.name}
                  </p>
                  {cards.length > 1 && (
                    <p className="text-[11px] text-white/50">
                      {['Past', 'Present', 'Future'][card.position] || `Card ${card.position + 1}`}
                    </p>
                  )}
                  <p className="text-[12px] text-white/60">
                    {card.isReversed ? 'Reversed' : 'Upright'}
                  </p>
                </div>
              ))}
            </div>
          )}

          {hasResult && (
            <div className="mt-4 bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                <p className="text-[12px] uppercase tracking-[0.2em] text-white/50">
                  {readingSource === 'ai' ? 'AI reading' : 'Instant reading'}
                </p>
                {aiStatus === 'failed' && (
                  <span className="text-[12px] text-amber-200/80">
                    AI unavailable. Showing instant interpretation.
                  </span>
                )}
              </div>
              {isReadingLoading && readingSource === 'local' && (
                <p className="text-[13px] text-white/60 mb-3">Enhancing with AI...</p>
              )}
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
        </div>
      </div>
    </div>
  );
};
