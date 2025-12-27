import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Language } from '../types';

interface FAQSchemaProps {
  language: Language;
}

export const FAQSchema: React.FC<FAQSchemaProps> = ({ language }) => {
  const isZh = language === 'zh';

  const faqData = isZh ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "什么是AI塔罗占卜？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AI塔罗占卜结合了传统塔罗牌的智慧和现代人工智能技术。通过阿里云百炼Qwen模型，我们为您提供深度、个性化的塔罗解读，帮助您从不同角度思考人生问题。"
        }
      },
      {
        "@type": "Question",
        "name": "塔罗占卜准确吗？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "塔罗牌是一种心灵指引工具，而非预测未来的绝对工具。AI模型基于塔罗牌的传统象征意义和您的问题提供解读。准确性取决于您对解读内容的共鸣程度，以及您如何运用这些启示来指导决策。"
        }
      },
      {
        "@type": "Question",
        "name": "如何使用神秘塔罗AI？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "使用非常简单：1) 在首页输入您的问题或困惑；2) 进行虚拟洗牌仪式；3) 从牌阵中抽取三张塔罗牌，分别代表过去、现在和未来；4) AI将为您生成详细的塔罗解读，帮助您理解当前处境和未来走向。"
        }
      },
      {
        "@type": "Question",
        "name": "免费用户和会员有什么区别？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "免费用户每周可创建1个人生命题，每个命题最多3个事件解读。Pro会员每周可创建30个命题，每个命题最多500个事件解读，适合深度探索人生不同阶段和事件的用户。"
        }
      },
      {
        "@type": "Question",
        "name": "什么是人生命题？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "人生命题是您可以长期追踪的重要问题或人生课题。创建命题后，您可以针对这个课题的不同阶段和事件继续抽牌，查看演进轨迹，获得持续的指引。例如「职业发展」命题可以在换工作、升职、创业等不同时刻继续占卜。"
        }
      },
      {
        "@type": "Question",
        "name": "我可以分享塔罗解读吗？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "是的！每次塔罗解读都可以通过分享按钮生成专属链接。您的朋友无需登录即可查看完整的解读内容，包括抽取的牌面和AI的深度分析。"
        }
      },
      {
        "@type": "Question",
        "name": "塔罗牌的过去、现在、未来是什么意思？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "这是经典的三牌阵解读方式。过去牌揭示导致当前情况的因素和背景；现在牌反映您当前的状态和面临的核心问题；未来牌指示如果按当前轨迹发展可能的走向。三张牌共同构成完整的时间线解读。"
        }
      }
    ]
  } : {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is AI Tarot Reading?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AI Tarot Reading combines the wisdom of traditional tarot cards with modern artificial intelligence technology. Powered by Alibaba Cloud's Bailian Qwen model, we provide deep, personalized tarot interpretations to help you think about life questions from different perspectives."
        }
      },
      {
        "@type": "Question",
        "name": "Is tarot reading accurate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Tarot cards are a spiritual guidance tool, not an absolute predictor of the future. The AI model provides interpretations based on the traditional symbolic meanings of tarot cards and your questions. Accuracy depends on how much the interpretation resonates with you and how you use these insights to guide your decisions."
        }
      },
      {
        "@type": "Question",
        "name": "How to use Mystic Tarot AI?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It's very simple: 1) Enter your question or concern on the homepage; 2) Perform the virtual card shuffling ritual; 3) Draw three tarot cards from the spread, representing past, present, and future; 4) The AI will generate a detailed tarot reading to help you understand your current situation and future direction."
        }
      },
      {
        "@type": "Question",
        "name": "What's the difference between free users and members?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Free users can create 1 big topic per week with up to 3 event readings per topic. Pro members can create 30 topics per week with up to 500 event readings per topic, ideal for users who want to deeply explore different life stages and events."
        }
      },
      {
        "@type": "Question",
        "name": "What is a Big Topic?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A Big Topic is an important question or life theme you can track long-term. After creating a topic, you can continue drawing cards for different stages and events related to this theme, viewing the evolution trajectory and receiving ongoing guidance. For example, a 'Career Development' topic can be consulted when changing jobs, getting promoted, or starting a business."
        }
      },
      {
        "@type": "Question",
        "name": "Can I share my tarot reading?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Each tarot reading can generate a unique sharing link via the share button. Your friends can view the complete reading content, including the drawn cards and AI's in-depth analysis, without logging in."
        }
      },
      {
        "@type": "Question",
        "name": "What do Past, Present, and Future cards mean?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "This is the classic three-card spread interpretation method. The Past card reveals factors and background leading to the current situation; the Present card reflects your current state and core issues; the Future card indicates possible outcomes if the current trajectory continues. The three cards together form a complete timeline reading."
        }
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(faqData)}
      </script>
    </Helmet>
  );
};
