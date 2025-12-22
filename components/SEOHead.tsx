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
  title = '免费AI塔罗占卜 - 爱情事业财运解读 | 神秘塔罗在线',
  description = '免费在线AI塔罗占卜，3秒获得专业解读。爱情、事业、财运、人生决策即时指引。神秘三牌阵洞察过去现在未来，24小时随时占卜，AI深度解析命运走向。',
  type = 'website',
  image = 'https://ai-tarotcards.vercel.app/og-image.jpg',
  url = 'https://ai-tarotcards.vercel.app',
  lang = 'zh-CN',
  schemaType = 'WebSite'
}) => {
  const siteUrl = 'https://ai-tarotcards.vercel.app';
  const isZh = lang === 'zh-CN';

  // 根据语言生成不同的描述
  const defaultDescriptions = {
    'zh-CN': '免费在线AI塔罗占卜，3秒获得专业解读。爱情、事业、财运、人生决策即时指引。神秘三牌阵洞察过去现在未来，24小时随时占卜，AI深度解析命运走向。',
    'en': 'Free online AI tarot reading in 3 seconds. Get instant insights on love, career, money & life decisions. Three-card spread reveals past, present, future. 24/7 mystical guidance powered by AI.'
  };

  const defaultTitles = {
    'zh-CN': '免费AI塔罗占卜 - 爱情事业财运解读 | 神秘塔罗在线',
    'en': 'Free AI Tarot Reading - Love, Career & Life Guidance | Mystic Tarot'
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
      <meta name="keywords" content={isZh ? '免费塔罗牌,AI塔罗占卜,在线塔罗,塔罗牌测试,爱情塔罗,事业占卜,财运预测,塔罗解读,三牌阵,命运指引,塔罗牌在线占卜免费' : 'free tarot reading,AI tarot,online tarot cards,tarot card reading,love tarot,career tarot,fortune telling,three card spread,instant tarot,mystical guidance,free online tarot'} />
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
