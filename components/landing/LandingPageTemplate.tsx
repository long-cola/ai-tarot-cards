import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Language, ReadingConfig } from '../../types';
import { getLandingPageData, LandingPageContent } from './LandingPageData';
import SEOHead from '../SEOHead';
import { SocialShare } from '../SocialShare';

interface LandingPageTemplateProps {
  slug: string;
  language: Language;
  onStartReading: (prefillQuestion: string, config?: ReadingConfig) => void;
}

const TOOL_PAGE_SLUGS = new Set([
  'tarot-card-generator',
  'one-card-tarot',
  'random-tarot-card-generator',
  'tarot-spreads',
  'celtic-cross-tarot',
]);

const landingLinks = [
  {
    slug: 'will-he-contact-me-tarot',
    label: {
      en: 'Will He Contact Me Tarot',
      zh: '他会联系我吗塔罗占卜',
    },
    href: {
      en: '/will-he-contact-me-tarot',
      zh: '/zh/will-he-contact-me-tarot',
    },
  },
  {
    slug: 'love-tarot-reading',
    label: {
      en: 'Love Tarot Reading',
      zh: '爱情塔罗占卜',
    },
    href: {
      en: '/love-tarot-reading',
      zh: '/zh/love-tarot-reading',
    },
  },
  {
    slug: 'should-i-leave-my-job-tarot',
    label: {
      en: 'Should I Leave My Job Tarot',
      zh: '我是否该辞职塔罗占卜',
    },
    href: {
      en: '/should-i-leave-my-job-tarot',
      zh: '/zh/should-i-leave-my-job-tarot',
    },
  },
  {
    slug: 'career-tarot-reading',
    label: {
      en: 'Career Tarot Reading',
      zh: '事业塔罗占卜',
    },
    href: {
      en: '/career-tarot-reading',
      zh: '/zh/career-tarot-reading',
    },
  },
  {
    slug: 'daily-tarot-guidance',
    label: {
      en: 'Daily Tarot Guidance',
      zh: '每日塔罗指引',
    },
    href: {
      en: '/daily-tarot-guidance',
      zh: '/zh/daily-tarot-guidance',
    },
  },
  {
    slug: 'tarot-card-generator',
    label: {
      en: 'Tarot Card Generator',
      zh: 'Tarot Card Generator',
    },
    href: {
      en: '/tarot-card-generator',
      zh: '/tarot-card-generator',
    },
  },
  {
    slug: 'one-card-tarot',
    label: {
      en: 'One Card Tarot',
      zh: 'One Card Tarot',
    },
    href: {
      en: '/one-card-tarot',
      zh: '/one-card-tarot',
    },
  },
  {
    slug: 'random-tarot-card-generator',
    label: {
      en: 'Random Tarot Card Generator',
      zh: 'Random Tarot Card Generator',
    },
    href: {
      en: '/random-tarot-card-generator',
      zh: '/random-tarot-card-generator',
    },
  },
  {
    slug: 'tarot-spreads',
    label: {
      en: 'Tarot Spreads',
      zh: 'Tarot Spreads',
    },
    href: {
      en: '/tarot-spreads',
      zh: '/tarot-spreads',
    },
  },
  {
    slug: 'celtic-cross-tarot',
    label: {
      en: 'Celtic Cross Tarot',
      zh: 'Celtic Cross Tarot',
    },
    href: {
      en: '/celtic-cross-tarot',
      zh: '/celtic-cross-tarot',
    },
  },
];

const CELTIC_CROSS_POSITIONS = [
  'Present',
  'Challenge',
  'Past',
  'Near Future',
  'Foundation',
  'Conscious Goal',
  'Unconscious',
  'External Influence',
  'Hopes and Fears',
  'Outcome',
];

