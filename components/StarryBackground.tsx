import React, { useMemo } from 'react';

export const StarryBackground: React.FC = () => {
  // Generate random stars only once
  const stars = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 1}px`,
      delay: `${Math.random() * 5}s`,
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white star"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
    </div>
  );
};
