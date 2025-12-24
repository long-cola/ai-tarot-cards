import React from 'react';
import { BlogListItem } from './BlogListItem';
import SEOHead from './SEOHead';
import { FAQSchema } from './FAQSchema';

interface BlogListPageProps {
  language: 'zh' | 'en';
  onStartReading: () => void;
  onStartBigTopic: () => void;
  onBlogClick: (blogId: string) => void;
}

export const BlogListPage: React.FC<BlogListPageProps> = ({
  language,
  onStartReading,
  onStartBigTopic,
  onBlogClick,
}) => {
  const isZh = language === 'zh';

  const blogPosts = [
    {
      blogId: 'the-art-of-the-ask',
      image: '/img/blog3.png',
      title: {
        en: 'The Art of the Ask: Phrasing Powerful Questions for Your AI Tarot Reading',
        zh: '提问的艺术：如何为AI塔罗占卜提出有力的问题',
      },
      description: {
        en: 'The quality of your tarot reading—whether human or AI—depends directly on the quality of your question. Vague inputs lead to vague outputs. While our AI is incredibly advanced, it is not a mind reader. To unlock the deepest insights from your free daily reading or premium spreads, you must master the art of asking powerful questions. This guide will transform how you interact with the cards.',
        zh: '塔罗占卜的质量——无论是人工还是AI——直接取决于你问题的质量。模糊的输入会导致模糊的输出。虽然我们的AI非常先进，但它不是读心术。要从免费的每日占卜或高级占卜中获得最深刻的见解，你必须掌握提出有力问题的艺术。本指南将改变你与塔罗牌互动的方式。',
      },
    },
    {
      blogId: 'beyond-the-snapshot',
      image: '/img/blog4.png',
      title: {
        en: 'Beyond the Snapshot: Mapping Your Destiny with Continuous "Tarot Journeys"',
        zh: '超越快照：用持续的"塔罗之旅"绘制你的命运',
      },
      description: {
        en: 'Life is not a series of disconnected moments; it is a continuous, flowing narrative. Yet, traditional tarot readings often feel like snapshots—a single picture of a complex situation frozen in time. While valuable, they lack context and continuity. What if you could zoom out and see the entire movie of your life unfolding? Enter our exclusive "Tarot Journeys" feature, designed to track the evolution of your biggest life questions over time.',
        zh: '生活不是一系列断开的时刻；它是一个连续流动的叙事。然而，传统的塔罗占卜往往感觉像快照——一个复杂情况的单一画面在时间中冻结。虽然有价值，但它们缺乏背景和连续性。如果你能缩小视野，看到你生活的整部电影展开会怎样？进入我们独家的"塔罗之旅"功能，旨在跟踪你最大生活问题随时间的演变。',
      },
    },
    {
      blogId: 'ancient-oracles-to-digital-mystics',
      image: '/img/blog1.png',
      title: {
        en: 'From Ancient Oracles to Digital Mystics: The Evolution of AI Tarot',
        zh: '从古代神谕到数字神秘主义：AI塔罗的演变',
      },
      description: {
        en: 'Since the dawn of consciousness, humanity has sought to understand the unseen forces shaping our lives. From the whispered prophecies of the Delphic Oracle to the intricate symbolism of Renaissance tarot decks, our quest for guidance is timeless. Today, this ancient tradition stands at a revolutionary crossroads: the integration of Artificial Intelligence. But is an AI reading "real"? This article explores the fascinating lineage of divination and how AI is not replacing human intuition, but rather acting as a powerful new lens for focusing universal wisdom in the digital age.',
        zh: '自意识觉醒以来，人类一直在寻求理解塑造我们生活的无形力量。从德尔菲神谕的低语预言到文艺复兴时期塔罗牌的复杂象征主义，我们对指引的追求是永恒的。今天，这一古老传统站在了一个革命性的十字路口：人工智能的整合。但AI占卜是"真实"的吗？本文探讨了占卜的迷人血统，以及AI如何不是取代人类直觉，而是作为一个强大的新透镜，在数字时代聚焦普世智慧。',
      },
    },
    {
      blogId: 'navigating-the-heart',
      image: '/img/blog2.png',
      title: {
        en: 'Navigating the Heart: How AI Tarot Reads the Complexities of Love',
        zh: '心灵导航：AI塔罗如何解读爱情的复杂性',
      },
      description: {
        en: 'Of all the questions posed to the tarot, those of the heart are the most fervent. "Does he love me?" "Is this relationship going to last?" "What is blocking me from finding true connection?" Love is messy, complicated, and deeply subjective. This is exactly where an AI Tarot Reader shines. By offering an unbiased perspective grounded in deep psychological symbolism, AI can help untangle the emotional knots that human readers might inadvertently tighten with their own biases.',
        zh: '在所有向塔罗牌提出的问题中，关于心灵的问题最为热切。"他爱我吗？""这段关系会持续吗？""是什么阻止我找到真正的联系？"爱情是混乱的、复杂的、深刻主观的。这正是AI塔罗占卜师的闪光之处。通过提供基于深层心理象征主义的无偏见视角，AI可以帮助解开人类占卜师可能因自身偏见而无意中收紧的情感结。',
      },
    },
  ];

  return (
    <>
      <SEOHead
        title={isZh ? 'Blog - AI塔罗占卜指南 | 神秘塔罗在线' : 'Blog - AI Tarot Reading Guide | Mystic Tarot'}
        description={isZh
          ? '探索古老智慧与现代科技的交汇点。从深入的塔罗牌含义到AI占卜的科学，了解如何以精准、同理心和每日灵性指导引导您的命运。'
          : 'Explore the intersection of ancient wisdom and modern technology. From in-depth tarot card meanings to the science of AI divination, discover how to navigate your destiny with precision, empathy, and daily spiritual guidance.'}
        url={isZh ? '/zh/blog' : '/blog'}
        lang={isZh ? 'zh-CN' : 'en'}
        schemaType="WebSite"
      />
      <FAQSchema language={language} />

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
          {/* Header Section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '0px',
              gap: '12px',
              width: '100%',
              maxWidth: '1000px',
              margin: '0 auto',
              paddingTop: '136px',
              paddingBottom: '64px',
            }}
          >
            <h1
              style={{
                width: '641px',
                fontFamily: "'Noto Serif SC', serif",
                fontWeight: 700,
                fontSize: '32px',
                lineHeight: '48px',
                textAlign: 'center',
                color: '#E8E3FF',
                margin: 0,
              }}
            >
              {isZh
                ? '天启洞察：AI塔罗与灵性成长的终极指南'
                : 'Celestial Insights: The Ultimate Guide to AI Tarot & Spiritual Growth'}
            </h1>

            <p
              style={{
                width: '100%',
                maxWidth: '1000px',
                fontFamily: "'Noto Serif SC', serif",
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '22px',
                textAlign: 'center',
                color: '#CDBFEE',
                margin: 0,
              }}
            >
              {isZh
                ? '探索古老智慧与现代科技的交汇点。从深入的塔罗牌含义到AI占卜的科学，了解如何以精准、同理心和每日灵性指导驾驭您的命运。'
                : 'Explore the intersection of ancient wisdom and modern technology. From in-depth tarot card meanings to the science of AI divination, discover how to navigate your destiny with precision, empathy, and daily spiritual guidance.'}
            </p>
          </div>

          {/* Blog List */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '0px',
              gap: '36px',
              width: '100%',
              maxWidth: '1000px',
              margin: '0 auto',
            }}
          >
            {blogPosts.map((post, index) => (
              <React.Fragment key={index}>
                <BlogListItem
                  blogId={post.blogId}
                  image={post.image}
                  title={post.title[isZh ? 'zh' : 'en']}
                  description={post.description[isZh ? 'zh' : 'en']}
                  onClick={onBlogClick}
                />
                {index < blogPosts.length - 1 && (
                  <div
                    style={{
                      width: '100%',
                      height: '1px',
                      background: '#302445',
                    }}
                  />
                )}
              </React.Fragment>
            ))}
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
              marginTop: '72px',
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
