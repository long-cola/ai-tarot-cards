export enum AppPhase {
  INPUT = 'INPUT',
  SHUFFLING = 'SHUFFLING',
  DRAWING = 'DRAWING',
  REVEAL = 'REVEAL',
  ANALYSIS = 'ANALYSIS',
}

export type Language = 'zh' | 'en';

export interface TarotCardData {
  id: number;
  name: string; // English name
  nameCn: string; // Chinese name
  meaningUpright: string;
  meaningReversed: string;
  imageUrl: string;
}

export interface DrawnCard extends TarotCardData {
  isReversed: boolean;
  position: number; // 0: Past, 1: Present, 2: Future
}

export enum CardSpreadPosition {
  PAST = 0,
  PRESENT = 1,
  FUTURE = 2,
}

export const SPREAD_LABELS = {
  [CardSpreadPosition.PAST]: "过去 / The Past",
  [CardSpreadPosition.PRESENT]: "现在 / The Present",
  [CardSpreadPosition.FUTURE]: "未来 / The Future",
};
