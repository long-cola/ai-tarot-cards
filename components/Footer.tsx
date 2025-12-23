import React from 'react';
import { Language } from '../types';

interface FooterProps {
  language: Language;
  onOpenCookieSettings?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onOpenCookieSettings }) => {
  const isZh = language === 'zh';
  const currentYear = new Date().getFullYear();
  const prefix = isZh ? '/zh' : '';

  return (
    <footer className="relative z-30 w-full border-t border-white/5 bg-slate-950/40 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="text-sm text-slate-400 text-center md:text-left">
            © {currentYear} {isZh ? '神秘塔罗 AI' : 'Mystic Tarot AI'}. {isZh ? '保留所有权利。' : 'All rights reserved.'}
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <a
              href={`${prefix}/?view=privacy`}
              className="text-slate-400 hover:text-purple-300 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `${prefix}/?view=privacy`;
              }}
            >
              {isZh ? '隐私政策' : 'Privacy Policy'}
            </a>
            <span className="text-slate-600">|</span>
            <a
              href={`${prefix}/?view=terms`}
              className="text-slate-400 hover:text-purple-300 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `${prefix}/?view=terms`;
              }}
            >
              {isZh ? '服务条款' : 'Terms of Service'}
            </a>
            <span className="text-slate-600">|</span>
            <button
              type="button"
              onClick={() => onOpenCookieSettings?.()}
              className="text-slate-400 hover:text-purple-300 transition-colors"
            >
              {isZh ? 'Cookie 设置' : 'Cookie Settings'}
            </button>
          </div>
        </div>

        {/* Trust & Compliance */}
        <div className="mt-4 pt-4 border-t border-white/5 text-center space-y-2 text-xs text-slate-500">
          <p>
            {isZh
              ? '⚠️ 本服务仅供娱乐与自我反思，18 岁以上用户使用。AI 塔罗用于个人思考辅助，不提供算命、预测、保证或专业建议。'
              : '⚠️ For entertainment and personal reflection only. Must be 18+ to use. AI Tarot is designed for personal insight and does not provide fortune-telling, guarantees, or professional advice.'}
          </p>
          <p>
            {isZh
              ? 'AI 生成内容不构成法律、医疗、财务或心理咨询建议。重大决策请咨询专业人士。'
              : 'AI-generated content is not legal, medical, financial, or mental health advice. Please consult professionals for important decisions.'}
          </p>
          <p>
            {isZh
              ? '联系邮箱：support@ai-tarotcard.com · 最新更新：2025-01'
              : 'Contact: support@ai-tarotcard.com · Last updated: 2025-01'}
          </p>
        </div>
      </div>
    </footer>
  );
};
