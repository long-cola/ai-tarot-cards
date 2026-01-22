import { DrawnCard } from '../../types';
import { cardMeaningDB } from '../../data/cardMeaningDB';

export type FortuneReadingTopic =
  | 'general'
  | 'love'
  | 'career'
  | 'yes-no'
  | 'one-card'
  | 'three-card'
  | 'meaning';

const topicIntros: Record<FortuneReadingTopic, string> = {
  general: 'Here is a grounded fortune reading based on your cards.',
  love: 'Here is a love focused fortune reading based on your cards.',
  career: 'Here is a career focused fortune reading based on your cards.',
  'yes-no': 'Here is a clarity focused reading to guide your decision.',
  'one-card': 'Here is a single card fortune message you can use today.',
  'three-card': 'Here is a three card story to guide your next step.',
  meaning: 'Here is a quick guide to the card meanings in your draw.',
};

const topicAdvice: Record<FortuneReadingTopic, string[]> = {
  general: [
    'Name one small action that aligns with the strongest card.',
    'Notice the theme that repeats across the draw.',
    'Use the message as a prompt, not a verdict.',
  ],
  love: [
    'Choose the response that protects your emotional balance.',
    'Ask for clarity instead of guessing.',
    'Let the card theme guide one kind action today.',
  ],
  career: [
    'Take one step that increases clarity or momentum.',
    'Focus on the skill or habit the cards highlight.',
    'Make your next decision small and concrete.',
  ],
  'yes-no': [
    'Focus on conditions, not just the answer.',
    'Pick the option that feels steady, not rushed.',
    'Use the cards to define your next test step.',
  ],
  'one-card': [
    'Write the theme in one sentence.',
    'Choose one action that fits the card message.',
    'Return to the card when you feel distracted.',
  ],
  'three-card': [
    'Treat the cards as a timeline, not separate facts.',
    'Notice how the final card suggests direction.',
    'Decide one step that honors the overall story.',
  ],
  meaning: [
    'Combine the keyword and your real situation.',
    'Read reversed cards as inner work or delays.',
    'Keep the meaning practical and specific.',
  ],
};

const positionLabel = (index: number, total: number) => {
  if (total === 1) return 'Card';
  return ['Past', 'Present', 'Future'][index] || `Card ${index + 1}`;
};

const extractCardMeaning = (card: DrawnCard) => {
  const entry = cardMeaningDB[card.name];
  if (!entry) {
    return {
      keywords: [],
      meaning: card.isReversed ? card.meaningReversedEn || card.meaningReversed : card.meaningUprightEn || card.meaningUpright,
      summary: card.isReversed ? 'Watch for blocks or delays.' : 'Focus on the core theme.',
    };
  }
  const orientation = card.isReversed ? entry.reversed : entry.upright;
  return {
    keywords: entry.keywords,
    meaning: orientation.meaning,
    summary: orientation.summary,
  };
};

const summarizeKeywords = (cards: DrawnCard[]) => {
  const collected = cards.flatMap((card) => extractCardMeaning(card).keywords);
  const unique = Array.from(new Set(collected)).slice(0, 6);
  return unique.length ? unique.join(', ') : 'clarity, focus, and forward movement';
};

export const buildLocalFortuneReading = (
  cards: DrawnCard[],
  topic: FortuneReadingTopic,
  question: string
): string => {
  const summaryKeywords = summarizeKeywords(cards);
  const intro = topicIntros[topic] || topicIntros.general;
  const advice = topicAdvice[topic] || topicAdvice.general;

  const cardSections = cards
    .map((card, index) => {
      const orientation = card.isReversed ? 'Reversed' : 'Upright';
      const meaning = extractCardMeaning(card);
      return [
        `### ${positionLabel(index, cards.length)}: ${card.name} (${orientation})`,
        `**Core meaning:** ${meaning.meaning}`,
        `**Quick take:** ${meaning.summary}`,
      ].join('\n');
    })
    .join('\n\n');

  const adviceList = advice.map((item) => `- ${item}`).join('\n');

  return [
    `## Fortune Summary`,
    intro,
    question ? `**Your focus:** ${question}` : '',
    `**Key themes:** ${summaryKeywords}`,
    '',
    cardSections,
    '',
    '## Practical Advice',
    adviceList,
  ]
    .filter(Boolean)
    .join('\n\n');
};