export const LandingPageTemplate: React.FC<LandingPageTemplateProps> = ({
  slug,
  language,
  onStartReading,
}) => {
  const pageData = getLandingPageData(slug, language);
  const isZh = language === 'zh';
  const isToolPage = TOOL_PAGE_SLUGS.has(slug);
  const relatedTitle = isZh
    ? (isToolPage ? '相关塔罗工具' : '相关塔罗问题')
    : (isToolPage ? 'Related Tarot Tools' : 'Related Tarot Questions');
  const relatedLinks = landingLinks
    .filter((link) => link.slug !== slug)
    .filter((link) => (isToolPage ? TOOL_PAGE_SLUGS.has(link.slug) : !TOOL_PAGE_SLUGS.has(link.slug)))
    .slice(0, 4);
  const autoStartRef = useRef<string | null>(null);

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white/60">Page not found</p>
      </div>
    );
  }

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.dispatchEvent(new Event('prerender-ready'));
    }
  }, [slug]);

  useEffect(() => {
    if (!pageData.readingConfig?.autoDraw || autoStartRef.current === slug) return;
    if (typeof window === 'undefined') return;
    autoStartRef.current = slug;
    const timer = window.setTimeout(() => {
      onStartReading(pageData.hero.prefillQuestion, pageData.readingConfig);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [pageData, onStartReading, slug]);

  return (
    <>
      <SEOHead
        title={pageData.seo.title}
        description={pageData.seo.description}
        url={pageData.seo.canonicalUrl}
        lang={language === 'zh' ? 'zh-Hans' : 'en'}
        schemaType="Service"
        />
      <FAQSchemaBlock faqs={pageData.faqs} />

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
          <HeroSection
            data={pageData.hero}
            onCTAClick={() => onStartReading(pageData.hero.prefillQuestion, pageData.readingConfig)}
          />
          {slug === 'tarot-card-generator' && (
            <QuickDrawSection
              onDraw={(count) =>
                onStartReading(pageData.hero.prefillQuestion, {
                  ...pageData.readingConfig,
                  drawCount: count,
                })
              }
            />
          )}
          {slug === 'tarot-spreads' && (
            <SpreadSelectorSection
              onOneCard={() =>
                onStartReading(pageData.hero.prefillQuestion, {
                  ...pageData.readingConfig,
                  drawCount: 1,
                })
              }
              onThreeCard={() =>
                onStartReading(pageData.hero.prefillQuestion, {
                  ...pageData.readingConfig,
                  drawCount: 3,
                })
              }
            />
          )}
          {slug === 'celtic-cross-tarot' && (
            <CelticCrossPositionsSection
              onStartReading={() =>
                onStartReading(pageData.hero.prefillQuestion, pageData.readingConfig)
              }
            />
          )}
          {isToolPage && (
            <CommonSituationsSection data={pageData.commonSituations} compact />
          )}
          {pageData.intro && <IntroSection data={pageData.intro} />}
          <ProblemSection data={pageData.problem} />
          {!isToolPage && <CommonSituationsSection data={pageData.commonSituations} />}
          <AIExplanationSection data={pageData.aiExplanation} />
          {pageData.longForm && <LongFormSection data={pageData.longForm} />}
          <TarotEntrySection
            data={pageData.tarotEntry}
            onStartReading={() => onStartReading(pageData.hero.prefillQuestion, pageData.readingConfig)}
            previewCount={pageData.readingConfig?.drawCount}
          />
          <FAQDisplaySection data={pageData.faqs} language={language} />
          <RelatedLinksSection
            title={relatedTitle}
            links={relatedLinks.map((link) => ({
              label: link.label[isZh ? 'zh' : 'en'],
              href: link.href[isZh ? 'zh' : 'en'],
            }))}
          />
          <SocialShare
            url={pageData.seo.canonicalUrl}
            title={pageData.seo.title}
            language={language}
          />
          <CTAFooter
            language={language}
            onStartReading={() => onStartReading(pageData.hero.prefillQuestion, pageData.readingConfig)}
          />
        </div>
      </div>
    </>
  );
};

// Hero Section Component
const HeroSection: React.FC<{
  data: LandingPageContent['hero'];
  onCTAClick: () => void;
}> = ({ data, onCTAClick }) => (
  <div className="w-full flex flex-col items-center gap-8 pt-32 md:pt-40 pb-16 px-8 md:px-16">
    <div className="flex flex-col items-center gap-6 text-center max-w-3xl">
      <h1
        style={{
          fontFamily: "'Noto Serif SC', serif",
          fontWeight: 700,
          fontSize: 'clamp(32px, 6vw, 48px)',
          lineHeight: 1.2,
        }}
        className="text-white/90"
      >
        {data.title}
      </h1>
      <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl">
        {data.subtitle}
      </p>
      <button
        onClick={onCTAClick}
        className="mt-4 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-900/50 transition-all duration-300 hover:scale-105 text-lg"
      >
        {data.ctaText}
      </button>
    </div>
  </div>
);

const QuickDrawSection: React.FC<{
  onDraw: (count: number) => void;
}> = ({ onDraw }) => (
  <section className="w-full max-w-3xl px-8 md:px-16 pb-6">
    <div className="flex flex-col items-center gap-4 text-center">
      <p className="text-white/60 text-xs uppercase tracking-[0.3em]">Quick Draw</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => onDraw(1)}
          className="px-6 py-3 rounded-full border border-purple-500/40 text-white/90 hover:bg-purple-600/20 transition-colors"
        >
          Draw 1 Card
        </button>
        <button
          onClick={() => onDraw(3)}
          className="px-6 py-3 rounded-full bg-purple-600/80 text-white font-semibold hover:bg-purple-500 transition-colors"
        >
          Draw 3 Cards
        </button>
      </div>
    </div>
  </section>
);

const SpreadSelectorSection: React.FC<{
  onOneCard: () => void;
  onThreeCard: () => void;
}> = ({ onOneCard, onThreeCard }) => (
  <section className="w-full max-w-5xl px-8 md:px-16 pb-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white/5 rounded-2xl border border-white/10 p-5 flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-white/90">One Card</h3>
        <p className="text-white/70 text-sm leading-relaxed">
          Fast focus for daily guidance or a quick check-in.
        </p>
        <button
          onClick={onOneCard}
          className="mt-auto px-4 py-2 rounded-full border border-purple-500/40 text-white/90 hover:bg-purple-600/20 transition-colors"
        >
          Draw 1 Card
        </button>
      </div>
      <div className="bg-white/5 rounded-2xl border border-white/10 p-5 flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-white/90">Three Card</h3>
        <p className="text-white/70 text-sm leading-relaxed">
          See past, present, and future context at a glance.
        </p>
        <button
          onClick={onThreeCard}
          className="mt-auto px-4 py-2 rounded-full bg-purple-600/80 text-white font-semibold hover:bg-purple-500 transition-colors"
        >
          Draw 3 Cards
        </button>
      </div>
      <div className="bg-white/5 rounded-2xl border border-white/10 p-5 flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-white/90">Celtic Cross</h3>
        <p className="text-white/70 text-sm leading-relaxed">
          Classic 10-card layout for deep, layered insight.
        </p>
        <a
          href="/celtic-cross-tarot"
          className="mt-auto inline-flex items-center justify-center px-4 py-2 rounded-full border border-purple-500/40 text-white/90 hover:bg-purple-600/20 transition-colors"
        >
          Explore Layout
        </a>
      </div>
    </div>
  </section>
);

const CelticCrossPositionsSection: React.FC<{
  onStartReading: () => void;
}> = ({ onStartReading }) => (
  <section className="w-full max-w-5xl px-8 md:px-16 pb-6">
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6 md:p-8 text-center">
      <p className="text-white/60 text-xs uppercase tracking-[0.3em]">
        10 Positions At A Glance
      </p>
      <div className="mt-5 grid grid-cols-2 md:grid-cols-5 gap-3">
        {CELTIC_CROSS_POSITIONS.map((position) => (
          <div
            key={position}
            className="text-white/80 text-sm md:text-base bg-white/5 border border-white/10 rounded-lg px-3 py-2"
          >
            {position}
          </div>
        ))}
      </div>
      <button
        onClick={onStartReading}
        className="mt-6 px-6 py-3 rounded-full bg-purple-600/80 text-white font-semibold hover:bg-purple-500 transition-colors"
      >
        Start Reading
      </button>
    </div>
  </section>
);

// Intro Section Component
const IntroSection: React.FC<{
  data: LandingPageContent['intro'];
}> = ({ data }) => (
  <section className="w-full max-w-4xl px-8 md:px-16 py-8">
    <p className="text-white/80 text-base md:text-lg leading-relaxed text-center">
      {data.content}
    </p>
  </section>
);

// Problem Section Component
const ProblemSection: React.FC<{
  data: LandingPageContent['problem'];
}> = ({ data }) => (
  <section className="w-full max-w-4xl px-8 md:px-16 py-16">
    <h2
      style={{ fontFamily: "'Noto Serif SC', serif" }}
      className="text-2xl md:text-3xl font-bold text-white/90 mb-8 text-center"
    >
      {data.title}
    </h2>
    <div className="space-y-6">
      {data.paragraphs.map((paragraph, index) => (
        <p key={index} className="text-white/70 text-lg leading-relaxed">
          {paragraph}
        </p>
      ))}
    </div>
  </section>
);

// Common Situations Section Component
const CommonSituationsSection: React.FC<{
  data: LandingPageContent['commonSituations'];
  compact?: boolean;
}> = ({ data, compact = false }) => (
  <section className={`w-full max-w-4xl px-8 md:px-16 ${compact ? 'py-8' : 'py-16'}`}>
    <h2
      style={{ fontFamily: "'Noto Serif SC', serif" }}
      className="text-2xl md:text-3xl font-bold text-white/90 mb-8 text-center"
    >
      {data.title}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.situations.map((situation, index) => (
        <div
          key={index}
          className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <p className="text-white/70 leading-relaxed">{situation}</p>
        </div>
      ))}
    </div>
  </section>
);

