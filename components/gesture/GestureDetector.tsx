import React, { useEffect, useRef } from 'react';
import { Language } from '../../types';

interface GestureDetectorProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  onStart: () => void;
  language: Language;
}

export const GestureDetector: React.FC<GestureDetectorProps> = ({
  videoRef,
  isReady,
  isLoading,
  error,
  onStart,
  language,
}) => {
  const hasStartedRef = useRef(false);

  // Auto-start when component mounts (only once)
  useEffect(() => {
    if (!hasStartedRef.current && !isReady && !isLoading && !error) {
      hasStartedRef.current = true;
      onStart();
    }
  }, [isReady, isLoading, error, onStart]);

  return (
    <div className="absolute top-4 right-4 z-30">
      {/* Camera Preview */}
      <div className="relative w-36 h-28 rounded-lg overflow-hidden border-2 border-purple-500/40 bg-black/50 shadow-lg">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover scale-x-[-1]"
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="text-center">
              <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span className="text-xs text-purple-300">
                {language === 'zh' ? '加载中...' : 'Loading...'}
              </span>
            </div>
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 bg-red-900/70 flex items-center justify-center p-2">
            <span className="text-[10px] text-red-200 text-center">
              {language === 'zh' ? '摄像头不可用' : 'Camera unavailable'}
            </span>
          </div>
        )}

        {/* Ready Indicator */}
        {isReady && !error && (
          <div className="absolute bottom-1 left-1 flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-[10px] text-green-300">
              {language === 'zh' ? '就绪' : 'Ready'}
            </span>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-2 text-center">
        <p className="text-[10px] text-slate-400 leading-tight">
          {language === 'zh' ? (
            <>
              张开手掌 = 准备<br />
              指向 = 选择卡牌<br />
              握拳 = 确认
            </>
          ) : (
            <>
              Open palm = Ready<br />
              Point = Select card<br />
              Fist = Confirm
            </>
          )}
        </p>
      </div>
    </div>
  );
};
