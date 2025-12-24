import React from 'react';
import SEOHead from './SEOHead';

interface PricingPageProps {
  language: 'zh' | 'en';
  onStartReading: () => void;
  onUpgrade: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  language,
  onStartReading,
  onUpgrade,
}) => {
  const isZh = language === 'zh';

  const content = {
    title: {
      en: 'Choose Your Path to Enlightenment',
      zh: '选择您的启蒙之路',
    },
    subtitle: {
      en: 'Unlock the wisdom of the cards with our flexible pricing plans',
      zh: '通过我们灵活的定价方案解锁塔罗牌的智慧',
    },
    free: {
      name: {
        en: 'Free Experience',
        zh: '免费体验版',
      },
      price: {
        en: '$0',
        zh: '¥0',
      },
      period: {
        en: 'Forever',
        zh: '永久免费',
      },
      features: [
        {
          en: '5 free readings per day',
          zh: '每天 5 次免费占卜',
        },
        {
          en: 'Only 3 event readings',
          zh: '仅 3 次事件占卜',
        },
        {
          en: 'Basic AI tarot interpretation',
          zh: '基础 AI 塔罗解读',
        },
        {
          en: 'No registration required',
          zh: '无需注册',
        },
        {
          en: 'Three-card spread reading',
          zh: '三牌阵解读',
        },
      ],
      button: {
        en: 'Start Free',
        zh: '开始免费体验',
      },
    },
    premium: {
      name: {
        en: 'Premium Membership',
        zh: '高级会员版',
      },
      price: {
        en: '$9.9',
        zh: '¥29',
      },
      period: {
        en: 'per month',
        zh: '每月',
      },
      features: [
        {
          en: 'Nearly unlimited topics and events',
          zh: '近乎无限次命题和事件占卜',
        },
        {
          en: 'Deep AI insights & advice',
          zh: '深度 AI 解读与建议',
        },
        {
          en: 'Topic tracking & management',
          zh: '命题追踪与管理',
        },
        {
          en: 'History records saved',
          zh: '历史记录保存',
        },
        {
          en: 'Priority support',
          zh: '优先客户支持',
        },
      ],
      button: {
        en: 'Upgrade Now',
        zh: '立即升级',
      },
      badge: {
        en: 'Most Popular',
        zh: '最受欢迎',
      },
    },
  };

  return (
    <>
      <SEOHead
        title={`${content.title[isZh ? 'zh' : 'en']} | ${isZh ? '神秘塔罗在线' : 'Mystic Tarot'}`}
        description={content.subtitle[isZh ? 'zh' : 'en']}
        url={isZh ? '/zh/pricing' : '/pricing'}
        lang={isZh ? 'zh-CN' : 'en'}
        schemaType="WebSite"
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
                fontFamily: "'Noto Serif SC', serif",
                fontWeight: 700,
                fontSize: '32px',
                lineHeight: '48px',
                textAlign: 'center',
                color: '#E8E3FF',
                margin: 0,
              }}
            >
              {content.title[isZh ? 'zh' : 'en']}
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
              {content.subtitle[isZh ? 'zh' : 'en']}
            </p>
          </div>

          {/* Pricing Cards */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'stretch',
              padding: '0px',
              gap: '32px',
              width: '100%',
              maxWidth: '1000px',
              margin: '0 auto',
            }}
          >
            {/* Free Plan Card */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '40px 32px',
                gap: '24px',
                flex: 1,
                background: 'rgba(60, 46, 90, 0.5)',
                backdropFilter: 'blur(4px)',
                border: '1px solid #443E71',
                borderRadius: '16px',
              }}
            >
              {/* Plan Name */}
              <div
                style={{
                  fontFamily: "'Noto Serif SC', serif",
                  fontWeight: 700,
                  fontSize: '24px',
                  lineHeight: '29px',
                  textAlign: 'center',
                  color: '#E8E3FF',
                }}
              >
                {content.free.name[isZh ? 'zh' : 'en']}
              </div>

              {/* Price */}
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontFamily: "'Noto Serif SC', serif",
                    fontWeight: 700,
                    fontSize: '48px',
                    lineHeight: '58px',
                    color: '#E8E3FF',
                  }}
                >
                  {content.free.price[isZh ? 'zh' : 'en']}
                </div>
                <div
                  style={{
                    fontFamily: "'Noto Serif SC', serif",
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '17px',
                    color: '#8F88AB',
                    marginTop: '8px',
                  }}
                >
                  {content.free.period[isZh ? 'zh' : 'en']}
                </div>
              </div>

              {/* Features */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '16px',
                  width: '100%',
                }}
              >
                {content.free.features.map((feature, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      gap: '12px',
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      style={{ flexShrink: 0, marginTop: '2px' }}
                    >
                      <circle cx="10" cy="10" r="10" fill="#8F88AB" opacity="0.2" />
                      <path
                        d="M6 10L9 13L14 7"
                        stroke="#CDBFEE"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span
                      style={{
                        fontFamily: "'Noto Serif SC', serif",
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '20px',
                        color: '#CDBFEE',
                      }}
                    >
                      {feature[isZh ? 'zh' : 'en']}
                    </span>
                  </div>
                ))}
              </div>

              {/* Button */}
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
                  width: '100%',
                  height: '48px',
                  background: 'rgba(189, 161, 255, 0.2)',
                  border: '1px solid rgba(189, 161, 255, 0.2)',
                  borderRadius: '100px',
                  cursor: 'pointer',
                  fontFamily: "'Noto Serif SC', serif",
                  fontWeight: 700,
                  fontSize: '16px',
                  lineHeight: '19px',
                  color: '#BDA1FF',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(189, 161, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(189, 161, 255, 0.2)';
                }}
              >
                {content.free.button[isZh ? 'zh' : 'en']}
              </button>
            </div>

            {/* Premium Plan Card */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '40px 32px',
                gap: '24px',
                flex: 1,
                background: 'rgba(60, 46, 90, 0.8)',
                backdropFilter: 'blur(4px)',
                border: '2px solid #DD8424',
                borderRadius: '16px',
                position: 'relative',
              }}
            >
              {/* Popular Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  padding: '4px 16px',
                  background: '#DD8424',
                  borderRadius: '100px',
                  fontFamily: "'Noto Serif SC', serif",
                  fontWeight: 700,
                  fontSize: '12px',
                  lineHeight: '14px',
                  color: '#000000',
                  opacity: 0.8,
                }}
              >
                {content.premium.badge[isZh ? 'zh' : 'en']}
              </div>

              {/* Plan Name */}
              <div
                style={{
                  fontFamily: "'Noto Serif SC', serif",
                  fontWeight: 700,
                  fontSize: '24px',
                  lineHeight: '29px',
                  textAlign: 'center',
                  color: '#FFA84A',
                }}
              >
                {content.premium.name[isZh ? 'zh' : 'en']}
              </div>

              {/* Price */}
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontFamily: "'Noto Serif SC', serif",
                    fontWeight: 700,
                    fontSize: '48px',
                    lineHeight: '58px',
                    color: '#DD8424',
                  }}
                >
                  {content.premium.price[isZh ? 'zh' : 'en']}
                </div>
                <div
                  style={{
                    fontFamily: "'Noto Serif SC', serif",
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '17px',
                    color: '#8F88AB',
                    marginTop: '8px',
                  }}
                >
                  {content.premium.period[isZh ? 'zh' : 'en']}
                </div>
              </div>

              {/* Features */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '16px',
                  width: '100%',
                }}
              >
                {content.premium.features.map((feature, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      gap: '12px',
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      style={{ flexShrink: 0, marginTop: '2px' }}
                    >
                      <circle cx="10" cy="10" r="10" fill="#DD8424" opacity="0.2" />
                      <path
                        d="M6 10L9 13L14 7"
                        stroke="#DD8424"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span
                      style={{
                        fontFamily: "'Noto Serif SC', serif",
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '20px',
                        color: '#E8E3FF',
                      }}
                    >
                      {feature[isZh ? 'zh' : 'en']}
                    </span>
                  </div>
                ))}
              </div>

              {/* Button */}
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setTimeout(() => onUpgrade(), 300);
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '12px 48px',
                  width: '100%',
                  height: '48px',
                  background: '#DD8424',
                  borderRadius: '100px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Noto Serif SC', serif",
                  fontWeight: 700,
                  fontSize: '16px',
                  lineHeight: '19px',
                  color: '#000000',
                  opacity: 0.8,
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0.8';
                }}
              >
                {content.premium.button[isZh ? 'zh' : 'en']}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