// AI Explanation Section Component
const AIExplanationSection: React.FC<{
  data: LandingPageContent['aiExplanation'];
}> = ({ data }) => (
  <section className="w-full max-w-4xl px-8 md:px-16 py-16 bg-white/5 rounded-2xl mx-4 md:mx-8">
    <h2
      style={{ fontFamily: "'Noto Serif SC', serif" }}
      className="text-2xl md:text-3xl font-bold text-white/90 mb-6 text-center"
    >
      {data.title}
    </h2>
    <p className="text-white/70 text-lg leading-relaxed mb-6 text-center">
      {data.content}
    </p>
    <ul className="space-y-3 max-w-xl mx-auto">
      {data.points.map((point, index) => (
        <li key={index} className="flex items-start gap-3 text-white/70">
          <span className="text-purple-400 mt-1">&#10003;</span>
          <span>{point}</span>
        </li>
      ))}
    </ul>
  </section>
);

// Long Form Section Component
const LongFormSection: React.FC<{
  data: NonNullable<LandingPageContent['longForm']>;
}> = ({ data }) => (
  <section className="w-full max-w-4xl px-8 md:px-16 py-16">
    <h2
      style={{ fontFamily: "'Noto Serif SC', serif" }}
      className="text-2xl md:text-3xl font-bold text-white/90 mb-8 text-center"
    >
      {data.title}
    </h2>
    <div className="space-y-6">
      {data.paragraphs.map((paragraph, index) => (
        <p key={index} className="text-white/70 text-lg leading-relaxed">
          {paragraph}
        </p>
      ))}
    </div>
  </section>
);

