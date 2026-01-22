import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SEOHead from '../SEOHead';
import { FortuneDraw } from './FortuneDraw';
import { FortuneClusterPageConfig, FORTUNE_CLUSTER_PAGES, getFortuneClusterPage } from './fortuneClusterConfig';
import { Language } from '../../types';

interface FortuneClusterPageProps {
  slug: string;
  language: Language;
}

const buildFaqSchema = (items: FortuneClusterPageConfig['faq']['items']) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
});

const buildBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const FortuneClusterPage: React.FC<FortuneClusterPageProps> = ({ slug, language }) => {
  const pageData = getFortuneClusterPage(slug);
  const otherPages = FORTUNE_CLUSTER_PAGES.filter((page) => page.slug !== slug);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.dispatchEvent(new Event('prerender-ready'));
    }
  }, [slug]);

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white/60">Page not found</p>
      </div>
    );
  }

  const breadcrumbItems = [
    { name: 'Home', url: 'https://ai-tarotcard.com/' },
    { name: 'Tarot Fortune Cards', url: 'https://ai-tarotcard.com/tarot-fortune-cards' },
  ];

  if (pageData.slug !== 'tarot-fortune-cards') {
    breadcrumbItems.push({
      name: pageData.navLabel,
      url: pageData.seo.canonicalUrl,
    });
  }

  const handleHeroCTA = () => {
    const section = document.getElementById('fortune-draw');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <SEOHead
        title={pageData.seo.title}
        description={pageData.seo.description}
        url={pageData.seo.canonicalUrl}
        lang={language === 'zh' ? 'zh-Hans' : 'en'}
        schemaType="Service"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(buildFaqSchema(pageData.faq.items))}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(buildBreadcrumbSchema(breadcrumbItems))}
        </script>
      </Helmet>

      <div className="min-h-screen relative overflow-x-hidden">
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

        <div className="relative z-10 flex flex-col items-center pb-20">
          <section className="w-full max-w-5xl px-6 md:px-8 pt-28 md:pt-32 text-center">
            <h1
              className="text-[30px] md:text-[38px] font-bold text-[#E8E3FF] leading-tight"
              style={{ fontFamily: "'Noto Serif SC', serif" }}
            >
              {pageData.hero.title}
            </h1>
            <p className="text-[14px] md:text-[16px] text-white/70 mt-4">
              {pageData.hero.subtitle}
            </p>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleHeroCTA}
                className="bg-[#DD8424] text-black font-bold text-[15px] md:text-[16px] px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
              >
                {pageData.hero.ctaText}
              </button>
            </div>
          </section>

          <FortuneDraw
            key={pageData.slug}
            defaultCount={pageData.draw.defaultCount}
            allowedCounts={pageData.draw.allowedCounts}
            topic={pageData.draw.topic}
            defaultQuestion={pageData.draw.defaultQuestion}
          />

          <section className="w-full max-w-5xl px-6 md:px-8 mt-12 space-y-10 text-left">
            <div>
              <h2 className="text-[20px] md:text-[22px] font-semibold text-[#E8E3FF] mb-3">
                {pageData.what.title}
              </h2>
              <div className="space-y-4 text-[14px] md:text-[15px] text-white/70 leading-relaxed">
                {pageData.what.paragraphs.map((paragraph, index) => (
                  <p key={`${pageData.slug}-what-${index}`}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-[20px] md:text-[22px] font-semibold text-[#E8E3FF] mb-3">
                {pageData.how.title}
              </h2>
              <ol className="list-decimal pl-5 text-[14px] md:text-[15px] text-white/70 space-y-2">
                {pageData.how.steps.map((step, index) => (
                  <li key={`${pageData.slug}-how-${index}`}>{step}</li>
                ))}
              </ol>
            </div>

            <div>
              <h2 className="text-[20px] md:text-[22px] font-semibold text-[#E8E3FF] mb-3">
                {pageData.commonQuestions.title}
              </h2>
              <ul className="list-disc pl-5 text-[14px] md:text-[15px] text-white/70 space-y-2">
                {pageData.commonQuestions.questions.map((question, index) => (
                  <li key={`${pageData.slug}-question-${index}`}>{question}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-[20px] md:text-[22px] font-semibold text-[#E8E3FF] mb-3">
                {pageData.faq.title}
              </h2>
              <div className="space-y-4 text-[14px] md:text-[15px] text-white/70">
                {pageData.faq.items.map((item, index) => (
                  <div key={`${pageData.slug}-faq-${index}`} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-[#FCD34D] font-semibold mb-2">{item.question}</p>
                    <p>{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <h2 className="text-[20px] md:text-[22px] font-semibold text-[#E8E3FF] mb-3">
                Explore more tarot fortune readings
              </h2>
              <div className="flex flex-wrap gap-3">
                {otherPages.map((page) => (
                  <a
                    key={page.slug}
                    href={`/${page.slug}`}
                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[12px] md:text-[13px] text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    {page.navLabel}
                  </a>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
