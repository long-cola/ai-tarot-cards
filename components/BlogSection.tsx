import React from 'react';
import { BlogCard } from './ui';

interface BlogSectionProps {
  language: 'zh' | 'en';
  onBlogClick?: (blogId: string) => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ language, onBlogClick }) => {
  const isZh = language === 'zh';

  const blogPosts = [
    {
      blogId: 'ancient-oracles-to-digital-mystics',
      image: '/img/blog1.png',
      title: {
        en: 'From Ancient Oracles to Digital Mystics: The Evolution of AI Tarot',
        zh: '从古代神谕到数字神秘主义：AI塔罗的演变',
      },
      description: {
        en: 'Since the dawn of consciousness, humanity has sought to understand the unseen forces shaping our lives. From the whispered prophecies of the Delphic Oracle to the intricate symbolism of Renaissance tarot decks, our quest for guidance is timeless.',
        zh: '自意识觉醒以来，人类一直在寻求理解塑造我们生活的无形力量。从德尔菲神谕的低语预言到文艺复兴时期塔罗牌的复杂象征主义，我们对指引的追求是永恒的。',
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
        en: 'Of all the questions posed to the tarot, those of the heart are the most fervent. Love is messy, complicated, and deeply subjective. This is exactly where an AI Tarot Reader shines.',
        zh: '在所有向塔罗牌提出的问题中，关于心灵的问题最为热切。爱情是混乱的、复杂的、深刻主观的。这正是AI塔罗占卜师的闪光之处。',
      },
    },
    {
      blogId: 'the-art-of-the-ask',
      image: '/img/blog3.png',
      title: {
        en: 'The Art of the Ask: Phrasing Powerful Questions for Your AI Tarot Reading',
        zh: '提问的艺术：如何为AI塔罗占卜提出有力的问题',
      },
      description: {
        en: 'The quality of your tarot reading depends directly on the quality of your question. To unlock the deepest insights, you must master the art of asking powerful questions.',
        zh: '塔罗占卜的质量直接取决于你问题的质量。要获得最深刻的见解，你必须掌握提出有力问题的艺术。',
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
        en: 'Life is not a series of disconnected moments; it is a continuous, flowing narrative. Enter our exclusive "Tarot Journeys" feature, designed to track the evolution of your biggest life questions.',
        zh: '生活不是一系列断开的时刻；它是一个连续流动的叙事。进入我们独家的"塔罗之旅"功能，旨在跟踪你最大生活问题的演变。',
      },
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
        {isZh ? '博客文章' : 'Blog Articles'}
      </h2>

      {/* Blog Grid - 2 rows x 2 columns */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '48px',
          width: '100%',
        }}
      >
        {/* Row 1 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '32px',
            justifyContent: 'center',
          }}
        >
          {blogPosts.slice(0, 2).map((post, index) => (
            <BlogCard
              key={index}
              image={post.image}
              title={post.title[isZh ? 'zh' : 'en']}
              description={post.description[isZh ? 'zh' : 'en']}
              onClick={() => onBlogClick?.(post.blogId)}
            />
          ))}
        </div>

        {/* Row 2 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '32px',
            justifyContent: 'center',
          }}
        >
          {blogPosts.slice(2, 4).map((post, index) => (
            <BlogCard
              key={index + 2}
              image={post.image}
              title={post.title[isZh ? 'zh' : 'en']}
              description={post.description[isZh ? 'zh' : 'en']}
              onClick={() => onBlogClick?.(post.blogId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
