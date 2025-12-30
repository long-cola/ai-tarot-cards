import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CardParticlesProps {
  position: [number, number, number];
  onComplete?: () => void;
}

const PARTICLE_COUNT = 300;
const PARTICLE_LIFETIME = 2.5; // seconds

export const CardParticles: React.FC<CardParticlesProps> = ({ position, onComplete }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const [startTime] = useState(() => Date.now());
  const [isComplete, setIsComplete] = useState(false);

  // Generate initial particle data
  const { positions, velocities, colors, sizes, lifetimes } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const lifetimes = new Float32Array(PARTICLE_COUNT);

    // Card dimensions for particle spawn area
    const cardWidth = 0.6;
    const cardHeight = 1;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Initial position - spread across card surface
      positions[i * 3] = position[0] + (Math.random() - 0.5) * cardWidth;
      positions[i * 3 + 1] = position[1] + (Math.random() - 0.5) * cardHeight;
      positions[i * 3 + 2] = position[2] + (Math.random() - 0.5) * 0.1;

      // Velocity - mostly upward with some spread
      velocities[i * 3] = (Math.random() - 0.5) * 0.5;
      velocities[i * 3 + 1] = Math.random() * 1.5 + 0.5; // Upward
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.3;

      // Color - mix of amber, purple, and white (magical look)
      const colorChoice = Math.random();
      if (colorChoice < 0.4) {
        // Amber
        colors[i * 3] = 0.984;
        colors[i * 3 + 1] = 0.749;
        colors[i * 3 + 2] = 0.145;
      } else if (colorChoice < 0.7) {
        // Purple
        colors[i * 3] = 0.659;
        colors[i * 3 + 1] = 0.333;
        colors[i * 3 + 2] = 0.969;
      } else {
        // White/silver
        colors[i * 3] = 0.9;
        colors[i * 3 + 1] = 0.85;
        colors[i * 3 + 2] = 1.0;
      }

      // Size - random with some variation
      sizes[i] = Math.random() * 0.05 + 0.02;

      // Lifetime - staggered start
      lifetimes[i] = Math.random() * 0.5; // 0 to 0.5 second delay
    }

    return { positions, velocities, colors, sizes, lifetimes };
  }, [position]);

  // Animation
  useFrame((_, delta) => {
    if (!pointsRef.current || isComplete) return;

    const elapsed = (Date.now() - startTime) / 1000;

    if (elapsed > PARTICLE_LIFETIME + 0.5) {
      setIsComplete(true);
      onComplete?.();
      return;
    }

    const posAttr = pointsRef.current.geometry.attributes.position;
    const sizeAttr = pointsRef.current.geometry.attributes.size;
    const colorAttr = pointsRef.current.geometry.attributes.color;
    const posArray = posAttr.array as Float32Array;
    const sizeArray = sizeAttr.array as Float32Array;
    const colorArray = colorAttr.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particleTime = elapsed - lifetimes[i];

      if (particleTime < 0) continue;

      const progress = Math.min(particleTime / PARTICLE_LIFETIME, 1);

      // Update position with velocity and some turbulence
      const turbulence = Math.sin(particleTime * 3 + i) * 0.1;
      posArray[i * 3] += velocities[i * 3] * delta + turbulence * delta;
      posArray[i * 3 + 1] += velocities[i * 3 + 1] * delta * (1 - progress * 0.5);
      posArray[i * 3 + 2] += velocities[i * 3 + 2] * delta;

      // Fade out size
      sizeArray[i] = sizes[i] * (1 - progress);

      // Fade out color (reduce alpha by darkening)
      const fade = 1 - progress;
      colorArray[i * 3] = colors[i * 3] * fade;
      colorArray[i * 3 + 1] = colors[i * 3 + 1] * fade;
      colorArray[i * 3 + 2] = colors[i * 3 + 2] * fade;
    }

    posAttr.needsUpdate = true;
    sizeAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;
  });

  // Call onComplete after animation
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, (PARTICLE_LIFETIME + 0.5) * 1000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (isComplete) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={PARTICLE_COUNT}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={PARTICLE_COUNT}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        transparent
        opacity={0.8}
        vertexColors
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