// Tarot Entry Section Component
const TarotEntrySection: React.FC<{
  data: LandingPageContent['tarotEntry'];
  onStartReading: () => void;
  previewCount?: number;
}> = ({ data, onStartReading, previewCount }) => {
  const cardCount = previewCount && previewCount > 0 ? previewCount : 3;
  const previewRotation = cardCount === 1 ? [0] : [-8, 0, 8].slice(0, cardCount);

  return (
    <section className="w-full max-w-4xl px-8 md:px-16 py-20">
      <h2
        style={{ fontFamily: "'Noto Serif SC', serif" }}
        className="text-2xl md:text-3xl font-bold text-white/90 mb-10 text-center"
      >
        {data.title}
      </h2>

      {/* Card Preview */}
      <div className="flex justify-center gap-4 md:gap-6 mb-10">
        {Array.from({ length: cardCount }).map((_, index) => (
          <div
            key={index}
            onClick={onStartReading}
            className="w-20 h-32 md:w-28 md:h-44 rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-purple-900/60 shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer flex items-center justify-center group"
            style={{
              transform: `rotate(${previewRotation[index] ?? 0}deg)`,
            }}
          >
            <span className="text-purple-400/50 text-4xl group-hover:text-purple-400/80 transition-colors">
              &#9789;
            </span>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={onStartReading}
          className="px-10 py-5 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-900/50 transition-all duration-300 hover:scale-105 text-xl"
        >
          {data.ctaText}
        </button>
      </div>
    </section>
  );
};

// FAQ Display Section Component
const FAQDisplaySection: React.FC<{
  data: LandingPageContent['faqs'];
  language: Language;
}> = ({ data, language }) => (
  <section className="w-full max-w-4xl px-8 md:px-16 py-16">
    <h2
      style={{ fontFamily: "'Noto Serif SC', serif" }}
      className="text-2xl md:text-3xl font-bold text-white/90 mb-10 text-center"
    >
      {language === 'zh' ? '常见问题' : 'Frequently Asked Questions'}
    </h2>
    <div className="space-y-6">
      {data.map((faq, index) => (
        <div
          key={index}
          className="bg-white/5 rounded-xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-semibold text-white/90 mb-3">
            {faq.question}
          </h3>
          <p className="text-white/70 leading-relaxed">{faq.answer}</p>
        </div>
      ))}
    </div>
  </section>
);

const RelatedLinksSection: React.FC<{
  title: string;
  links: Array<{ label: string; href: string }>;
}> = ({ title, links }) => (
  <section className="w-full max-w-4xl px-8 md:px-16 py-12">
    <h2
      style={{ fontFamily: "'Noto Serif SC', serif" }}
      className="text-2xl md:text-3xl font-bold text-white/90 mb-6 text-center"
    >
      {title}
    </h2>
    <div className="flex flex-col items-center gap-3 text-[16px] md:text-[17px]">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="text-purple-200 hover:text-purple-100 transition-colors underline underline-offset-4"
        >
          {link.label}
        </a>
      ))}
    </div>
  </section>
);

// CTA Footer Component
const CTAFooter: React.FC<{
  language: Language;
  onStartReading: () => void;
}> = ({ language, onStartReading }) => (
  <section className="w-full max-w-4xl px-8 md:px-16 py-16 text-center">
    <p className="text-white/60 mb-6">
      {language === 'zh'
        ? '准备好探索你的答案了吗？'
        : 'Ready to explore your answer?'}
    </p>
    <button
      onClick={onStartReading}
      className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-900/50 transition-all duration-300 hover:scale-105"
    >
      {language === 'zh' ? '开始免费占卜' : 'Start Your Free Reading'}
    </button>
  </section>
);

// FAQ Schema Block for SEO
const FAQSchemaBlock: React.FC<{
  faqs: Array<{ question: string; answer: string }>;
}> = ({ faqs }) => {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
    </Helmet>
  );
};

export default LandingPageTemplate;
