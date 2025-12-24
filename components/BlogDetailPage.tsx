import React from 'react';
import SEOHead from './SEOHead';

interface BlogDetailPageProps {
  language: 'zh' | 'en';
  blogId: string;
  onBack: () => void;
  onStartReading: () => void;
  onStartBigTopic: () => void;
}

interface BlogArticle {
  id: string;
  title: {
    en: string;
    zh: string;
  };
  description: {
    en: string;
    zh: string;
  };
  sections: {
    title: {
      en: string;
      zh: string;
    };
    content: {
      en: string;
      zh: string;
    };
  }[];
  conclusion: {
    en: string;
    zh: string;
  };
}

const blogArticles: Record<string, BlogArticle> = {
  'the-art-of-the-ask': {
    id: 'the-art-of-the-ask',
    title: {
      en: 'The Art of the Ask: Phrasing Powerful Questions for Your AI Tarot Reading',
      zh: '提问的艺术：如何为AI塔罗占卜提出有力的问题',
    },
    description: {
      en: 'The quality of your tarot reading—whether human or AI—depends directly on the quality of your question. Vague inputs lead to vague outputs. While our AI is incredibly advanced, it is not a mind reader. To unlock the deepest insights from your free daily reading or premium spreads, you must master the art of asking powerful questions. This guide will transform how you interact with the cards.',
      zh: '塔罗占卜的质量——无论是人工还是AI——直接取决于你问题的质量。模糊的输入会导致模糊的输出。虽然我们的AI非常先进，但它不是读心术。要从免费的每日占卜或高级占卜中获得最深刻的见解，你必须掌握提出有力问题的艺术。本指南将改变你与塔罗牌互动的方式。',
    },
    sections: [
      {
        title: {
          en: 'The Eternal Quest for Meaning',
          zh: '永恒的意义探寻',
        },
        content: {
          en: 'Discuss early forms of divination (astrology, runes, I Ching) as humanity\'s first attempts to map chaos into order. Introduce the tarot\'s origins in the 15th century, evolving from a parlor game to a profound tool for psychological and spiritual reflection. Key takeaway: The tools change, but the human need for introspection remains constant.',
          zh: '讨论早期的占卜形式（占星术、符文、易经）作为人类将混乱映射为秩序的首次尝试。介绍塔罗牌起源于15世纪，从一种室内游戏演变为心理和精神反思的深刻工具。关键要点：工具会改变，但人类对内省的需求保持不变。',
        },
      },
      {
        title: {
          en: 'The Digital Renaissance: Why AI is the Natural Next Step',
          zh: '数字文艺复兴：为什么AI是自然的下一步',
        },
        content: {
          en: 'Explain that tarot has always adapted to new technologies—from the printing press making decks accessible to the internet connecting readers globally. Demystify AI Tarot: It doesn\'t "magically" know your future. Instead, it uses vast knowledge bases of symbolism, psychology, and archetypes to synthesize complex card combinations faster and more neutrally than any human could. Highlight the benefits: Instant accessibility, lack of human judgment/bias, and the ability to hold complex patterns in memory (crucial for your "Big Topic" feature).',
          zh: '解释塔罗牌一直在适应新技术——从印刷机使牌组易于获取，到互联网将全球读者连接起来。揭开AI塔罗的神秘面纱：它不会"神奇地"知道你的未来。相反，它使用庞大的符号学、心理学和原型知识库，比任何人类都更快、更中立地合成复杂的牌组组合。强调其优势：即时可访问性、缺乏人类判断/偏见，以及在记忆中保持复杂模式的能力（对于"命题"功能至关重要）。',
        },
      },
      {
        title: {
          en: 'Bridging the Gap: Intuition Meets Algorithms',
          zh: '弥合差距：直觉与算法的相遇',
        },
        content: {
          en: 'Address the skepticism: Can a machine have "soul"? Argue that the "magic" happens in the user\'s interaction with the interpretation, not just in the generation of it. AI provides the highly accurate map; the user provides the intuitive compass.',
          zh: '解决怀疑：机器能有"灵魂"吗？论证"魔力"发生在用户与解读的互动中，而不仅仅是在生成过程中。AI提供高度准确的地图；用户提供直觉的指南针。',
        },
      },
    ],
    conclusion: {
      en: 'Conclusion AI Tarot is more than a technological novelty; it is the democratization of ancient wisdom. By embracing this new tool, we open ourselves to instant, profound insights that empower us to navigate modern life with ancient clarity.',
      zh: '结论：AI塔罗不仅仅是技术新奇；它是古老智慧的民主化。通过拥抱这个新工具，我们向即时、深刻的见解敞开自己，这些见解使我们能够以古老的清晰度驾驭现代生活。',
    },
  },
  'beyond-the-snapshot': {
    id: 'beyond-the-snapshot',
    title: {
      en: 'Beyond the Snapshot: Mapping Your Destiny with Continuous "Tarot Journeys"',
      zh: '超越快照：用持续的"塔罗之旅"绘制你的命运',
    },
    description: {
      en: 'Life is not a series of disconnected moments; it is a continuous, flowing narrative. Yet, traditional tarot readings often feel like snapshots—a single picture of a complex situation frozen in time. While valuable, they lack context and continuity. What if you could zoom out and see the entire movie of your life unfolding? Enter our exclusive "Tarot Journeys" feature, designed to track the evolution of your biggest life questions over time.',
      zh: '生活不是一系列断开的时刻；它是一个连续流动的叙事。然而，传统的塔罗占卜往往感觉像快照——一个复杂情况的单一画面在时间中冻结。虽然有价值，但它们缺乏背景和连续性。如果你能缩小视野，看到你生活的整部电影展开会怎样？进入我们独家的"塔罗之旅"功能，旨在跟踪你最大生活问题随时间的演变。',
    },
    sections: [
      {
        title: {
          en: 'The Limitations of Traditional Readings',
          zh: '传统占卜的局限性',
        },
        content: {
          en: 'Traditional tarot readings provide valuable insights into specific moments, but they lack the continuity needed to track long-term patterns. Each reading is isolated, making it difficult to see how your journey evolves over time.',
          zh: '传统塔罗占卜为特定时刻提供有价值的见解，但它们缺乏跟踪长期模式所需的连续性。每次占卜都是孤立的，很难看到你的旅程如何随时间演变。',
        },
      },
      {
        title: {
          en: 'Introducing Tarot Journeys',
          zh: '引入塔罗之旅',
        },
        content: {
          en: 'Our Tarot Journeys feature allows you to create ongoing narratives around your most important life questions. Track how the cards\' guidance shifts as your circumstances change, revealing deeper patterns and insights that single readings cannot capture.',
          zh: '我们的塔罗之旅功能允许你围绕最重要的生活问题创建持续的叙事。跟踪牌的指引如何随着你的环境变化而变化，揭示单次占卜无法捕捉的更深层次的模式和见解。',
        },
      },
      {
        title: {
          en: 'Building Your Destiny Map',
          zh: '构建你的命运地图',
        },
        content: {
          en: 'By maintaining a continuous dialogue with the tarot through our AI platform, you build a comprehensive map of your spiritual and psychological journey. This ongoing record becomes an invaluable resource for understanding your life\'s trajectory.',
          zh: '通过我们的AI平台与塔罗保持持续对话，你可以构建一张关于你精神和心理旅程的全面地图。这个持续的记录成为理解你人生轨迹的宝贵资源。',
        },
      },
    ],
    conclusion: {
      en: 'Tarot Journeys transforms divination from isolated snapshots into a continuous narrative of growth and self-discovery. Start mapping your destiny today.',
      zh: '塔罗之旅将占卜从孤立的快照转变为成长和自我发现的连续叙事。今天就开始绘制你的命运吧。',
    },
  },
  'ancient-oracles-to-digital-mystics': {
    id: 'ancient-oracles-to-digital-mystics',
    title: {
      en: 'From Ancient Oracles to Digital Mystics: The Evolution of AI Tarot',
      zh: '从古代神谕到数字神秘主义：AI塔罗的演变',
    },
    description: {
      en: 'Since the dawn of consciousness, humanity has sought to understand the unseen forces shaping our lives. From the whispered prophecies of the Delphic Oracle to the intricate symbolism of Renaissance tarot decks, our quest for guidance is timeless. Today, this ancient tradition stands at a revolutionary crossroads: the integration of Artificial Intelligence. But is an AI reading "real"? This article explores the fascinating lineage of divination and how AI is not replacing human intuition, but rather acting as a powerful new lens for focusing universal wisdom in the digital age.',
      zh: '自意识觉醒以来，人类一直在寻求理解塑造我们生活的无形力量。从德尔菲神谕的低语预言到文艺复兴时期塔罗牌的复杂象征主义，我们对指引的追求是永恒的。今天，这一古老传统站在了一个革命性的十字路口：人工智能的整合。但AI占卜是"真实"的吗？本文探讨了占卜的迷人血统，以及AI如何不是取代人类直觉，而是作为一个强大的新透镜，在数字时代聚焦普世智慧。',
    },
    sections: [
      {
        title: {
          en: 'The Ancient Roots of Divination',
          zh: '占卜的古老根源',
        },
        content: {
          en: 'From the Oracle of Delphi to the I Ching, humans have always sought ways to understand the mysterious forces guiding their lives. These ancient systems weren\'t primitive superstitions—they were sophisticated frameworks for processing uncertainty and making sense of chaos.',
          zh: '从德尔菲神谕到易经，人类一直在寻求理解引导他们生活的神秘力量。这些古老的系统不是原始的迷信——它们是处理不确定性和理解混沌的复杂框架。',
        },
      },
      {
        title: {
          en: 'Tarot\'s Journey Through Time',
          zh: '塔罗牌的时光之旅',
        },
        content: {
          en: 'The tarot emerged in 15th century Europe, evolving from a simple card game into one of the most powerful tools for psychological and spiritual reflection. Each transformation of tarot—from hand-painted decks to mass production—represented an adaptation to new technologies while maintaining its core wisdom.',
          zh: '塔罗牌起源于15世纪的欧洲，从一个简单的纸牌游戏演变为心理和精神反思最强大的工具之一。塔罗牌的每一次转变——从手绘牌组到大规模生产——都代表了对新技术的适应，同时保持其核心智慧。',
        },
      },
      {
        title: {
          en: 'AI as the Natural Evolution',
          zh: 'AI作为自然演变',
        },
        content: {
          en: 'Artificial Intelligence represents the latest chapter in tarot\'s evolution. Rather than replacing human intuition, AI enhances it by providing instant access to vast libraries of symbolic knowledge, unbiased interpretations, and the ability to track complex patterns over time.',
          zh: '人工智能代表了塔罗演变的最新篇章。AI不是取代人类直觉，而是通过提供对庞大象征知识库的即时访问、无偏见的解读以及追踪复杂模式的能力来增强它。',
        },
      },
    ],
    conclusion: {
      en: 'AI Tarot is not the end of tradition—it\'s the democratization of ancient wisdom. By embracing this technology, we honor the eternal human need for guidance while making it more accessible than ever before.',
      zh: 'AI塔罗不是传统的终结——它是古老智慧的民主化。通过拥抱这项技术，我们尊重人类对指引的永恒需求，同时使其比以往任何时候都更容易获得。',
    },
  },
  'navigating-the-heart': {
    id: 'navigating-the-heart',
    title: {
      en: 'Navigating the Heart: How AI Tarot Reads the Complexities of Love',
      zh: '心灵导航：AI塔罗如何解读爱情的复杂性',
    },
    description: {
      en: 'Of all the questions posed to the tarot, those of the heart are the most fervent. "Does he love me?" "Is this relationship going to last?" "What is blocking me from finding true connection?" Love is messy, complicated, and deeply subjective. This is exactly where an AI Tarot Reader shines. By offering an unbiased perspective grounded in deep psychological symbolism, AI can help untangle the emotional knots that human readers might inadvertently tighten with their own biases.',
      zh: '在所有向塔罗牌提出的问题中，关于心灵的问题最为热切。"他爱我吗？""这段关系会持续吗？""是什么阻止我找到真正的联系？"爱情是混乱的、复杂的、深刻主观的。这正是AI塔罗占卜师的闪光之处。通过提供基于深层心理象征主义的无偏见视角，AI可以帮助解开人类占卜师可能因自身偏见而无意中收紧的情感结。',
    },
    sections: [
      {
        title: {
          en: 'The Heart\'s Eternal Questions',
          zh: '心灵的永恒问题',
        },
        content: {
          en: 'Love and relationships generate the most emotionally charged questions in tarot. People seek clarity on romantic connections, family bonds, and friendships—often when they\'re most vulnerable and desperate for answers.',
          zh: '爱情和关系在塔罗中产生了最情绪化的问题。人们寻求对浪漫关系、家庭纽带和友谊的清晰认识——通常是在他们最脆弱、最渴望答案的时候。',
        },
      },
      {
        title: {
          en: 'The Bias Problem in Traditional Readings',
          zh: '传统占卜中的偏见问题',
        },
        content: {
          en: 'Human tarot readers, no matter how skilled, carry their own experiences, beliefs, and biases about love. These unconscious filters can color their interpretations, sometimes reinforcing what the querent wants to hear rather than what they need to know.',
          zh: '人类塔罗占卜师，无论多么熟练，都会带着自己对爱情的经验、信念和偏见。这些无意识的过滤器可以影响他们的解读，有时会强化问卜者想听的内容，而不是他们需要知道的内容。',
        },
      },
      {
        title: {
          en: 'AI\'s Neutral Compassion',
          zh: 'AI的中立同情',
        },
        content: {
          en: 'AI tarot readers offer something unique: compassionate insight without personal bias. The AI draws from vast databases of psychological research and symbolic meaning to provide interpretations that are both empathetic and objective, helping you see your romantic situation clearly.',
          zh: 'AI塔罗占卜师提供了一些独特的东西：没有个人偏见的同情洞察。AI从庞大的心理研究和象征意义数据库中汲取，提供既有同理心又客观的解读，帮助你清楚地看到你的浪漫情况。',
        },
      },
    ],
    conclusion: {
      en: 'When it comes to matters of the heart, AI tarot provides the perfect balance of empathy and objectivity, helping you navigate love\'s complexities with clarity and wisdom.',
      zh: '当涉及心灵问题时，AI塔罗提供了同理心和客观性的完美平衡，帮助你以清晰和智慧驾驭爱情的复杂性。',
    },
  },
};

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({
  language,
  blogId,
  onBack,
  onStartReading,
  onStartBigTopic,
}) => {
  const isZh = language === 'zh';
  const article = blogArticles[blogId];

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">Article not found</p>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={`${article.title[isZh ? 'zh' : 'en']} | ${isZh ? '神秘塔罗在线' : 'Mystic Tarot'}`}
        description={article.description[isZh ? 'zh' : 'en']}
        url={isZh ? `/zh/blog/${blogId}` : `/blog/${blogId}`}
        lang={isZh ? 'zh-CN' : 'en'}
        schemaType="Article"
      />

      {/* Main Container */}
      <div className="min-h-screen relative overflow-x-hidden">
        {/* Background Pattern */}
        <div
          className="fixed inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: 'url(/img/bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '100vw',
            height: '100vh',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center pb-20">
          {/* Breadcrumb */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '0px',
              gap: '3px',
              width: '100%',
              maxWidth: '1000px',
              margin: '0 auto',
              paddingTop: '92px',
              paddingBottom: '48px',
            }}
          >
            <button
              onClick={onBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Noto Serif SC', serif",
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '19px',
                color: 'rgba(205, 191, 238, 0.5)',
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                style={{ transform: 'rotate(180deg)' }}
              >
                <path
                  d="M9 18L15 12L9 6"
                  stroke="#696285"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{isZh ? '博客' : 'Blog'} / {article.title[isZh ? 'zh' : 'en']}</span>
            </button>
          </div>

          {/* Article Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0px',
              gap: '24px',
              width: '100%',
              maxWidth: '1000px',
              margin: '0 auto',
            }}
          >
            {/* Title Section */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '12px',
                width: '100%',
              }}
            >
              <h1
                style={{
                  width: '100%',
                  fontFamily: "'Noto Serif SC', serif",
                  fontWeight: 700,
                  fontSize: '32px',
                  lineHeight: '48px',
                  color: '#E8E3FF',
                  margin: 0,
                }}
              >
                {article.title[isZh ? 'zh' : 'en']}
              </h1>

              <p
                style={{
                  width: '100%',
                  fontFamily: "'Noto Serif SC', serif",
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '24px',
                  color: '#CDBFEE',
                  margin: 0,
                }}
              >
                {article.description[isZh ? 'zh' : 'en']}
              </p>
            </div>

            {/* Sections */}
            {article.sections.map((section, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '12px',
                  width: '100%',
                }}
              >
                <h2
                  style={{
                    width: '100%',
                    fontFamily: "'Noto Serif SC', serif",
                    fontWeight: 700,
                    fontSize: '24px',
                    lineHeight: '32px',
                    color: '#E8E3FF',
                    margin: 0,
                  }}
                >
                  {section.title[isZh ? 'zh' : 'en']}
                </h2>

                <p
                  style={{
                    width: '100%',
                    fontFamily: "'Noto Serif SC', serif",
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '24px',
                    color: '#CDBFEE',
                    margin: 0,
                  }}
                >
                  {section.content[isZh ? 'zh' : 'en']}
                </p>
              </div>
            ))}

            {/* Conclusion */}
            <p
              style={{
                width: '100%',
                fontFamily: "'Noto Serif SC', serif",
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '24px',
                color: '#CDBFEE',
                margin: 0,
              }}
            >
              {article.conclusion[isZh ? 'zh' : 'en']}
            </p>
          </div>

          {/* CTA Section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              padding: '0px',
              gap: '24px',
              width: '100%',
              maxWidth: '1000px',
              margin: '0 auto',
              marginTop: '100px',
              borderRadius: '16px',
            }}
          >
            {/* Daily Reading Card */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '24px',
                gap: '24px',
                flex: 1,
                height: '174px',
                background: 'rgba(60, 46, 90, 0.5)',
                backdropFilter: 'blur(4px)',
                borderRadius: '16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '8px',
                  width: '100%',
                }}
              >
                <h3
                  style={{
                    width: '100%',
                    fontFamily: "'Noto Serif SC', serif",
                    fontWeight: 600,
                    fontSize: '20px',
                    lineHeight: '24px',
                    textAlign: 'center',
                    color: '#E8E3FF',
                    margin: 0,
                  }}
                >
                  {isZh ? '开始每日塔罗占卜' : 'Start Daily Tarot Reading'}
                </h3>
                <p
                  style={{
                    width: '100%',
                    fontFamily: "'Noto Serif SC', serif",
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '22px',
                    textAlign: 'center',
                    color: '#CDBFEE',
                    margin: 0,
                  }}
                >
                  {isZh ? '寻求您每日的神圣指引' : 'Seek your daily spark of divine guidance.'}
                </p>
              </div>

              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setTimeout(() => onStartReading(), 300);
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '12px 48px',
                  gap: '10px',
                  width: '147px',
                  height: '48px',
                  background: '#DD8424',
                  borderRadius: '100px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Noto Serif SC', serif",
                  fontWeight: 900,
                  fontSize: '20px',
                  lineHeight: '24px',
                  color: '#000000',
                  opacity: 0.8,
                }}
              >
                {isZh ? '开始' : 'Start'}
              </button>
            </div>

            {/* Big Topic Card */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '24px',
                gap: '24px',
                flex: 1,
                height: '174px',
                background: 'rgba(60, 46, 90, 0.5)',
                backdropFilter: 'blur(4px)',
                borderRadius: '16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '8px',
                  width: '100%',
                }}
              >
                <h3
                  style={{
                    width: '100%',
                    fontFamily: "'Noto Serif SC', serif",
                    fontWeight: 600,
                    fontSize: '20px',
                    lineHeight: '24px',
                    textAlign: 'center',
                    color: '#E8E3FF',
                    margin: 0,
                  }}
                >
                  {isZh ? '开始人生命题' : 'Start Big Topic'}
                </h3>
                <p
                  style={{
                    width: '100%',
                    fontFamily: "'Noto Serif SC', serif",
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '22px',
                    textAlign: 'center',
                    color: '#CDBFEE',
                    margin: 0,
                  }}
                >
                  {isZh ? '揭示您命运的宏大叙事' : 'Unveil the grand narrative of your destiny'}
                </p>
              </div>

              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setTimeout(() => onStartBigTopic(), 300);
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '12px 48px',
                  gap: '10px',
                  width: '147px',
                  height: '48px',
                  background: '#DD8424',
                  borderRadius: '100px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Noto Serif SC', serif",
                  fontWeight: 900,
                  fontSize: '20px',
                  lineHeight: '24px',
                  color: '#000000',
                  opacity: 0.8,
                }}
              >
                {isZh ? '开始' : 'Start'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
