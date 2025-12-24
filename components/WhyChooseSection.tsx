import React from 'react';
import { IconFeatureCard } from './ui';

interface WhyChooseSectionProps {
  language: 'zh' | 'en';
}

export const WhyChooseSection: React.FC<WhyChooseSectionProps> = ({ language }) => {
  const isZh = language === 'zh';

  const features = [
    {
      icon: '/img/image 15.png',
      title: isZh ? '每日免费占卜' : 'Daily Free Reading',
      description: isZh
        ? '每天享受一次免费的AI塔罗占卜。通过塔罗牌的智慧，为您最迫切的问题找到即时的清晰答案。'
        : 'Embrace the cosmos with one free AI-powered reading every day. Find instant clarity for your burning questions through the wisdom of the cards.',
    },
    {
      icon: '/img/image 16.png',
      title: isZh ? '精准与同理心' : 'Precision & Empathy',
      description: isZh
        ? '体验深度共鸣，我们的先进AI能映照您的灵魂。我们将古老象征与现代心理学相结合，提供细腻而真诚的指引。'
        : 'Experience deep resonance as our advanced AI mirrors your soul. We blend ancient symbolism with modern psychology for nuanced, heartfelt guidance.',
    },
    {
      icon: '/img/image 16.png',
      title: isZh ? '独家"塔罗之旅"' : 'Exclusive "Tarot Journeys"',
      description: isZh
        ? '超越当下时刻，体验我们的标志性"塔罗之旅"功能。通过持续的牌阵追踪您命运的演变，揭示人生的宏大叙事。'
        : 'Move beyond the moment with our signature "Tarot Journeys." Track your destiny\'s evolution through continuous spreads that reveal your life\'s grand narrative.',
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 16px',
        gap: '36px',
        width: '100%',
      }}
    >
      {/* Title */}
      <h2
        style={{
          fontFamily: "'Noto Serif SC', serif",
          fontWeight: 700,
          fontSize: '32px',
          lineHeight: '48px',
          color: '#E8E3FF',
          textAlign: 'center',
          width: '100%',
        }}
      >
        {isZh ? '为什么选择我们的AI塔罗？' : 'Why Choose Our AI Tarot?'}
      </h2>

      {/* Features Grid */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0px',
          gap: '48px',
          width: '100%',
        }}
      >
        {features.map((feature, index) => (
          <IconFeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
};
