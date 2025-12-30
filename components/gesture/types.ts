// Gesture Drawing Types

export type GestureType = 'Open_Palm' | 'Closed_Fist' | 'Pointing_Up' | 'Thumb_Up' | 'Victory' | 'ILoveYou' | null;

export type DrawState = 'idle' | 'ready' | 'hovering' | 'grabbed' | 'confirming';

export interface HandPosition {
  x: number; // -1 to 1 (left to right)
  y: number; // -1 to 1 (bottom to top)
  z: number; // depth
}

export interface GestureRecognitionState {
  gesture: GestureType;
  handPosition: HandPosition | null;
  confidence: number;
  isReady: boolean;
  error: string | null;
}

export interface CardPosition {
  position: [number, number, number];
  rotation: [number, number, number];
}

// Mapping gesture names from MediaPipe to our app
export const GESTURE_MAP: Record<string, GestureType> = {
  'Open_Palm': 'Open_Palm',
  'Closed_Fist': 'Closed_Fist',
  'Pointing_Up': 'Pointing_Up',
  'Thumb_Up': 'Thumb_Up',
  'Victory': 'Victory',
  'ILoveYou': 'ILoveYou',
};

// Gesture-to-action mapping for tarot drawing
export const GESTURE_ACTIONS = {
  READY: 'Open_Palm',      // Open palm = ready to draw
  HOVER: 'Pointing_Up',    // Point = hover over cards
  GRAB: 'Victory',         // Victory/Peace = grab card (easier than pinch)
  CONFIRM: 'Closed_Fist',  // Fist = confirm selection
} as const;
