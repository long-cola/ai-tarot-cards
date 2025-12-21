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
        <div className="absolute w-full h-full backface-hidden rounded-lg shadow-xl border-2 border-purple-900 bg-slate-800 flex items-center justify-center overflow-hidden group">
          {/* Subtle Sheen/Texture */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

          {/* Decorative Pattern */}
          <div className="absolute inset-2 border border-purple-500/30 rounded flex items-center justify-center">
             <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border border-amber-500/40 flex items-center justify-center relative">
                <div className="absolute w-full h-full border border-purple-500/40 rounded-full animate-spin-slow"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-400 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.8)]"></div>
             </div>
          </div>
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-600 via-slate-900 to-black"></div>
          {/* Mystery Symbol */}
          <span className="font-mystic text-2xl sm:text-3xl md:text-4xl text-purple-200/60 transition-transform duration-500 group-hover:scale-110">☾</span>
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
