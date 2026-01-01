import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGestureRecognition } from '../../hooks/useGestureRecognition';
import { TarotCardData, DrawnCard, Language } from '../../types';

interface GestureDrawingProps {
  deck: TarotCardData[];
  drawnCards: DrawnCard[];
  onCardDrawn: (index: number) => void;
  language: Language;
  isInteracting: boolean;
  onExitGestureMode: () => void;
}

const SELECTION_COOLDOWN = 1500;

export const GestureDrawing: React.FC<GestureDrawingProps> = ({
  deck,
  drawnCards,
  onCardDrawn,
  language,
  isInteracting,
  onExitGestureMode,
}) => {
  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(Math.floor(deck.length / 2));
  const [targetIndex, setTargetIndex] = useState(Math.floor(deck.length / 2));
  const [smoothIndex, setSmoothIndex] = useState(Math.floor(deck.length / 2));

  // Card preview state (when pinching)
  const [isPinching, setIsPinching] = useState(false);
  const [previewCard, setPreviewCard] = useState<{card: TarotCardData, isReversed: boolean, index: number} | null>(null);
  const [flipProgress, setFlipProgress] = useState(0);

  const lastSelectionTime = useRef(0);
  const lastHandX = useRef<number | null>(null);
  const flipAnimationRef = useRef<number | null>(null);

  const {
    gesture,
    handPosition,
    isReady,
    error,
    isLoading,
    videoRef,
    startRecognition,
    stopRecognition,
  } = useGestureRecognition();

  // Helper to check if gesture is a pinch
  const isPinchGesture = (g: string | null) => {
    return g === 'ILoveYou' || g === 'Closed_Fist' || g === 'Victory';
  };

  // Smooth carousel animation
  useEffect(() => {
    if (isPinching) return;

    let animationId: number;
    const animate = () => {
      setSmoothIndex(prev => {
        const diff = targetIndex - prev;
        if (Math.abs(diff) < 0.01) return targetIndex;
        return prev + diff * 0.12;
      });
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [targetIndex, isPinching]);

  // Update current index
  useEffect(() => {
    if (Math.abs(smoothIndex - Math.round(smoothIndex)) < 0.1) {
      setCurrentIndex(Math.round(smoothIndex));
    }
  }, [smoothIndex]);

  // Main gesture handling
  useEffect(() => {
    if (!handPosition || !isReady || isInteracting) return;

    const currentIsPinch = isPinchGesture(gesture);

    // When not in preview mode, handle carousel scroll
    if (!isPinching) {
      if (lastHandX.current !== null) {
        const deltaX = handPosition.x - lastHandX.current;
        if (Math.abs(deltaX) > 0.02) {
          const newTarget = targetIndex + deltaX * 3;
          const clamped = Math.max(0, Math.min(deck.length - 1, newTarget));
          setTargetIndex(clamped);
        }
      }
      lastHandX.current = handPosition.x;

      // Start pinch - begin preview
      if (currentIsPinch) {
        const now = Date.now();
        if (now - lastSelectionTime.current > SELECTION_COOLDOWN) {
          startPreview(currentIndex);
        }
      }
    } else {
      // Currently in preview mode - check for release (NOT pinching anymore)
      if (!currentIsPinch) {
        confirmSelection();
      }
    }
  }, [handPosition, gesture, isReady, deck.length, isInteracting, targetIndex, currentIndex, isPinching]);

  // Start preview (pinch detected)
  const startPreview = useCallback((index: number) => {
    if (index < 0 || index >= deck.length) return;

    const card = deck[index];
    const isReversed = Math.random() > 0.5;

    setIsPinching(true);
    setPreviewCard({ card, isReversed, index });
    setFlipProgress(0);

    // Animate flip
    let startTime: number | null = null;
    const duration = 500;

    const animateFlip = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setFlipProgress(eased);

      if (progress < 1) {
        flipAnimationRef.current = requestAnimationFrame(animateFlip);
      }
    };

    flipAnimationRef.current = requestAnimationFrame(animateFlip);
  }, [deck]);

  // Confirm selection (released pinch)
  const confirmSelection = useCallback(() => {
    if (!previewCard) return;

    lastSelectionTime.current = Date.now();
    onCardDrawn(previewCard.index);

    setIsPinching(false);
    setPreviewCard(null);
    setFlipProgress(0);
    lastHandX.current = null;

    if (flipAnimationRef.current) {
      cancelAnimationFrame(flipAnimationRef.current);
    }
  }, [previewCard, onCardDrawn]);

  useEffect(() => {
    return () => {
      stopRecognition();
      if (flipAnimationRef.current) {
        cancelAnimationFrame(flipAnimationRef.current);
      }
    };
  }, [stopRecognition]);

  useEffect(() => {
    if (!isReady && !isLoading && !error) {
      startRecognition();
    }
  }, [isReady, isLoading, error, startRecognition]);

  // Card transform calculation
  const getCardTransform = (index: number) => {
    const offset = index - smoothIndex;
    const absOffset = Math.abs(offset);

    const xPos = offset * 190;
    const yPos = absOffset * 8;
    const baseScale = Math.max(0.45, 1 - absOffset * 0.1);
    const focus = Math.max(0, 1 - absOffset);
    const scale = baseScale * (1 + focus * 0.6);
    const opacity = Math.max(0.2, 1 - absOffset * 0.18);

    return {
      transform: `translateX(${xPos}px) translateY(${yPos}px) scale(${scale})`,
      opacity,
      zIndex: Math.round(100 - absOffset * 10),
    };
  };

  // Error fallback
  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-slate-950">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <span className="text-3xl">📷</span>
          </div>
          <p className="text-amber-400 text-lg mb-2 font-mystic">
            {language === 'zh' ? '摄像头不可用' : 'Camera Unavailable'}
          </p>
          <p className="text-xs text-slate-500 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={startRecognition}
              className="px-6 py-2 rounded-full border border-purple-400 text-purple-300 hover:bg-purple-500/20 transition-all text-sm"
            >
              {language === 'zh' ? '重试' : 'Retry'}
            </button>
            <button
              onClick={onExitGestureMode}
              className="px-6 py-2 rounded-full border border-slate-600 text-slate-400 hover:bg-slate-800 transition-all text-sm"
            >
              {language === 'zh' ? '返回传统模式' : 'Use Classic Mode'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isCentered = (index: number) => Math.abs(index - smoothIndex) < 0.5;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-[#140F2A]">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-30 bg-cover bg-center"
          style={{ backgroundImage: 'url(/img/bg.png)' }}
        />
        <div className="absolute -top-32 left-1/2 h-[520px] w-[1400px] -translate-x-1/2 rounded-full bg-[#140F2A] blur-[180px] opacity-90" />
        <div className="absolute -bottom-40 left-1/2 h-[520px] w-[1600px] -translate-x-1/2 rounded-full bg-[#140F2A] blur-[180px] opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#140F2A]/50 to-[#140F2A]" />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col items-center px-4 pt-14 pb-12">
        <button
          onClick={onExitGestureMode}
          className="absolute left-4 top-4 z-20 px-4 py-1 text-xs rounded-full border border-purple-300/20 text-[#BDA1FF] hover:bg-purple-500/10 transition-all"
        >
          {language === 'zh' ? '退出' : 'Exit'}
        </button>

        <h2 className="text-[#E8E3FF] text-xl md:text-2xl lg:text-3xl font-mystic tracking-wide text-center">
          {language === 'zh' ? '挥手移动卡牌，捏合选择。' : 'Wave to move the cards, pinch to select.'}
        </h2>

        <div className="mt-5 flex items-center gap-4 md:gap-6">
          {[0, 1, 2].map((i) => {
            const label = language === 'zh'
              ? ['过去', '现在', '未来'][i]
              : ['Past', 'Present', 'Future'][i];
            const isActive = drawnCards.length === i;
            const isDone = drawnCards.length > i;

            return (
              <div
                key={label}
                className={`px-6 py-1 rounded-full border text-xs md:text-sm font-mystic tracking-wide ${
                  i === 0 ? 'bg-[#3E2080]/20' : 'bg-[#070212]/20'
                } ${
                  isActive ? 'border-amber-400/60 text-[#E8E3FF]' : 'border-[#564790] text-[#9B82C6]'
                } ${
                  isDone ? 'opacity-60' : 'opacity-100'
                }`}
              >
                {label}
              </div>
            );
          })}
        </div>

        {!isPinching && (
          <div className="mt-10 flex-1 w-full flex items-center justify-center" style={{ perspective: '1000px' }}>
            <div className="relative flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
              {deck.map((card, index) => {
                const transform = getCardTransform(index);
                const centered = isCentered(index);

                return (
                  <div
                    key={card.id}
                    className="absolute"
                    style={{
                      ...transform,
                      width: '180px',
                      height: '270px',
                      transition: 'transform 0.1s ease-out, opacity 0.15s',
                    }}
                  >
                    {centered && (
                      <div className="absolute -inset-4 bg-amber-500/20 rounded-2xl blur-xl" />
                    )}

                    <div className={`relative w-full h-full rounded-xl overflow-hidden transition-all duration-200 ${
                      centered
                        ? 'border-2 border-amber-400 shadow-[0_0_50px_rgba(251,191,36,0.45)]'
                        : 'border border-slate-700/50 shadow-[0_0_18px_rgba(0,0,0,0.5)]'
                    }`}>
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: 'url(/img/card_bg.png)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                      <div className="absolute inset-0 bg-slate-900/25" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <button
          onClick={onExitGestureMode}
          className="mt-8 px-5 py-1 text-xs rounded-full border border-purple-300/20 text-[#BDA1FF] hover:bg-purple-500/10 transition-all"
        >
          {language === 'zh' ? '返回普通抽牌' : 'Back Normal Pick Card'}
        </button>
      </div>

      {/* Preview overlay (when pinching) - card and info in column layout */}
      {isPinching && previewCard && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 py-8">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Content container - card above, info below */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Flipping card */}
            <div style={{ width: '180px', height: '270px', perspective: '1200px' }}>
              <div
                className="w-full h-full relative"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${flipProgress * 180}deg)`,
                }}
              >
                {/* Back */}
                <div
                  className="absolute inset-0 rounded-xl border-2 border-amber-500 shadow-[0_0_60px_rgba(251,191,36,0.5)] overflow-hidden"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage: 'url(/img/card_bg.png)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                </div>

                {/* Front */}
                <div
                  className="absolute inset-0 rounded-xl border-2 border-amber-500 shadow-[0_0_60px_rgba(251,191,36,0.5)] overflow-hidden"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <img
                    src={previewCard.card.imageUrl}
                    alt={previewCard.card.name}
                    className={`w-full h-full object-cover ${previewCard.isReversed ? 'rotate-180' : ''}`}
                  />
                </div>
              </div>
            </div>

            {/* Card info - below the card */}
            {flipProgress >= 1 && (
              <div className="mt-6 text-center">
                <h3 className="text-2xl font-mystic text-amber-400 mb-2">
                  {language === 'zh' ? previewCard.card.nameCn : previewCard.card.name}
                </h3>
                <span className={`inline-block px-3 py-1 rounded text-xs font-mono ${
                  previewCard.isReversed ? 'bg-purple-500/40 text-purple-200' : 'bg-amber-500/40 text-amber-200'
                }`}>
                  {previewCard.isReversed ? (language === 'zh' ? '逆位' : 'REVERSED') : (language === 'zh' ? '正位' : 'UPRIGHT')}
                </span>

                {/* Release hint */}
                <div className="mt-4 animate-pulse">
                  <span className="text-cyan-400 text-sm font-mono">
                    {language === 'zh' ? '🖐️ 松手确认' : '🖐️ Release to confirm'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="absolute w-1 h-1 opacity-0 pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover scale-x-[-1]"
        />
      </div>
    </div>
  );
};
