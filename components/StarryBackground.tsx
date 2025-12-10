import React, { useMemo } from 'react';

export const StarryBackground: React.FC = () => {
  // Generate random stars only once - increased count for design match
  const stars = useMemo(() => {
    return Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 0.5}px`,
      delay: `${Math.random() * 8}s`,
      duration: `${Math.random() * 3 + 4}s`,
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-gradient-to-b from-[#1a1b3a] via-[#252651] to-[#1a1b3a]">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}
    </div>
  );
};
