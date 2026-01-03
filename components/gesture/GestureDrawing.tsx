import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
const GESTURE_LAYOUT = {
  maxOffset: 6,
  gap: 52.8,
  widths: [321, 166.46, 147.96, 129.47, 110.97, 92.48, 73.98],
  heights: [588, 304.92, 271.04, 237.16, 203.28, 169.4, 135.52],
  radii: [11, 9.9, 8.8, 7.7, 6.6, 5.5, 4.4],
  opacities: [1, 0.85, 0.7, 0.55, 0.4, 0.25, 0.2],
};

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
  const [layoutScale, setLayoutScale] = useState(1);

  const lastSelectionTime = useRef(0);
  const lastHandX = useRef<number | null>(null);
  const flipAnimationRef = useRef<number | null>(null);
  const layoutOffsets = useMemo(() => {
    const offsets = [0];
    for (let i = 1; i <= GESTURE_LAYOUT.maxOffset; i += 1) {
      const prev = GESTURE_LAYOUT.widths[i - 1];
      const next = GESTURE_LAYOUT.widths[i];
      offsets[i] = offsets[i - 1] + prev / 2 + GESTURE_LAYOUT.gap + next / 2;
    }
    return offsets;
  }, []);

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

  // Memoize visible cards to avoid recalculating on every render
  const visibleCardIndices = useMemo(() => {
    const center = Math.round(smoothIndex);
    const indices: number[] = [];
    const range = GESTURE_LAYOUT.maxOffset + 1;

    for (let i = Math.max(0, center - range); i <= Math.min(deck.length - 1, center + range); i++) {
      indices.push(i);
    }
    return indices;
  }, [smoothIndex, deck.length]);

  // Smooth carousel animation - optimized with threshold to reduce updates
  useEffect(() => {
    if (isPinching) return;

    let animationId: number;
    let lastUpdate = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    const animate = (timestamp: number) => {
      if (timestamp - lastUpdate >= frameInterval) {
        setSmoothIndex(prev => {
          const diff = targetIndex - prev;
          if (Math.abs(diff) < 0.01) return targetIndex;
          return prev + diff * 0.15; // Slightly faster for better responsiveness
        });
        lastUpdate = timestamp;
      }
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [targetIndex, isPinching]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateScale = () => {
      const scaleX = window.innerWidth / 1920;
      const scaleY = window.innerHeight / 1080;
      setLayoutScale(Math.min(scaleX, scaleY, 1));
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

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
  const lerp = (start: number, end: number, progress: number) => start + (end - start) * progress;
  const interpolate = (values: number[], value: number) => {
    const clamped = Math.min(values.length - 1, Math.max(0, value));
    const low = Math.floor(clamped);
    const high = Math.min(values.length - 1, low + 1);
    const t = clamped - low;
    return lerp(values[low], values[high], t);
  };

  const getCardLayout = useCallback((index: number) => {
    const offset = index - smoothIndex;
    const absOffset = Math.abs(offset);
    const clamped = Math.min(GESTURE_LAYOUT.maxOffset, absOffset);
    const width = interpolate(GESTURE_LAYOUT.widths, clamped);
    const height = interpolate(GESTURE_LAYOUT.heights, clamped);
    const radius = interpolate(GESTURE_LAYOUT.radii, clamped);
    const opacity = interpolate(GESTURE_LAYOUT.opacities, clamped);
    const baseOffset = interpolate(layoutOffsets, clamped);
    const xPos = Math.sign(offset) * baseOffset;
    const yPos = (GESTURE_LAYOUT.heights[0] - height) / 2;

    return {
      width,
      height,
      radius,
      opacity,
      xPos,
      yPos,
      zIndex: Math.round(100 - absOffset * 6),
      isCentered: absOffset < 0.5,
    };
  }, [smoothIndex, layoutOffsets]);

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

  const isPreviewing = isPinching && previewCard !== null;
  const showPreviewInfo = isPreviewing && flipProgress >= 1;
  const showPreviewOverlay = isPreviewing;

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

      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: '1920px',
          height: '1080px',
          transform: `translate(-50%, -50%) scale(${layoutScale})`,
          transformOrigin: 'center',
        }}
      >
        <div className="relative w-full h-full">
          <button
            onClick={onExitGestureMode}
            className="absolute z-20 px-4 py-1 text-xs rounded-full border border-purple-300/20 text-[#BDA1FF] hover:bg-purple-500/10 transition-all"
            style={{ left: '27px', top: '22px', width: '63px', height: '32px' }}
          >
            {language === 'zh' ? '退出' : 'Exit'}
          </button>

          <h2
            className="text-[#E8E3FF] text-[32px] leading-[48px] font-mystic tracking-wide text-center"
            style={{
              position: 'absolute',
              top: '118px',
              left: '50%',
              width: '646px',
              transform: 'translateX(-50%)',
              whiteSpace: 'nowrap',
            }}
          >
            {language === 'zh' ? '挥手移动卡牌，捏合选择。' : 'Wave to move the cards, pinch to select.'}
          </h2>

          <div
            className="absolute left-1/2 flex items-center gap-[84px]"
            style={{ top: '216px', transform: 'translateX(-50%)' }}
          >
            {[0, 1, 2].map((i) => {
              const label = language === 'zh'
                ? ['过去', '现在', '未来'][i]
                : ['Past', 'Present', 'Future'][i];
              const isActive = drawnCards.length === i;
              const isDone = drawnCards.length > i;

              return (
                <div
                  key={label}
                  className={`flex items-center justify-center border text-base font-mystic tracking-wide ${
                    i === 0 ? 'bg-[#3E2080]/20' : 'bg-[#070212]/20'
                  } ${isActive ? 'border-amber-400/60 text-[#E8E3FF]' : 'border-[#564790] text-[#9B82C6]'} ${
                    isDone ? 'opacity-60' : 'opacity-100'
                  }`}
                  style={{ width: '160px', height: '53px', borderRadius: '16px' }}
                >
                  {label}
                </div>
              );
            })}
          </div>

          <div
            className="absolute left-1/2 relative"
            style={{
              top: '309px',
              width: '2397.21px',
              height: '588px',
              transform: 'translateX(-50%)',
            }}
          >
            {visibleCardIndices.map(index => {
              const card = deck[index];
              const offset = index - smoothIndex;
              const absOffset = Math.abs(offset);

              const layout = getCardLayout(index);
              const shadowY = Math.round(layout.height * 0.052 * 100) / 100;
              const shadowBlur = Math.round(layout.height * 0.104 * 100) / 100;
              const isPreviewCard = isPreviewing && previewCard?.index === index;
              const previewScale = isPreviewCard ? (showPreviewInfo ? 1.55 : 1.35) : 1;
              const previewLift = isPreviewCard && showPreviewInfo ? -90 : 0;
              const scaledWidth = layout.width * previewScale;
              const scaledHeight = layout.height * previewScale;
              const cardTop = layout.yPos + previewLift - (scaledHeight - layout.height) / 2;
              const cardBottom = cardTop + scaledHeight;
              const infoTop = cardBottom + 18;
              const infoWidth = Math.max(260, scaledWidth + 24);

              return (
                <React.Fragment key={card.id}>
                  {isPreviewCard && showPreviewInfo && previewCard && (
                    <div
                      className="absolute"
                      style={{
                        left: '50%',
                        top: `${infoTop}px`,
                        width: `${infoWidth}px`,
                        transform: `translateX(${layout.xPos}px) translateX(-50%)`,
                        zIndex: 190,
                      }}
                    >
                      <div className="rounded-2xl bg-black/90 border border-purple-200/30 px-4 py-3 backdrop-blur-xl shadow-[0_18px_40px_rgba(10,5,20,0.8)]">
                        <h3 className="text-[22px] leading-[30px] font-mystic text-amber-400 mb-2 text-center">
                          {language === 'zh' ? previewCard.card.nameCn : previewCard.card.name}
                        </h3>
                        <div className="flex flex-col items-center">
                          <span className={`inline-block px-3 py-1 rounded text-xs font-mono ${
                            previewCard.isReversed ? 'bg-purple-500/40 text-purple-200' : 'bg-amber-500/40 text-amber-200'
                          }`}>
                            {previewCard.isReversed ? (language === 'zh' ? '逆位' : 'REVERSED') : (language === 'zh' ? '正位' : 'UPRIGHT')}
                          </span>
                          <div className="mt-3 animate-pulse">
                            <span className="text-cyan-400 text-sm font-mono">
                              {language === 'zh' ? '🖐️ 松手确认' : '🖐️ Release to confirm'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div
                    className="absolute"
                    style={{
                      width: `${layout.width}px`,
                      height: `${layout.height}px`,
                      left: '50%',
                      top: `${layout.yPos}px`,
                      transform: `translateX(${layout.xPos}px) translateX(-50%) translateY(${previewLift}px) scale(${previewScale})`,
                      opacity: layout.opacity,
                      zIndex: isPreviewCard ? 200 : layout.zIndex,
                      willChange: 'transform, opacity',
                    }}
                  >
                    <div
                      className="relative w-full h-full overflow-hidden"
                      style={{
                        borderRadius: `${layout.radius}px`,
                        border: layout.isCentered ? '1.1px solid #EBB658' : '1px solid rgba(86,71,144,0.4)',
                        boxShadow: layout.isCentered
                          ? '0px 17.6px 52.8px rgba(204, 175, 70, 0.3)'
                          : `0px ${shadowY}px ${shadowBlur}px rgba(20, 2, 36, 0.8)`,
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      {isPreviewCard ? (
                        <div
                          className="absolute inset-0"
                          style={{
                            transformStyle: 'preserve-3d',
                            transform: `rotateY(${flipProgress * 180}deg)`,
                            willChange: 'transform',
                          }}
                        >
                          <div
                            className="absolute inset-0"
                            style={{
                              backfaceVisibility: 'hidden',
                              backgroundImage: 'url(/img/card_bg.png)',
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }}
                          />
                          <div
                            className="absolute inset-0"
                            style={{
                              backfaceVisibility: 'hidden',
                              transform: 'rotateY(180deg)',
                            }}
                          >
                            <img
                              src={previewCard?.card.imageUrl}
                              alt={previewCard?.card.name}
                              className={`w-full h-full object-cover ${previewCard?.isReversed ? 'rotate-180' : ''}`}
                            />
                          </div>
                        </div>
                      ) : (
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage: 'url(/img/card_bg.png)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        />
                      )}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {!isPreviewing && (
            <button
              onClick={onExitGestureMode}
              className="absolute px-5 py-1 text-xs rounded-full border border-purple-300/20 text-[#BDA1FF] hover:bg-purple-500/10 transition-all"
              style={{ top: '991px', left: '50%', width: '175px', height: '32px', transform: 'translateX(-50%)' }}
            >
              {language === 'zh' ? '返回普通抽牌' : 'Back Normal Pick Card'}
            </button>
          )}

        </div>
      </div>

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
