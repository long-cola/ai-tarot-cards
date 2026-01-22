import { MAJOR_ARCANA } from '../constants';

export interface CardMeaningEntry {
  name: string;
  keywords: string[];
  upright: {
    meaning: string;
    summary: string;
  };
  reversed: {
    meaning: string;
    summary: string;
  };
}

const normalizeKeywords = (text?: string) =>
  (text || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const toSummary = (keywords: string[], prefix: string) =>
  keywords.length ? `${prefix} ${keywords.join(', ')}.` : `${prefix} this theme.`;

export const cardMeaningDB: Record<string, CardMeaningEntry> = Object.fromEntries(
  MAJOR_ARCANA.map((card) => {
    const uprightKeywords = normalizeKeywords(card.meaningUprightEn || card.meaningUpright);
    const reversedKeywords = normalizeKeywords(card.meaningReversedEn || card.meaningReversed);

    return [
      card.name,
      {
        name: card.name,
        keywords: uprightKeywords,
        upright: {
          meaning: card.meaningUprightEn || card.meaningUpright,
          summary: toSummary(uprightKeywords, 'Focus on'),
        },
        reversed: {
          meaning: card.meaningReversedEn || card.meaningReversed,
          summary: toSummary(reversedKeywords, 'Watch for'),
        },
      },
    ];
  })
);
