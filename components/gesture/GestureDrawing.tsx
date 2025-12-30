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

    const xPos = offset * 160;
    const zPos = -absOffset * 80;
    const scale = Math.max(0.65, 1 - absOffset * 0.12);
    const rotateY = offset * -6;
    const opacity = Math.max(0.35, 1 - absOffset * 0.2);

    return {
      transform: `translateX(${xPos}px) translateZ(${zPos}px) scale(${scale}) rotateY(${rotateY}deg)`,
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
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-slate-950">

      {/* Exit button */}
      <button
        onClick={onExitGestureMode}
        className="absolute top-4 left-4 z-40 px-3 py-1.5 rounded-full bg-black/50 border border-slate-700/50 text-slate-400 text-xs hover:bg-slate-800/80 hover:text-slate-300 transition-all flex items-center gap-1.5"
      >
        <span>←</span>
        <span>{language === 'zh' ? '返回' : 'Exit'}</span>
      </button>

      {/* Progress indicator */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30">
        <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-black/60 border border-slate-800/50 backdrop-blur-sm">
          {[0, 1, 2].map(i => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                  drawnCards.length > i
                    ? 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                    : 'bg-slate-700'
                }`}
              />
              <span className="text-[9px] text-slate-600 uppercase tracking-wider">
                {language === 'zh' ? ['过去', '现在', '未来'][i] : ['Past', 'Now', 'Future'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Drawn cards preview */}
      {drawnCards.length > 0 && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {drawnCards.map((card, i) => (
            <div key={i} className="w-10 h-14 rounded overflow-hidden border border-amber-500/40 opacity-70">
              <img
                src={card.imageUrl}
                alt={card.name}
                className={`w-full h-full object-cover ${card.isReversed ? 'rotate-180' : ''}`}
              />
            </div>
          ))}
        </div>
      )}

      {/* Hand cursor */}
      {isReady && handPosition && !isPinching && (
        <div
          className="absolute w-10 h-10 pointer-events-none z-40"
          style={{
            left: `${Math.max(5, Math.min(95, ((-handPosition.x + 1) / 2) * 100))}%`,
            top: `${Math.max(10, Math.min(90, ((-handPosition.y + 1) / 2) * 100))}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="w-full h-full rounded-full border border-cyan-400/60 bg-cyan-400/10 shadow-[0_0_20px_rgba(34,211,238,0.3)]" />
          <div className="absolute inset-2 rounded-full border border-cyan-400/40" />
        </div>
      )}

      {/* Card carousel */}
      {!isPinching && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '1000px' }}>
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
                    width: '130px',
                    height: '195px',
                    transition: 'transform 0.1s ease-out, opacity 0.15s',
                  }}
                >
                  {centered && (
                    <div className="absolute -inset-3 bg-amber-500/20 rounded-2xl blur-xl animate-pulse" />
                  )}

                  <div className={`relative w-full h-full rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    centered
                      ? 'border-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.4)]'
                      : 'border-slate-700/50 shadow-[0_0_15px_rgba(0,0,0,0.5)]'
                  }`}>
                    <div className={`w-full h-full bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 flex items-center justify-center relative ${
                      centered ? 'from-purple-900/70 via-slate-900 to-purple-900/70' : ''
                    }`}>
                      <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: `radial-gradient(circle at 50% 50%, transparent 0%, transparent 40%, rgba(139,92,246,0.1) 40%, rgba(139,92,246,0.1) 41%, transparent 41%)`,
                        backgroundSize: '16px 16px',
                      }} />
                      <div className="absolute inset-2 border border-slate-700/40 rounded-lg" />
                      <span className={`text-4xl font-mystic transition-all duration-300 ${
                        centered ? 'text-amber-400 scale-110' : 'text-slate-600'
                      }`}>
                        ☾
                      </span>
                      {centered && (
                        <>
                          <div className="absolute top-2 left-2 w-2.5 h-2.5 border-l-2 border-t-2 border-amber-400/60" />
                          <div className="absolute top-2 right-2 w-2.5 h-2.5 border-r-2 border-t-2 border-amber-400/60" />
                          <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-l-2 border-b-2 border-amber-400/60" />
                          <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-r-2 border-b-2 border-amber-400/60" />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
                  <div className="w-full h-full bg-gradient-to-br from-purple-900 via-slate-900 to-purple-900 flex items-center justify-center">
                    <span className="text-6xl font-mystic text-amber-400">☾</span>
                  </div>
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

      {/* Instructions */}
      {!isPinching && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 text-center">
          {isLoading ? (
            <div className="flex items-center gap-2 text-slate-500">
              <div className="w-3 h-3 border border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-mono uppercase tracking-wider">
                {language === 'zh' ? '初始化...' : 'Initializing...'}
              </span>
            </div>
          ) : isReady ? (
            <div className="space-y-2">
              <p className="text-slate-400 text-sm font-mono">
                <span className="text-cyan-400">←</span>
                {language === 'zh' ? ' 滑动选牌 ' : ' Swipe '}
                <span className="text-cyan-400">→</span>
              </p>
              <p className="text-slate-600 text-xs">
                {language === 'zh' ? '🤏 捏合预览 · 🖐️ 松手确认' : '🤏 Pinch to preview · 🖐️ Release to confirm'}
              </p>
            </div>
          ) : (
            <p className="text-slate-600 text-xs font-mono">{language === 'zh' ? '等待摄像头...' : 'Awaiting camera...'}</p>
          )}
        </div>
      )}

      {/* Camera preview */}
      <div className="absolute bottom-4 right-4 z-30">
        <div className="w-24 h-16 rounded overflow-hidden border border-slate-800 bg-black/80 opacity-40 hover:opacity-100 transition-opacity">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />
          {isReady && (
            <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          )}
        </div>
      </div>

      {/* Gesture debug */}
      {isReady && (
        <div className="absolute bottom-4 left-4 z-30 text-slate-700 text-[10px] font-mono">
          {gesture || 'idle'} {isPinching ? '(pinching)' : ''}
        </div>
      )}
    </div>
  );
};
