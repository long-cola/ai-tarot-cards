import React, { useRef, useMemo, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { TarotCardData } from '../../types';

interface TarotCard3DProps {
  card: TarotCardData;
  index: number;
  position: [number, number, number];
  rotation: [number, number, number];
  isHovered: boolean;
  isGrabbed: boolean;
  onClick?: () => void;
}

// Card back texture (using a gradient as fallback)
const CARD_BACK_URL = '/img/card_bg.png';

export const TarotCard3D: React.FC<TarotCard3DProps> = ({
  card,
  index,
  position,
  rotation,
  isHovered,
  isGrabbed,
  onClick,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hoverScale, setHoverScale] = useState(1);
  const [currentY, setCurrentY] = useState(position[1]);

  // Load card textures
  const backTexture = useLoader(TextureLoader, CARD_BACK_URL);

  // Card dimensions (standard tarot card ratio is about 2.75:4.75)
  const cardWidth = 0.6;
  const cardHeight = 1;
  const cardDepth = 0.02;

  // Target position and scale based on state
  const targetY = useMemo(() => {
    if (isGrabbed) return position[1] + 2;
    if (isHovered) return position[1] + 0.5;
    return position[1];
  }, [isHovered, isGrabbed, position]);

  const targetScale = useMemo(() => {
    if (isGrabbed) return 1.3;
    if (isHovered) return 1.15;
    return 1;
  }, [isHovered, isGrabbed]);

  // Smooth animation
  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Smooth Y position
    const newY = THREE.MathUtils.lerp(currentY, targetY, delta * 8);
    setCurrentY(newY);
    meshRef.current.position.y = newY;

    // Smooth scale
    const newScale = THREE.MathUtils.lerp(hoverScale, targetScale, delta * 8);
    setHoverScale(newScale);
    meshRef.current.scale.setScalar(newScale);

    // Add subtle floating animation when grabbed
    if (isGrabbed) {
      meshRef.current.position.y += Math.sin(Date.now() * 0.003) * 0.02;
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  // Create materials for the card
  const materials = useMemo(() => {
    const sideMaterial = new THREE.MeshStandardMaterial({
      color: '#1e1b4b', // Dark purple for edges
    });

    const backMaterial = new THREE.MeshStandardMaterial({
      map: backTexture,
      side: THREE.FrontSide,
    });

    // For front (we show the back since cards are face-down)
    const frontMaterial = new THREE.MeshStandardMaterial({
      map: backTexture,
      side: THREE.FrontSide,
    });

    return [
      sideMaterial, // right
      sideMaterial, // left
      sideMaterial, // top
      sideMaterial, // bottom
      frontMaterial, // front
      backMaterial, // back
    ];
  }, [backTexture]);

  return (
    <mesh
      ref={meshRef}
      position={[position[0], currentY, position[2]]}
      rotation={rotation}
      onClick={onClick}
      userData={{ index, cardId: card.id }}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[cardWidth, cardHeight, cardDepth]} />
      {materials.map((material, i) => (
        <primitive key={i} object={material} attach={`material-${i}`} />
      ))}

      {/* Glow effect when hovered or grabbed */}
      {(isHovered || isGrabbed) && (
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[cardWidth + 0.1, cardHeight + 0.1]} />
          <meshBasicMaterial
            color={isGrabbed ? '#fbbf24' : '#a855f7'}
            transparent
            opacity={isGrabbed ? 0.6 : 0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </mesh>
  );
};

// Preload textures
useLoader.preload(TextureLoader, CARD_BACK_URL);
