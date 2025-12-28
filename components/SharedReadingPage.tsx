import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import SEOHead from './SEOHead';
import { BreadcrumbNav, getBreadcrumbsForSharedReading } from './BreadcrumbNav';
import { getSharedReading, ShareData } from '../services/shareService';
import { DrawnCard, Language } from '../types';

interface SharedReadingPageProps {
  shareId: string;
  language: Language;
}

const markdownSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    'br',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
  ],
};

const markdownComponents = {
  h1: ({ children }: { children: React.ReactNode }) => (
    <h1 className="text-[20px] sm:text-[22px] md:text-[24px] font-bold leading-[28px] sm:leading-[30px] md:leading-[32px] tracking-[0.5px] mb-3 md:mb-4 text-[rgba(253,230,138,0.95)]">
      {children}
    </h1>
  ),
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-[18px] sm:text-[19px] md:text-[20px] font-bold leading-[24px] sm:leading-[26px] md:leading-[28px] tracking-[0.5px] mb-3 md:mb-4 text-[rgba(253,230,138,0.9)]">
      {children}
    </h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-[13px] sm:text-[13.5px] md:text-[14px] font-semibold leading-[20px] md:leading-[22px] mb-2 text-[#FCD34D]">
      {children}
    </h3>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="list-disc list-outside pl-5 space-y-1.5 md:space-y-2 text-[#A38FFF] text-[13px] md:text-[14px] leading-[20px] md:leading-[22px] my-3 md:my-4">{children}</ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="list-decimal list-outside pl-5 space-y-1.5 md:space-y-2 text-[#A38FFF] text-[13px] md:text-[14px] leading-[20px] md:leading-[22px] my-3 md:my-4">{children}</ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="leading-[20px] md:leading-[22px] [&>p]:m-0 [&>p]:inline">{children}</li>
  ),
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong className="text-[#FCD34D] font-semibold">{children}</strong>
  ),
  em: ({ children }: { children: React.ReactNode }) => (
    <em className="text-[#E8D6FF] italic">{children}</em>
  ),
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="leading-[20px] md:leading-[22px] text-[#A38FFF] break-words mb-3 md:mb-4 text-[13px] sm:text-[13.5px] md:text-[14px] font-semibold">{children}</p>
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-4 border-[#9D7FF5] pl-4 py-2 my-4 text-[#B8A5E0] italic">
      {children}
    </blockquote>
  ),
  code: ({ children }: { children: React.ReactNode }) => (
    <code className="bg-[rgba(189,161,255,0.15)] px-2 py-1 rounded text-[#E8D6FF] text-[13px]">
      {children}
    </code>
  ),
  table: ({ children }: { children: React.ReactNode }) => (
    <div className="w-full overflow-x-auto my-4">
      <table className="w-full border-collapse text-left text-[#A38FFF] text-[13px] md:text-[14px] leading-[20px] md:leading-[22px]">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: { children: React.ReactNode }) => (
    <thead className="bg-white/5">{children}</thead>
  ),
  tbody: ({ children }: { children: React.ReactNode }) => (
    <tbody className="divide-y divide-white/10">{children}</tbody>
  ),
  tr: ({ children }: { children: React.ReactNode }) => (
    <tr className="align-top">{children}</tr>
  ),
  th: ({ children }: { children: React.ReactNode }) => (
    <th className="px-3 py-2 text-[#FCD34D] font-semibold border-b border-white/10">
      {children}
    </th>
  ),
  td: ({ children }: { children: React.ReactNode }) => (
    <td className="px-3 py-2 align-top break-words whitespace-pre-line">
      {children}
    </td>
  ),
  hr: () => (
    <hr className="my-6 border-[rgba(189,161,255,0.2)]" />
  ),
};

export const SharedReadingPage: React.FC<SharedReadingPageProps> = ({
  shareId,
  language,
}) => {
  const [data, setData] = useState<ShareData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isZh = language === 'zh';

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
              {(() => {
                let cleanedReading = data.reading;
                if (cleanedReading.startsWith('```markdown\n') || cleanedReading.startsWith('```md\n') || cleanedReading.startsWith('```\n')) {
                  cleanedReading = cleanedReading.replace(/^```(?:markdown|md)?\n/, '');
                  cleanedReading = cleanedReading.replace(/\n```\s*$/, '');
                }

                return (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, [rehypeSanitize, markdownSchema]]}
                    components={markdownComponents}
                    linkTarget="_blank"
                  >
                    {cleanedReading.replace(/<br\s*\/?>/gi, '<br />')}
                  </ReactMarkdown>
                );
              })()}
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
