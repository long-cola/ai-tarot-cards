import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { HandPosition, GestureType, GESTURE_ACTIONS } from './types';

interface HandPointerProps {
  position: HandPosition | null;
  gesture: GestureType;
}

export const HandPointer: React.FC<HandPointerProps> = ({ position, gesture }) => {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  // Map gesture to visual state
  const { color, scale, innerScale } = useMemo(() => {
    if (!gesture) {
      return { color: '#6b7280', scale: 0.15, innerScale: 0.05 };
    }

    switch (gesture) {
      case GESTURE_ACTIONS.READY:
        return { color: '#22c55e', scale: 0.2, innerScale: 0.08 }; // Green - ready
      case GESTURE_ACTIONS.HOVER:
        return { color: '#a855f7', scale: 0.25, innerScale: 0.1 }; // Purple - hovering
      case GESTURE_ACTIONS.GRAB:
        return { color: '#fbbf24', scale: 0.3, innerScale: 0.12 }; // Amber - grabbing
      case GESTURE_ACTIONS.CONFIRM:
        return { color: '#ef4444', scale: 0.35, innerScale: 0.15 }; // Red - confirming
      default:
        return { color: '#6b7280', scale: 0.15, innerScale: 0.05 };
    }
  }, [gesture]);

  // Animate position and effects
  useFrame((state, delta) => {
    if (!groupRef.current || !position) return;

    // Convert 2D hand position to 3D world position
    // Hand x: -1 to 1 maps to world x: -4 to 4
    // Hand y: -1 to 1 maps to world y: -2 to 3
    const targetX = position.x * 4;
    const targetY = position.y * 2.5 + 0.5;
    const targetZ = 2; // Fixed z position in front of camera

    // Smooth lerp to target
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, delta * 15);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 15);
    groupRef.current.position.z = targetZ;

    // Pulse animation for inner sphere
    if (innerRef.current) {
      const pulseScale = innerScale * (1 + Math.sin(state.clock.elapsedTime * 4) * 0.2);
      innerRef.current.scale.setScalar(pulseScale);
    }

    // Rotation animation for outer ring
    if (outerRef.current) {
      outerRef.current.rotation.z += delta * 2;
    }
  });

  if (!position) return null;

  return (
    <group ref={groupRef} position={[0, 0, 2]}>
      {/* Outer ring */}
      <mesh ref={outerRef}>
        <torusGeometry args={[scale, scale * 0.15, 8, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>

      {/* Inner glow sphere */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[innerScale, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>

      {/* Point light for glow effect */}
      <pointLight color={color} intensity={0.5} distance={2} />

      {/* Direction indicator based on gesture */}
      {gesture === GESTURE_ACTIONS.HOVER && (
        <mesh position={[0, -scale * 2, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[scale * 0.3, scale * 0.8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} />
        </mesh>
      )}
    </group>
  );
};
