import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import SEOHead from './SEOHead';
import { BreadcrumbNav, getBreadcrumbsForSharedReading } from './BreadcrumbNav';
import { getSharedReading, AnyShareData, TopicFullShareData } from '../services/shareService';
import { DrawnCard, Language } from '../types';
import { markdownComponents, markdownSchema, normalizeMarkdown } from './markdownConfig';

// Type guard for topic_full share data
function isTopicFullShareData(data: AnyShareData): data is TopicFullShareData {
  return data.shareType === 'topic_full';
}

interface SharedReadingPageProps {
  shareId: string;
  language: Language;
}

export const SharedReadingPage: React.FC<SharedReadingPageProps> = ({
  shareId,
  language,
}) => {
  const [data, setData] = useState<AnyShareData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['baseline']));
  const isZh = language === 'zh';

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isZh ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  useEffect(() => {
    const fetchSharedReading = async () => {
      try {
        setLoading(true);
        const shareData = await getSharedReading(shareId);
        setData(shareData);
      } catch (err: any) {
        console.error('[SharedReadingPage] Error fetching shared reading:', err);
        setError(isZh ? '无法加载分享内容' : 'Failed to load shared content');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedReading();
  }, [shareId, isZh]);

  const getCardName = (card: DrawnCard) => {
    return isZh ? card.nameCn : card.name;
  };

  const getCardStatus = (card: DrawnCard) => {
    if (isZh) {
      return card.isReversed ? '逆位' : '正位';
    }
    return card.isReversed ? 'Reversed' : 'Upright';
  };

  const getCardPosition = (position: number) => {
    if (isZh) {
      return ['过去', '现在', '未来'][position] || '事件';
    }
    return ['Past', 'Present', 'Future'][position] || 'Event';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-slate-700"></div>
            <div className="absolute inset-0 rounded-full border-2 border-t-amber-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl animate-pulse">👁️</span>
            </div>
          </div>
          <p className="text-white text-sm">{isZh ? '加载中...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-white text-lg">{error || (isZh ? '分享内容不存在' : 'Shared content not found')}</p>
          <a href={isZh ? '/zh/' : '/'} className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors">
            {isZh ? '返回首页' : 'Go Home'}
          </a>
        </div>
      </div>
    );
  }

  // Render timeline for topic_full
  if (isTopicFullShareData(data)) {
    return (
      <>
        <SEOHead
          title={isZh ? `${data.topicTitle.substring(0, 40)} - AI塔罗命题解读 | 免费在线` : `${data.topicTitle.substring(0, 40)} - AI Tarot Topic Reading | Free Online`}
          description={isZh
            ? `免费查看完整塔罗命题解读：${data.topicTitle}。AI专业解析命运轨迹，时间线展示事件发展。`
            : `Free AI tarot topic reading: ${data.topicTitle}. Professional analysis of destiny, timeline of events.`}
          url={typeof window !== 'undefined'
            ? window.location.pathname + window.location.search
            : `${isZh ? '/zh' : ''}/?shareId=${shareId}`}
          lang={isZh ? 'zh-Hans' : 'en'}
          schemaType="Article"
          type="article"
        />
        <div className="min-h-screen pt-28 md:pt-[136px] pb-8 md:pb-12 px-4 md:px-6 relative overflow-hidden">
          {/* Breadcrumb */}
          <div className="max-w-full sm:max-w-[600px] md:max-w-[800px] mx-auto relative z-10">
            <BreadcrumbNav
              items={getBreadcrumbsForSharedReading(data.topicTitle, language)}
              language={language}
            />
          </div>

          {/* Background decorations */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-[3px] h-[3px] rounded-full bg-white" style={{ left: '1041px', top: '512px' }} />
            <div className="absolute w-[4px] h-[4px] rounded-full bg-white" style={{ left: '1801px', top: '8px' }} />
            <div className="absolute w-[3px] h-[3px] rounded-full bg-white" style={{ left: '1337px', top: '464px' }} />
          </div>

          <div className="mx-auto relative z-10 flex flex-col items-center gap-8 md:gap-12 max-w-full sm:max-w-[600px] md:max-w-[800px] w-full">
            {/* Share Badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-400/30">
              <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span className="text-purple-200 text-xs font-medium">
                {isZh ? '朋友分享的塔罗命题' : 'Tarot Topic Shared by Friend'}
              </span>
            </div>

            {/* Topic Title */}
            <div className="flex flex-col items-center gap-3 w-full px-4">
              <p className="text-[14px] md:text-[16px] text-center" style={{ color: 'rgba(205, 191, 238, 0.5)' }}>
                {isZh ? '命题' : 'Topic'}
              </p>
              <h1 className="text-[22px] sm:text-[28px] md:text-[32px] font-bold text-center" style={{ color: '#E2DBFF' }}>
                "{data.topicTitle}"
              </h1>
            </div>

            {/* Timeline */}
            <div className="w-full">
              {/* Timeline line */}
              <div className="relative">
                <div className="absolute left-4 md:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/60 via-purple-400/40 to-purple-500/20" />

                {/* Baseline Section */}
                <div className="relative pl-10 md:pl-14 pb-8">
                  {/* Timeline dot */}
                  <div className="absolute left-2.5 md:left-4 top-1 w-3 h-3 rounded-full bg-amber-500 border-2 border-slate-900 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />

                  {/* Section header */}
                  <button
                    onClick={() => toggleSection('baseline')}
                    className="flex items-center gap-3 w-full text-left group"
                  >
                    <div className="flex-1">
                      <p className="text-xs text-slate-500">{formatDate(data.createdAt)}</p>
                      <h3 className="text-lg md:text-xl font-bold text-amber-400 group-hover:text-amber-300 transition-colors">
                        {isZh ? '初始解读' : 'Initial Reading'}
                      </h3>
                    </div>
                    <svg
                      className={`w-5 h-5 text-slate-500 transition-transform ${expandedSections.has('baseline') ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Expanded content */}
                  {expandedSections.has('baseline') && data.baseline && (
                    <div className="mt-4 space-y-4">
                      {/* Cards */}
                      {data.baseline.cards && data.baseline.cards.length > 0 && (
                        <div className="flex gap-3 flex-wrap">
                          {data.baseline.cards.map((card, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-2">
                              <div
                                className="w-16 h-28 md:w-20 md:h-36 rounded-lg overflow-hidden border border-purple-500/30 shadow-lg"
                                style={{ transform: card.isReversed ? 'rotate(180deg)' : 'none' }}
                              >
                                {card.imageUrl ? (
                                  <img src={card.imageUrl} alt={getCardName(card)} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-purple-700/20 to-black flex items-center justify-center">
                                    <span className="text-purple-300/40 text-xl">☾</span>
                                  </div>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 text-center">
                                {getCardName(card)}
                                <br />
                                <span className={card.isReversed ? 'text-purple-400' : 'text-amber-400'}>
                                  {getCardStatus(card)}
                                </span>
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reading */}
                      {data.baseline.reading && (
                        <div
                          className="rounded-xl px-4 py-4 md:px-5 md:py-5"
                          style={{ background: 'rgba(40, 36, 70, 0.5)' }}
                        >
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw, [rehypeSanitize, markdownSchema]]}
                            components={markdownComponents}
                          >
                            {normalizeMarkdown(data.baseline.reading)}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Events */}
                {data.events && data.events.map((event, index) => (
                  <div key={event.id} className="relative pl-10 md:pl-14 pb-8">
                    {/* Timeline dot */}
                    <div className="absolute left-2.5 md:left-4 top-1 w-3 h-3 rounded-full bg-purple-500 border-2 border-slate-900" />

                    {/* Section header */}
                    <button
                      onClick={() => toggleSection(event.id)}
                      className="flex items-center gap-3 w-full text-left group"
                    >
                      <div className="flex-1">
                        <p className="text-xs text-slate-500">{formatDate(event.createdAt)}</p>
                        <h3 className="text-lg md:text-xl font-bold text-purple-300 group-hover:text-purple-200 transition-colors">
                          {event.name}
                        </h3>
                      </div>
                      <svg
                        className={`w-5 h-5 text-slate-500 transition-transform ${expandedSections.has(event.id) ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Expanded content */}
                    {expandedSections.has(event.id) && (
                      <div className="mt-4 space-y-4">
                        {/* Cards */}
                        {event.cards && event.cards.length > 0 && (
                          <div className="flex gap-3 flex-wrap">
                            {event.cards.map((card, idx) => (
                              <div key={idx} className="flex flex-col items-center gap-2">
                                <div
                                  className="w-16 h-28 md:w-20 md:h-36 rounded-lg overflow-hidden border border-purple-500/30 shadow-lg"
                                  style={{ transform: card.isReversed ? 'rotate(180deg)' : 'none' }}
                                >
                                  {card.imageUrl ? (
                                    <img src={card.imageUrl} alt={getCardName(card)} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-purple-700/20 to-black flex items-center justify-center">
                                      <span className="text-purple-300/40 text-xl">☾</span>
                                    </div>
                                  )}
                                </div>
                                <p className="text-xs text-slate-400 text-center">
                                  {getCardName(card)}
                                  <br />
                                  <span className={card.isReversed ? 'text-purple-400' : 'text-amber-400'}>
                                    {getCardStatus(card)}
                                  </span>
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reading */}
                        {event.reading && (
                          <div
                            className="rounded-xl px-4 py-4 md:px-5 md:py-5"
                            style={{ background: 'rgba(40, 36, 70, 0.5)' }}
                          >
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypeRaw, [rehypeSanitize, markdownSchema]]}
                              components={markdownComponents}
                            >
                              {normalizeMarkdown(event.reading)}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col items-center gap-4 mt-4 w-full">
              <p className="text-[12px] md:text-[14px] text-center text-slate-400">
                {isZh ? '想要获得属于自己的塔罗解读吗?' : 'Want your own Tarot reading?'}
              </p>
              <a
                href="/"
                className="inline-flex justify-center items-center px-8 py-3 rounded-full text-[14px] md:text-[16px] font-bold hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#DD8424', color: '#000000', opacity: 0.8 }}
              >
                {isZh ? '开始我的塔罗占卜' : 'Start My Reading'}
              </a>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Regular share types (quick, topic_event, topic_baseline)
  const cards = data.cards || [];

  return (
    <>
      <SEOHead
        title={isZh ? `${data.question.substring(0, 40)} - AI塔罗占卜结果 | 免费在线解读` : `${data.question.substring(0, 40)} - AI Tarot Reading Result | Free Online`}
        description={isZh
          ? `免费查看这个塔罗占卜解读：${data.question}。AI专业解析爱情事业财运，三牌阵深度洞察过去现在未来。`
          : `Free AI tarot reading: ${data.question}. Professional analysis on love, career, fortune. Three-card spread reveals past, present, future.`}
        url={typeof window !== 'undefined'
          ? window.location.pathname + window.location.search
          : `${isZh ? '/zh' : ''}/?shareId=${shareId}`}
        lang={isZh ? 'zh-Hans' : 'en'}
        schemaType="Article"
        type="article"
      />
      <div className="min-h-screen pt-28 md:pt-[136px] pb-8 md:pb-12 px-4 md:px-6 relative overflow-hidden">
        {/* Breadcrumb Navigation */}
        <div className="max-w-full sm:max-w-[600px] md:max-w-[800px] mx-auto relative z-10">
          <BreadcrumbNav
            items={getBreadcrumbsForSharedReading(data.question, language)}
            language={language}
          />
        </div>

        {/* Starry Background Decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[3px] h-[3px] rounded-full bg-white" style={{ left: '1041px', top: '512px' }} />
          <div className="absolute w-[4px] h-[4px] rounded-full bg-white" style={{ left: '1801px', top: '8px' }} />
          <div className="absolute w-[3px] h-[3px] rounded-full bg-white" style={{ left: '1337px', top: '464px' }} />
          <div className="absolute w-[3px] h-[3px] rounded-full bg-white" style={{ left: '636px', top: '1170px' }} />
          <div className="absolute w-[4px] h-[4px] rounded-full bg-white" style={{ left: '1401px', top: '109px' }} />
          <div className="absolute w-[2px] h-[2px] rounded-full bg-white" style={{ left: '1305px', top: '78px' }} />
          <div className="absolute w-[4px] h-[4px] rounded-full bg-white" style={{ left: '180px', top: '699px' }} />
          <div className="absolute w-[2px] h-[2px] rounded-full bg-white" style={{ left: '1330px', top: '185px' }} />
        </div>

        <div className="mx-auto relative z-10 flex flex-col items-center gap-12 md:gap-[72px] max-w-full sm:max-w-[600px] md:max-w-[800px] w-full">
          {/* Share Badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-400/30">
            <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="text-purple-200 text-xs font-medium">
              {isZh ? '朋友分享的塔罗解读' : 'Tarot Reading Shared by Friend'}
            </span>
          </div>

          {/* Question and Cards Section */}
          <div className="flex flex-col items-center gap-10 md:gap-[56px] w-full">
            {/* Question Title */}
            <div className="flex flex-col items-center gap-3 md:gap-[17px] w-full px-4">
              <p className="text-[14px] md:text-[16px] leading-[17px] md:leading-[19px] text-center" style={{ color: 'rgba(205, 191, 238, 0.5)' }}>
                {isZh ? '占卜问题' : 'Question'}
              </p>
              <h1 className="text-[22px] sm:text-[28px] md:text-[32px] font-bold leading-[26px] sm:leading-[34px] md:leading-[38px] text-center" style={{ color: '#E2DBFF' }}>
                "{data.question}"
              </h1>
              {data.topicTitle && data.topicTitle !== data.question && (
                <p className="text-[12px] md:text-[14px] text-center text-slate-400">
                  {isZh ? '所属命题' : 'Topic'}: {data.topicTitle}
                </p>
              )}
            </div>

            {/* Cards Display */}
            {cards.length > 0 && (
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
                          alt={`${getCardName(card)} - ${getCardStatus(card)} ${card.position !== undefined ? `(${getCardPosition(card.position)})` : ''}`}
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
                    <p
                      className="text-[18px] sm:text-[20px] md:text-[24px] leading-[22px] sm:leading-[24px] md:leading-[29px] font-normal text-center"
                      style={{
                        background: 'linear-gradient(90deg, #D5C8FF 0%, #807899 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {card.position !== undefined ? getCardPosition(card.position) : getCardName(card)}
                    </p>
                  </div>
                ))}
              </div>
            )}
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

            {/* Reading Content */}
            <div className="w-full">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, [rehypeSanitize, markdownSchema]]}
                components={markdownComponents}
                linkTarget="_blank"
              >
                {normalizeMarkdown(data.reading)}
              </ReactMarkdown>
            </div>

            {/* CTA */}
            <div className="flex flex-col items-center gap-4 mt-4 w-full">
              <p className="text-[12px] md:text-[14px] text-center text-slate-400">
                {isZh ? '想要获得属于自己的塔罗解读吗?' : 'Want your own Tarot reading?'}
              </p>
              <a
                href="/"
                className="inline-flex justify-center items-center px-8 py-3 rounded-full text-[14px] md:text-[16px] font-bold hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor: '#DD8424',
                  color: '#000000',
                  opacity: 0.8
                }}
              >
                {isZh ? '开始我的塔罗占卜' : 'Start My Reading'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
