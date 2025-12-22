import React from 'react';
import { Language } from '../types';

export interface BreadcrumbItem {
  label: string;
  url?: string; // If undefined, it's the current page (non-clickable)
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  language: Language;
}

/**
 * Breadcrumb Navigation Component with Schema.org structured data
 *
 * Provides hierarchical navigation and improves SEO with BreadcrumbList schema.
 *
 * @example
 * <BreadcrumbNav
 *   items={[
 *     { label: '首页', url: '/' },
 *     { label: '人生命题', url: '/?view=topics' },
 *     { label: '我的命题' } // Current page (no url)
 *   ]}
 *   language="zh"
 * />
 */
export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ items, language }) => {
  const isZh = language === 'zh';
  const siteRoot = 'https://ai-tarotcard.com';
  const langPrefix = isZh ? '/zh' : '';

  // Generate Schema.org BreadcrumbList structured data
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      ...(item.url && { "item": `${siteRoot}${item.url}` })
    }))
  };

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Visual Breadcrumb Navigation */}
      <nav
        aria-label={isZh ? '面包屑导航' : 'Breadcrumb navigation'}
        className="flex items-center gap-2 text-xs md:text-sm text-slate-400 mb-4 md:mb-6"
      >
        <ol className="flex items-center gap-2 flex-wrap">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={index} className="flex items-center gap-2">
                {item.url && !isLast ? (
                  <a
                    href={item.url}
                    className="hover:text-purple-300 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = item.url!;
                    }}
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className={isLast ? 'text-purple-200 font-medium' : ''}>
                    {item.label}
                  </span>
                )}

                {!isLast && (
                  <svg
                    className="w-3 h-3 md:w-4 md:h-4 text-slate-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

/**
 * Pre-configured breadcrumb helpers for common pages
 */
export const getBreadcrumbsForQuickReading = (language: Language): BreadcrumbItem[] => {
  const isZh = language === 'zh';
  const prefix = isZh ? '/zh' : '';
  return [
    { label: isZh ? '首页' : 'Home', url: `${prefix}/` },
    { label: isZh ? '遇事占卜' : 'Quick Reading' }
  ];
};

export const getBreadcrumbsForTopicList = (language: Language): BreadcrumbItem[] => {
  const isZh = language === 'zh';
  const prefix = isZh ? '/zh' : '';
  return [
    { label: isZh ? '首页' : 'Home', url: `${prefix}/` },
    { label: isZh ? '人生命题' : 'Life Topics', url: `${prefix}/?view=topics` }
  ];
};

export const getBreadcrumbsForTopicDetail = (
  topicTitle: string,
  language: Language
): BreadcrumbItem[] => {
  const isZh = language === 'zh';
  const prefix = isZh ? '/zh' : '';
  return [
    { label: isZh ? '首页' : 'Home', url: `${prefix}/` },
    { label: isZh ? '人生命题' : 'Life Topics', url: `${prefix}/?view=topics` },
    { label: topicTitle }
  ];
};

export const getBreadcrumbsForSharedReading = (
  question: string,
  language: Language
): BreadcrumbItem[] => {
  const isZh = language === 'zh';
  const prefix = isZh ? '/zh' : '';
  // Truncate long questions
  const displayQuestion = question.length > 30 ? `${question.substring(0, 30)}...` : question;
  return [
    { label: isZh ? '首页' : 'Home', url: `${prefix}/` },
    { label: isZh ? '分享的解读' : 'Shared Reading', url: `${prefix}/` },
    { label: displayQuestion }
  ];
};
