import React, { useState } from 'react';
import { Language } from '../types';

interface BigTopicIntroPageProps {
  language: Language;
  onStartNewTopic: (topicTitle: string) => void;
  onViewMyTopics: () => void;
}

/**
 * Big Topic Introduction & Landing Page
 *
 * Explains the concept of Big Topics and allows users to:
 * 1. Start a new Big Topic by entering a title
 * 2. View their existing Big Topics
 */
export const BigTopicIntroPage: React.FC<BigTopicIntroPageProps> = ({
  language,
  onStartNewTopic,
  onViewMyTopics,
}) => {
  const isZh = language === 'zh';
  const [topicTitle, setTopicTitle] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleStart = () => {
    if (topicTitle.trim()) {
      onStartNewTopic(topicTitle.trim());
    }
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen pt-28 md:pt-32 pb-12 px-4 md:px-6 relative overflow-hidden" style={{ background: '#140F2A' }}>
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute w-full h-full" style={{
          backgroundImage: 'url(/img/starry-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
      </div>

      {/* Blur overlays */}
      <div className="absolute top-0 left-0 w-full h-[400px]" style={{
        background: '#140F2A',
        filter: 'blur(200px)',
      }} />

      <div className="max-w-[1000px] mx-auto relative z-10">
        {/* Hero Section */}
        <div className="flex flex-col items-center gap-3 mb-12 md:mb-16">
          <h1 className="text-[28px] md:text-[32px] font-bold leading-[1.5] text-center" style={{ color: '#E8E3FF' }}>
            {isZh
              ? '深度塔罗之旅：持续 AI 解读人生大命题'
              : 'Deep Tarot Journeys: Continuous AI Reading for Life\'s Big Questions'}
          </h1>
          <p className="text-[14px] leading-[1.57] text-center max-w-[1000px]" style={{ color: '#CDBFEE' }}>
            {isZh
              ? '传统塔罗只给你快照。但人生是故事，不是照片。我们的持续塔罗分析帮助你连接过去、现在和未来的点。'
              : 'Traditional tarot apps only give you a snapshot. But life is a story, not a photo. Our continuous tarot analysis helps you connect the dots between your past, present, and future.'}
          </p>
        </div>

        {/* Input and Buttons Section */}
        <div className="flex flex-col items-center gap-9 mb-24 md:mb-32">
          <input
            type="text"
            value={topicTitle}
            onChange={(e) => setTopicTitle(e.target.value)}
            placeholder={isZh ? '请输入新命题' : 'Please enter the new topic'}
            className="w-full max-w-[1000px] px-6 py-6 text-[20px] md:text-[24px] font-semibold text-center rounded-2xl outline-none"
            style={{
              background: 'transparent',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              color: topicTitle ? '#E8E3FF' : '#9B83C6',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && topicTitle.trim()) {
                handleStart();
              }
            }}
          />

          <div className="flex flex-col sm:flex-row items-center gap-9">
            <button
              onClick={handleStart}
              disabled={!topicTitle.trim()}
              className="px-16 py-4 rounded-full text-[20px] font-black transition-opacity"
              style={{
                background: '#DD8424',
                color: '#000000',
                opacity: topicTitle.trim() ? 0.8 : 0.5,
                cursor: topicTitle.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              {isZh ? '开始' : 'Start'}
            </button>

            <button
              onClick={onViewMyTopics}
              className="px-16 py-4 rounded-full text-[20px] font-black transition-opacity"
              style={{
                background: 'rgba(189, 161, 255, 0.2)',
                border: '1px solid rgba(189, 161, 255, 0.2)',
                color: '#BDA1FF',
                opacity: 0.8,
              }}
            >
              {isZh ? '我的人生大命题' : 'My Big Topics'}
            </button>
          </div>
        </div>

        {/* Start Step-by-Step Section */}
        <div className="flex flex-col items-center gap-9 mb-24 md:mb-32">
          <h2 className="text-[28px] md:text-[32px] font-bold leading-[1.5] text-center" style={{ color: '#E8E3FF' }}>
            {isZh ? '开始一步步' : 'Start Step-by-Step'}
          </h2>

          <div className="flex flex-col md:flex-row items-start justify-center gap-12 w-full">
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-6 flex-1 max-w-[301px]">
              <div className="w-[100px] h-[100px] rounded-full flex items-center justify-center" style={{
                background: '#230E34',
                border: '1px solid rgba(171, 128, 158, 0.5)',
              }}>
                <span className="text-[48px] font-black" style={{ color: '#EFD9EE' }}>1</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <h3 className="text-[20px]" style={{ color: '#E8E3FF' }}>
                  {isZh ? '1.定义你的人生大命题' : '1.Define Your Big Topic'}
                </h3>
                <p className="text-[14px] leading-[1.57] text-center" style={{ color: '#CDBFEE' }}>
                  {isZh ? '输入一个核心关注点，如"我的创业之旅"' : 'Enter a core concern like "My Entrepreneurial Journey."'}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-6 flex-1 max-w-[301px]">
              <div className="w-[100px] h-[100px] rounded-full flex items-center justify-center" style={{
                background: '#230E34',
                border: '1px solid rgba(171, 128, 158, 0.5)',
              }}>
                <span className="text-[48px] font-black" style={{ color: '#EFD9EE' }}>2</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <h3 className="text-[20px]" style={{ color: '#E8E3FF' }}>
                  {isZh ? '2.连续性解读' : '2.Sequential Spreads'}
                </h3>
                <p className="text-[14px] leading-[1.57] text-center" style={{ color: '#CDBFEE' }}>
                  {isZh ? '每次新解读都基于之前的上下文，而不是重新开始' : 'Instead of a reset, each new reading builds upon the previous context.'}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-6 flex-1 max-w-[301px]">
              <div className="w-[100px] h-[100px] rounded-full flex items-center justify-center" style={{
                background: '#230E34',
                border: '1px solid rgba(171, 128, 158, 0.5)',
              }}>
                <span className="text-[48px] font-black" style={{ color: '#EFD9EE' }}>3</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <h3 className="text-[20px]" style={{ color: '#E8E3FF' }}>
                  {isZh ? '3.AI 综合分析' : '3.AI Synthesis'}
                </h3>
                <p className="text-[14px] leading-[1.57] text-center" style={{ color: '#CDBFEE' }}>
                  {isZh ? '我们的 AI 分析趋势和重复出现的牌，提供整体视角' : 'Our AI analyzes the trends and recurring cards to provide a holistic view'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Case Studies Section */}
        <div className="flex flex-col items-center gap-9 mb-24 md:mb-32">
          <h2 className="text-[28px] md:text-[32px] font-bold leading-[1.5] text-center" style={{ color: '#E8E3FF' }}>
            {isZh ? '案例研究' : 'Case Studies'}
          </h2>

          <div className="flex flex-col md:flex-row items-start justify-center gap-8 w-full">
            {/* Case 1 */}
            <div className="flex flex-col items-center gap-6 flex-1 max-w-[312px]">
              <div className="w-full h-[180px] rounded-2xl flex items-center justify-center" style={{
                background: '#230E34',
                border: '1px solid rgba(171, 128, 158, 0.5)',
              }}>
                <div className="w-[120px] h-[120px] rounded-full flex items-center justify-center" style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}>
                  <span className="text-[48px]">🔥</span>
                </div>
              </div>
              <h3 className="text-[20px] text-center" style={{ color: '#E8E3FF' }}>
                {isZh ? '双生火焰之旅' : 'Twin Flame Journey'}
              </h3>
            </div>

            {/* Case 2 */}
            <div className="flex flex-col items-center gap-6 flex-1 max-w-[312px]">
              <div className="w-full h-[180px] rounded-2xl flex items-center justify-center" style={{
                background: '#230E34',
                border: '1px solid rgba(171, 128, 158, 0.5)',
              }}>
                <div className="w-[120px] h-[120px] rounded-full flex items-center justify-center" style={{
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                }}>
                  <span className="text-[48px]">💼</span>
                </div>
              </div>
              <h3 className="text-[20px] text-center" style={{ color: '#E8E3FF' }}>
                {isZh ? '职业转型' : 'Career Transformation'}
              </h3>
            </div>

            {/* Case 3 */}
            <div className="flex flex-col items-center gap-6 flex-1 max-w-[312px]">
              <div className="w-full h-[180px] rounded-2xl flex items-center justify-center" style={{
                background: '#230E34',
                border: '1px solid rgba(171, 128, 158, 0.5)',
              }}>
                <div className="w-[120px] h-[120px] rounded-full flex items-center justify-center" style={{
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                }}>
                  <span className="text-[48px]">🌙</span>
                </div>
              </div>
              <h3 className="text-[20px] text-center" style={{ color: '#E8E3FF' }}>
                {isZh ? '30天灵性成长' : '30-Day Spiritual Growth'}
              </h3>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="flex flex-col items-center gap-9 mb-16">
          <h2 className="text-[28px] md:text-[32px] font-bold leading-[1.5] text-center" style={{ color: '#E8E3FF' }}>
            FAQ
          </h2>

          <div className="flex flex-col gap-0 w-full max-w-[1000px]">
            {/* FAQ 1 */}
            <div
              className="py-4 cursor-pointer"
              style={{ borderBottom: '1px solid #302545' }}
              onClick={() => toggleFaq(0)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[18px] md:text-[20px]" style={{ color: '#E8E3FF' }}>
                  {isZh ? '什么是 AI 塔罗中的"人生大命题"？' : 'What is a \'Big Topic\' in AI Tarot?'}
                </h3>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="transition-transform"
                  style={{
                    transform: expandedFaq === 0 ? 'rotate(0deg)' : 'rotate(180deg)',
                  }}
                >
                  <path d="M6 9L12 15L18 9" stroke="#E8E3FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {expandedFaq === 0 && (
                <p className="mt-2 text-[14px] leading-[1.57]" style={{ color: '#CDBFEE' }}>
                  {isZh
                    ? '人生大命题是一个持久的解读容器。与一次性会话不同，AI 会记住你之前的牌和情况的演变。'
                    : 'A Big Topic is a persistent reading container. Unlike a one-off session, the AI remembers your previous cards and the evolution of your situation.'}
                </p>
              )}
            </div>

            {/* FAQ 2 */}
            <div
              className="py-4 cursor-pointer"
              style={{ borderBottom: '1px solid #302545' }}
              onClick={() => toggleFaq(1)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[18px] md:text-[20px]" style={{ color: '#E8E3FF' }}>
                  {isZh ? '我可以跟踪几个月的感情生活吗？' : 'Can I track my love life over several months?'}
                </h3>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="transition-transform"
                  style={{
                    transform: expandedFaq === 1 ? 'rotate(0deg)' : 'rotate(180deg)',
                  }}
                >
                  <path d="M6 9L12 15L18 9" stroke="#E8E3FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {expandedFaq === 1 && (
                <p className="mt-2 text-[14px] leading-[1.57]" style={{ color: '#CDBFEE' }}>
                  {isZh
                    ? '可以！我们的持续塔罗解读功能专为长期跟踪关系和个人成长而设计。'
                    : 'Yes! Our Continuous Tarot Reading feature is designed specifically for long-term tracking of relationships and personal growth.'}
                </p>
              )}
            </div>

            {/* FAQ 3 */}
            <div
              className="py-4 cursor-pointer"
              style={{ borderBottom: '1px solid #302545' }}
              onClick={() => toggleFaq(2)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[18px] md:text-[20px]" style={{ color: '#E8E3FF' }}>
                  {isZh ? '这比传统的三张牌解读更好吗？' : 'Is this better than a traditional 3-card spread?'}
                </h3>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="transition-transform"
                  style={{
                    transform: expandedFaq === 2 ? 'rotate(0deg)' : 'rotate(180deg)',
                  }}
                >
                  <path d="M6 9L12 15L18 9" stroke="#E8E3FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {expandedFaq === 2 && (
                <p className="mt-2 text-[14px] leading-[1.57]" style={{ color: '#CDBFEE' }}>
                  {isZh
                    ? '虽然三张牌解读非常适合快速回答，但我们的旅程功能提供复杂生活转变的360度视角。'
                    : 'While 3-card spreads are great for quick answers, our Journey feature provides a 360-degree view of complex life transitions.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
