import React from 'react';
import { DrawnCard, Language } from '../types';

interface CardProps {
  card?: DrawnCard;
  isRevealed: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  language: Language;
}

export const Card: React.FC<CardProps> = ({ card, isRevealed, onClick, className = "w-20 h-32 sm:w-24 sm:h-40 md:w-32 md:h-52", style, language }) => {
  return (
    <div
      className={`relative cursor-pointer perspective-1000 ${className}`}
      onClick={onClick}
      style={style}
    >
      <div className={`relative w-full h-full duration-700 transform-style-3d transition-all ${isRevealed ? 'rotate-y-180' : ''}`}>

        {/* Card Back */}
        <div className="absolute w-full h-full backface-hidden rounded-lg shadow-xl border-2 border-purple-900 overflow-hidden">
          <img
            src="/img/card_bg.png"
            alt={language === 'zh' ? '塔罗牌背面' : 'Tarot card back'}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Card Front */}
        <div className={`absolute w-full h-full backface-hidden rotate-y-180 rounded-lg shadow-[0_0_20px_rgba(234,179,8,0.2)] bg-slate-900 border-2 border-amber-600 overflow-hidden flex flex-col`}>
           {card && (
             <>
                <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
                   {/* Real Tarot Card Image */}
                   <div className={`w-full h-full ${card.isReversed ? 'rotate-180' : ''} transition-transform duration-700`}>
                      <img 
                        src={card.imageUrl} 
                        alt={card.name} 
                        className="w-full h-full object-cover" 
                        loading="lazy"
                      />
                   </div>
                </div>
                {/* Footer for Card Name */}
                <div className="h-5 sm:h-6 md:h-8 bg-slate-950 border-t border-amber-800 flex items-center justify-center px-1">
                  <span className={`text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-wider font-bold truncate ${card.isReversed ? 'text-purple-400' : 'text-amber-500'}`}>
                    {language === 'zh' ? card.nameCn : card.name} {language === 'zh' ? (card.isReversed ? "(逆位)" : "(正位)") : (card.isReversed ? "(Rev)" : "(Upr)")}
                  </span>
                </div>
             </>
           )}
        </div>
      </div>
    </div>
  );
};
