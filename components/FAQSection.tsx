import React from 'react';
import { Accordion } from './ui';

interface FAQSectionProps {
  language: 'zh' | 'en';
}

export const FAQSection: React.FC<FAQSectionProps> = ({ language }) => {
  const isZh = language === 'zh';

  const faqs = [
    {
      question: isZh ? 'AI塔罗占卜是如何工作的？' : 'How does AI Tarot Reading work?',
      answer: isZh
        ? '我们的平台将古老的塔罗象征与先进的AI技术相结合。通过分析您所选牌面在特定问题背景下的原型意义，我们的AI提供细腻、富有同理心且个性化的解读，在传统智慧与现代心理学之间架起桥梁。'
        : 'Our platform combines ancient tarot symbolism with advanced AI technology. By analyzing the archetypes of your selected cards in the context of your specific question, our AI provides a nuanced, empathetic, and personalized interpretation that bridges the gap between traditional wisdom and modern psychology.',
    },
    {
      question: isZh ? 'AI塔罗占卜和人工占卜一样准确吗？' : 'Is an AI tarot reading as accurate as a human reader',
      answer: isZh
        ? 'AI塔罗占卜具有独特优势。虽然缺少直觉的人性触感，但它基于广泛的塔罗象征和心理学知识提供无偏见、一致的解读。我们的AI经过数千次占卜训练，提供能够补充传统占卜的深刻洞察。'
        : 'AI tarot readings offer unique advantages. While they lack the intuitive human touch, they provide unbiased, consistent interpretations based on extensive knowledge of tarot symbolism and psychology. Our AI has been trained on thousands of readings, offering insights that complement traditional readings.',
    },
    {
      question: isZh ? '我的占卜内容是私密的吗？' : 'Is my reading private?',
      answer: isZh
        ? '绝对保密。您的问题和占卜内容完全私密且保密。我们不会与第三方分享您的个人信息或占卜历史。您与塔罗牌的旅程只属于您自己。'
        : 'Absolutely. Your questions and readings are completely private and confidential. We do not share your personal information or reading history with third parties. Your journey with the cards is yours alone.',
    },
    {
      question: isZh ? '我能获得多少次免费占卜？' : 'How many free readings can I get?',
      answer: isZh
        ? '我们为所有用户提供每日一次的免费占卜。这让您能够体验我们AI解读的深度和质量。如需无限次数占卜和使用塔罗之旅等高级功能，请考虑升级为会员计划。'
        : 'We offer one free reading per day for all users. This allows you to experience the depth and quality of our AI interpretations. For unlimited readings and access to premium features like Tarot Journeys, consider upgrading to our premium plan.',
    },
    {
      question: isZh ? '什么是"人生命题"（塔罗之旅）？' : 'What is a "Big Topic" (Tarot Journey)?',
      answer: isZh
        ? '"人生命题"或"塔罗之旅"是我们的独特功能，允许您跟踪特定的人生问题或情境的演变。您可以看到牌面指引如何随情况发展而演变，为您的人生叙事提供持续洞察，而不是孤立的快照。'
        : 'A "Big Topic" or "Tarot Journey" is our unique feature that allows you to track a specific life question or situation over time. Instead of isolated snapshots, you can see how the cards\' guidance evolves as your situation develops, providing continuous insight into your life\'s narrative.',
    },
    {
      question: isZh ? '我可以自己选择牌吗？' : 'Can I choose my own cards?',
      answer: isZh
        ? '当然可以！我们的平台允许您像传统塔罗占卜一样直觉性地选择自己的牌。相信您的直觉，选择对您有召唤的牌。然后AI会在您的问题背景下解读您的选择。'
        : 'Yes! Our platform allows you to select your own cards intuitively, just like a traditional tarot reading. Trust your instincts and choose the cards that call to you. The AI will then interpret your selection in the context of your question.',
    },
    {
      question: isZh ? '我可以问同一个问题两次吗？' : 'Can I ask the same question twice?',
      answer: isZh
        ? '可以，您可以多次询问同一个问题。但我们建议在两次占卜之间等待一段时间，因为随着情况演变，塔罗牌往往会揭示新的洞察。频繁占卜同一问题可能不会提供额外的清晰度。'
        : 'Yes, you can ask the same question multiple times. However, we recommend waiting some time between readings on the same question, as the cards often reveal new insights as situations evolve. Frequent readings on the same question may not provide additional clarity.',
    },
    {
      question: isZh ? '塔罗是一种算命吗？' : 'Is Tarot a form of fortune-telling?',
      answer: isZh
        ? '塔罗更适合理解为反思和洞察的工具，而非算命。塔罗牌不预测固定的未来，而是基于您当前的道路照亮模式、能量和潜在结果。您始终拥有自由意志来做出塑造命运的选择。'
        : 'Tarot is better understood as a tool for reflection and insight rather than fortune-telling. The cards don\'t predict a fixed future, but rather illuminate patterns, energies, and potential outcomes based on your current path. You always have free will to make choices that shape your destiny.',
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
        maxWidth: '1000px',
        margin: '0 auto',
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
        {isZh ? '常见问题' : 'FAQ'}
      </h2>

      {/* FAQ List */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        {faqs.map((faq, index) => (
          <Accordion
            key={index}
            title={faq.question}
            content={faq.answer}
            defaultOpen={index === 0}
          />
        ))}
      </div>
    </div>
  );
};
