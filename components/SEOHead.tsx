import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  type?: 'website' | 'article';
  image?: string;
  url?: string;
  lang?: 'zh-CN' | 'en';
  schemaType?: 'WebSite' | 'Service' | 'Article';
}

const SEOHead: React.FC<SEOProps> = ({
  title = '神秘塔罗 AI - AI驱动的塔罗牌占卜体验',
  description = '体验沉浸式AI塔罗牌占卜，由阿里云百炼Qwen模型驱动的深度解读。洗牌仪式、神秘氛围，探索命运的指引。',
  type = 'website',
  image = 'https://ai-tarotcard.com/og-image.jpg',
  url = 'https://ai-tarotcard.com',
  lang = 'zh-CN',
  schemaType = 'WebSite'
}) => {
  const siteUrl = 'https://ai-tarotcard.com';
  const isZh = lang === 'zh-CN';

  // 根据语言生成不同的描述
  const defaultDescriptions = {
    'zh-CN': '体验沉浸式AI塔罗牌占卜，由阿里云百炼Qwen模型驱动的深度解读。洗牌仪式、神秘氛围，探索命运的指引。',
    'en': 'Experience immersive AI-powered Tarot readings with deep interpretations by Alibaba Bailian Qwen models. Card shuffling rituals, mystical atmosphere, explore fate\'s guidance.'
  };

  const defaultTitles = {
    'zh-CN': '神秘塔罗 AI - AI驱动的塔罗牌占卜体验',
    'en': 'Mystic Tarot AI - AI-Powered Tarot Reading Experience'
  };

  const finalDescription = description === defaultDescriptions['zh-CN']
    ? defaultDescriptions[lang]
    : description;

  const finalTitle = title === defaultTitles['zh-CN']
    ? defaultTitles[lang]
    : title;

  // 生成JSON-LD结构化数据
  const generateSchema = () => {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': schemaType,
      name: finalTitle,
      description: finalDescription,
      url: url,
    };

    if (schemaType === 'WebSite') {
      return {
        ...baseSchema,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteUrl}/?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        },
        publisher: {
          '@type': 'Organization',
          name: '神秘塔罗 AI',
          url: siteUrl
        }
      };
    }

    if (schemaType === 'Service') {
      return {
        ...baseSchema,
        '@type': 'Service',
        serviceType: 'Tarot Reading',
        provider: {
          '@type': 'Organization',
          name: '神秘塔罗 AI',
          url: siteUrl
        },
        areaServed: {
          '@type': 'Place',
          name: 'Worldwide'
        }
      };
    }

    return baseSchema;
  };

  return (
    <Helmet>
      {/* 基本Meta标签 */}
      <html lang={lang} />
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <link rel="canonical" href={url} />

      {/* SEO关键词和作者 */}
      <meta name="keywords" content={isZh ? '塔罗牌,AI占卜,塔罗解读,在线占卜,命运指引,塔罗预测,人生命题,神秘学,占卜工具' : 'tarot cards,AI tarot,tarot reading,online divination,fortune telling,tarot prediction,life guidance,mysticism'} />
      <meta name="author" content="神秘塔罗 AI / Mystic Tarot AI" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />

      {/* 移动端优化 */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content={isZh ? '塔罗AI' : 'Tarot AI'} />

      {/* 主题颜色 */}
      <meta name="theme-color" content="#9333EA" media="(prefers-color-scheme: dark)" />
      <meta name="theme-color" content="#A855F7" media="(prefers-color-scheme: light)" />
      <meta name="msapplication-TileColor" content="#9333EA" />
      <meta name="msapplication-navbutton-color" content="#9333EA" />

      {/* PWA Manifest */}
      <link rel="manifest" href="/manifest.json" />

      {/* 图标 */}
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
      <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />

      {/* Open Graph 标签 */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="神秘塔罗 AI" />
      <meta property="og:locale" content={lang === 'zh-CN' ? 'zh_CN' : 'en_US'} />

      {/* Twitter Card 标签 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={image} />

      {/* Hreflang 多语言标签 */}
      <link rel="alternate" hreflang="zh-CN" href={`${siteUrl}/?lang=zh`} />
      <link rel="alternate" hreflang="en" href={`${siteUrl}/?lang=en`} />
      <link rel="alternate" hreflang="x-default" href={siteUrl} />

      {/* 结构化数据 */}
      <script type="application/ld+json">
        {JSON.stringify(generateSchema())}
      </script>
    </Helmet>
  );
};

export default SEOHead;
