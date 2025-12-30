import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { TarotCard3D } from './TarotCard3D';
import { HandPointer } from './HandPointer';
import { CardParticles } from './CardParticles';
import { TarotCardData } from '../../types';
import { HandPosition, GestureType, DrawState, GESTURE_ACTIONS } from './types';

interface GestureSceneProps {
  deck: TarotCardData[];
  gesture: GestureType;
  handPosition: HandPosition | null;
  drawState: DrawState;
  hoveredCardIndex: number | null;
  grabbedCardIndex: number | null;
  onCardHovered: (index: number | null) => void;
  onCardGrabbed: (index: number | null) => void;
  onCardConfirmed: (index: number) => void;
  onStateChange: (state: DrawState) => void;
}

export const GestureScene: React.FC<GestureSceneProps> = ({
  deck,
  gesture,
  handPosition,
  drawState,
  hoveredCardIndex,
  grabbedCardIndex,
  onCardHovered,
  onCardGrabbed,
  onCardConfirmed,
  onStateChange,
}) => {
  const { camera, scene } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const cardMeshesRef = useRef<THREE.Mesh[]>([]);
  const [particlePositions, setParticlePositions] = useState<[number, number, number][]>([]);
  const confirmTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate card positions in a fan arc
  const cardPositions = useMemo(() => {
    const radius = 4;
    const totalArc = Math.PI * 0.7; // 126 degrees
    const startAngle = -totalArc / 2;

    return deck.map((_, i) => {
      const angle = startAngle + (totalArc / Math.max(deck.length - 1, 1)) * i;
      return {
        position: [
          Math.sin(angle) * radius,
          -1.5,
          Math.cos(angle) * radius - 2,
        ] as [number, number, number],
        rotation: [0, -angle, 0] as [number, number, number],
      };
    });
  }, [deck.length]);

  // Raycast from hand position to find intersected cards
  const performRaycast = useCallback(() => {
    if (!handPosition) return null;

    // Convert hand position to ray origin
    const rayOrigin = new THREE.Vector3(
      handPosition.x * 4,
      handPosition.y * 2.5 + 0.5,
      2
    );

    // Ray direction towards the cards
    const rayDirection = new THREE.Vector3(0, -0.3, -1).normalize();

    raycaster.current.set(rayOrigin, rayDirection);

    // Get all card meshes
    const cardMeshes = scene.children.filter(
      (child) => child.userData?.cardId !== undefined
    );

    if (cardMeshes.length === 0) return null;

    const intersects = raycaster.current.intersectObjects(cardMeshes, true);

    if (intersects.length > 0) {
      // Find the mesh with cardId
      let target = intersects[0].object;
      while (target && target.userData?.cardId === undefined) {
        target = target.parent as THREE.Object3D;
      }
      if (target && target.userData?.index !== undefined) {
        return target.userData.index as number;
      }
    }

    return null;
  }, [handPosition, scene]);

  // State machine logic
  useFrame(() => {
    if (!handPosition || !gesture) {
      // No hand detected, reset hover
      if (hoveredCardIndex !== null && drawState !== 'grabbed') {
        onCardHovered(null);
      }
      return;
    }

    // Perform raycast
    const intersectedIndex = performRaycast();

    // State transitions based on gesture
    switch (drawState) {
      case 'idle':
        // Open palm activates ready state
        if (gesture === GESTURE_ACTIONS.READY) {
          onStateChange('ready');
        }
        break;

      case 'ready':
        // Pointing or Victory gesture starts hovering
        if (gesture === GESTURE_ACTIONS.HOVER || gesture === GESTURE_ACTIONS.GRAB) {
          if (intersectedIndex !== null) {
            onCardHovered(intersectedIndex);
            onStateChange('hovering');
          }
        }
        // Back to idle if hand closes
        if (gesture === GESTURE_ACTIONS.CONFIRM) {
          onStateChange('idle');
        }
        break;

      case 'hovering':
        // Update hovered card
        if (intersectedIndex !== null && intersectedIndex !== hoveredCardIndex) {
          onCardHovered(intersectedIndex);
        } else if (intersectedIndex === null) {
          onCardHovered(null);
          onStateChange('ready');
        }

        // Victory/peace sign grabs the card
        if (gesture === GESTURE_ACTIONS.GRAB && hoveredCardIndex !== null) {
          onCardGrabbed(hoveredCardIndex);
          onStateChange('grabbed');
        }

        // Return to ready if hand opens
        if (gesture === GESTURE_ACTIONS.READY) {
          onStateChange('ready');
        }
        break;

      case 'grabbed':
        // Fist confirms selection
        if (gesture === GESTURE_ACTIONS.CONFIRM && grabbedCardIndex !== null) {
          // Start confirmation timer (hold fist for 0.5s)
          if (!confirmTimerRef.current) {
            onStateChange('confirming');
            confirmTimerRef.current = setTimeout(() => {
              // Trigger particle effect
              const cardPos = cardPositions[grabbedCardIndex]?.position;
              if (cardPos) {
                setParticlePositions(prev => [...prev, cardPos]);
              }

              // Confirm the card selection
              onCardConfirmed(grabbedCardIndex);
              onCardGrabbed(null);
              onCardHovered(null);
              onStateChange('idle');
              confirmTimerRef.current = null;
            }, 500);
          }
        }

        // Open palm cancels grab
        if (gesture === GESTURE_ACTIONS.READY) {
          if (confirmTimerRef.current) {
            clearTimeout(confirmTimerRef.current);
            confirmTimerRef.current = null;
          }
          onCardGrabbed(null);
          onStateChange('ready');
        }
        break;

      case 'confirming':
        // If fist is released before confirmation, cancel
        if (gesture !== GESTURE_ACTIONS.CONFIRM) {
          if (confirmTimerRef.current) {
            clearTimeout(confirmTimerRef.current);
            confirmTimerRef.current = null;
          }
          onStateChange('grabbed');
        }
        break;
    }
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (confirmTimerRef.current) {
        clearTimeout(confirmTimerRef.current);
      }
    };
  }, []);

  // Remove completed particles
  const handleParticleComplete = useCallback((index: number) => {
    setParticlePositions(prev => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 5, 5]} intensity={1} color="#fef3c7" />
      <pointLight position={[-3, 2, 3]} intensity={0.5} color="#c4b5fd" />
      <pointLight position={[3, 2, 3]} intensity={0.5} color="#c4b5fd" />

      {/* Background gradient */}
      <mesh position={[0, 0, -5]}>
        <planeGeometry args={[20, 15]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>

      {/* Mystical floor plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
        <circleGeometry args={[6, 64]} />
        <meshStandardMaterial
          color="#1e1b4b"
          transparent
          opacity={0.6}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Hand pointer visualization */}
      <HandPointer position={handPosition} gesture={gesture} />

      {/* Tarot cards */}
      {deck.map((card, index) => (
        <TarotCard3D
          key={card.id}
          card={card}
          index={index}
          position={cardPositions[index].position}
          rotation={cardPositions[index].rotation}
          isHovered={hoveredCardIndex === index}
          isGrabbed={grabbedCardIndex === index}
        />
      ))}

      {/* Particle effects */}
      {particlePositions.map((pos, index) => (
        <CardParticles
          key={`particles-${index}`}
          position={pos}
          onComplete={() => handleParticleComplete(index)}
        />
      ))}

      {/* State indicator ring on floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.49, 0]}>
        <ringGeometry args={[5.5, 5.7, 64]} />
        <meshBasicMaterial
          color={
            drawState === 'confirming'
              ? '#ef4444'
              : drawState === 'grabbed'
              ? '#fbbf24'
              : drawState === 'hovering'
              ? '#a855f7'
              : drawState === 'ready'
              ? '#22c55e'
              : '#6b7280'
          }
          transparent
          opacity={0.6}
        />
      </mesh>
    </>
  );
};
