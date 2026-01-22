export type FortuneTopic =
  | 'general'
  | 'love'
  | 'career'
  | 'yes-no'
  | 'one-card'
  | 'three-card'
  | 'meaning';

export interface FortuneClusterPageConfig {
  slug: string;
  navLabel: string;
  seo: {
    title: string;
    description: string;
    canonicalUrl: string;
  };
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
  };
  draw: {
    defaultCount: 1 | 3;
    allowedCounts: Array<1 | 3>;
    topic: FortuneTopic;
    defaultQuestion: string;
  };
  what: {
    title: string;
    paragraphs: string[];
  };
  how: {
    title: string;
    steps: string[];
  };
  commonQuestions: {
    title: string;
    questions: string[];
  };
  faq: {
    title: string;
    items: Array<{ question: string; answer: string }>;
  };
}

export const FORTUNE_CLUSTER_PAGES: FortuneClusterPageConfig[] = [
  {
    slug: 'tarot-fortune-cards',
    navLabel: 'Tarot Fortune Cards',
    seo: {
      title: 'Tarot Fortune Cards - Free Online Reading | Mystic Tarot',
      description:
        'Tarot fortune cards for quick clarity on love, career, and life. Draw 1 or 3 cards and get instant guidance.',
      canonicalUrl: 'https://ai-tarotcard.com/tarot-fortune-cards',
    },
    hero: {
      title: 'Tarot Fortune Cards for Instant Clarity',
      subtitle: 'Draw 1 or 3 cards to see the message you need right now.',
      ctaText: 'Draw Your Fortune Cards',
    },
    draw: {
      defaultCount: 3,
      allowedCounts: [1, 3],
      topic: 'general',
      defaultQuestion: 'What does my fortune reveal right now?',
    },
    what: {
      title: 'What are tarot fortune cards?',
      paragraphs: [
        'When your mind will not settle, you want a quick signal. You might be stuck between two options or waiting on a response. Tarot fortune cards give you a clean prompt to reset and decide.',
        'A fortune card reading is focused and short. You draw one or three cards, read the core meaning, and use that message to guide your next step.',
        'This is not about fixed predictions. It is about seeing your situation from a clearer angle so you can act with intent.',
      ],
    },
    how: {
      title: 'How a fortune card reading works',
      steps: [
        'Set a simple, open question that invites clarity.',
        'Draw 1 card for focus or 3 cards for context.',
        'Apply the message with one small action today.',
      ],
    },
    commonQuestions: {
      title: 'Common questions people ask',
      questions: [
        'What should I focus on this week?',
        'What energy is around me right now?',
        'What am I not seeing clearly?',
        'What should I release to move forward?',
        'What is the next right step?',
      ],
    },
    faq: {
      title: 'FAQ',
      items: [
        {
          question: 'Are tarot fortune cards free?',
          answer:
            'Yes. You can draw fortune cards for free and get an instant reading.',
        },
        {
          question: 'Do fortune cards predict the future?',
          answer:
            'No. They are for reflection and guidance, not fixed outcomes.',
        },
        {
          question: 'How many cards should I draw?',
          answer:
            'One card is great for focus. Three cards add context and direction.',
        },
        {
          question: 'Can I draw again if I do not like the message?',
          answer:
            'Try to sit with the first draw. If you are still unsure, reframe your question and draw once more.',
        },
      ],
    },
  },
  {
    slug: 'tarot-fortune-cards-love',
    navLabel: 'Tarot Fortune Cards for Love',
    seo: {
      title: 'Tarot Fortune Cards for Love - Free Reading | Mystic Tarot',
      description:
        'Love feels uncertain? Draw tarot fortune cards for relationship clarity, communication insight, and next steps.',
      canonicalUrl: 'https://ai-tarotcard.com/tarot-fortune-cards-love',
    },
    hero: {
      title: 'Tarot Fortune Cards for Love and Relationships',
      subtitle: 'A quick draw can calm the noise and show what matters most.',
      ctaText: 'Draw Love Fortune Cards',
    },
    draw: {
      defaultCount: 3,
      allowedCounts: [1, 3],
      topic: 'love',
      defaultQuestion: 'What should I know about my love life right now?',
    },
    what: {
      title: 'What love fortune cards reveal',
      paragraphs: [
        'When a message does not come, your mind fills the silence. You replay every detail and wonder what it all meant. Love fortune cards help you pause and see the emotional pattern underneath.',
        'These readings focus on clarity, not prediction. The cards reflect your current energy, the dynamic between you and the other person, and what to prioritize next.',
        'You can use one card for a clear theme or three cards for a fuller relationship snapshot.',
      ],
    },
    how: {
      title: 'How to use love fortune cards',
      steps: [
        'Name the feeling you are stuck in, like uncertainty or longing.',
        'Draw 1 card for a single theme or 3 for a relationship arc.',
        'Take one grounded step that supports your emotional balance.',
      ],
    },
    commonQuestions: {
      title: 'Common love questions',
      questions: [
        'Will they reach out or are we drifting?',
        'What is the real issue between us?',
        'How can I communicate more clearly?',
        'What energy should I bring into this relationship?',
        'What do I need to heal before moving forward?',
      ],
    },
    faq: {
      title: 'FAQ',
      items: [
        {
          question: 'Can love tarot fortune cards tell me if they are the one?',
          answer:
            'They do not decide for you. They help you see patterns, needs, and next steps with more honesty.',
        },
        {
          question: 'Should I ask yes or no questions about love?',
          answer:
            'Open questions work better. Ask what you need to understand or how to move with clarity.',
        },
        {
          question: 'Is one card enough for a love question?',
          answer:
            'Yes. One card can give a clear theme. Three cards add emotional context.',
        },
        {
          question: 'Do I need to be in a relationship to use this?',
          answer:
            'No. You can use love fortune cards to explore self love, dating, or future intentions.',
        },
      ],
    },
  },
  {
    slug: 'tarot-fortune-cards-career',
    navLabel: 'Tarot Fortune Cards for Career',
    seo: {
      title: 'Tarot Fortune Cards for Career - Free Reading | Mystic Tarot',
      description:
        'Career crossroads? Draw tarot fortune cards to clarify direction, opportunities, and next steps at work.',
      canonicalUrl: 'https://ai-tarotcard.com/tarot-fortune-cards-career',
    },
    hero: {
      title: 'Tarot Fortune Cards for Career Clarity',
      subtitle: 'Get a focused message for your next work move.',
      ctaText: 'Draw Career Fortune Cards',
    },
    draw: {
      defaultCount: 3,
      allowedCounts: [1, 3],
      topic: 'career',
      defaultQuestion: 'What is the best next step in my career?',
    },
    what: {
      title: 'What career fortune cards help with',
      paragraphs: [
        'Work decisions can feel heavy. You might be unsure about a role, a move, or a risk. Career fortune cards help you slow down and see the signal behind the noise.',
        'This reading highlights direction, timing, and the mindset that will help you make a cleaner decision.',
        'Use one card for a quick focus or three cards for a full career snapshot.',
      ],
    },
    how: {
      title: 'How to use career fortune cards',
      steps: [
        'Frame the decision in one simple sentence.',
        'Draw 1 card for focus or 3 cards for context.',
        'Use the message to choose the next practical step.',
      ],
    },
    commonQuestions: {
      title: 'Common career questions',
      questions: [
        'Should I stay or start looking elsewhere?',
        'What skill should I focus on next?',
        'How can I regain momentum at work?',
        'What is blocking my growth right now?',
        'What kind of opportunity fits me best?',
      ],
    },
    faq: {
      title: 'FAQ',
      items: [
        {
          question: 'Can tarot fortune cards predict my promotion?',
          answer:
            'No. They help you see what to focus on so you can influence the outcome.',
        },
        {
          question: 'Is one card enough for a career decision?',
          answer:
            'One card can highlight a key theme. Three cards help you see risks and direction.',
        },
        {
          question: 'What if I am between two job offers?',
          answer:
            'Draw three cards and use them as a story: past context, present reality, and likely direction.',
        },
      ],
    },
  },
  {
    slug: 'tarot-fortune-cards-yes-no',
    navLabel: 'Tarot Fortune Cards Yes or No',
    seo: {
      title: 'Tarot Fortune Cards Yes or No - Clarity Reading | Mystic Tarot',
      description:
        'Use tarot fortune cards to move past yes or no and find the insight behind your decision.',
      canonicalUrl: 'https://ai-tarotcard.com/tarot-fortune-cards-yes-no',
    },
    hero: {
      title: 'Tarot Fortune Cards Yes or No',
      subtitle: 'Go beyond yes or no and get the insight you actually need.',
      ctaText: 'Draw for Clarity',
    },
    draw: {
      defaultCount: 1,
      allowedCounts: [1, 3],
      topic: 'yes-no',
      defaultQuestion: 'What should I consider before deciding?',
    },
    what: {
      title: 'Why yes or no questions feel hard',
      paragraphs: [
        'You want a clear yes or no, but the situation feels messy. That is normal. Fortune cards help you focus on the real choice underneath the surface.',
        'Instead of forcing a binary answer, the cards show what to watch, what to prepare for, and what matters most.',
        'That is often the clarity you were really looking for.',
      ],
    },
    how: {
      title: 'How to use yes or no style readings',
      steps: [
        'Ask what you need to understand before choosing.',
        'Draw 1 card for a direct signal or 3 for context.',
        'Use the message to decide with more confidence.',
      ],
    },
    commonQuestions: {
      title: 'Common yes or no style questions',
      questions: [
        'Should I say yes to this offer?',
        'Is it time to let this go?',
        'Should I reach out first?',
        'Is this the right time to start?',
        'What would make this decision easier?',
      ],
    },
    faq: {
      title: 'FAQ',
      items: [
        {
          question: 'Do tarot fortune cards give a literal yes or no?',
          answer:
            'Not usually. They point to the conditions and mindset that shape the best answer.',
        },
        {
          question: 'How do I turn a yes or no into a good question?',
          answer:
            'Ask what you should focus on or what needs to be true for success.',
        },
        {
          question: 'Is one card enough for a yes or no question?',
          answer:
            'One card works well. Three cards give extra context and reduce doubt.',
        },
      ],
    },
  },
  {
    slug: '1-card-tarot-fortune',
    navLabel: '1 Card Tarot Fortune',
    seo: {
      title: '1 Card Tarot Fortune - Instant Single Card Reading | Mystic Tarot',
      description:
        'Draw one card for a focused tarot fortune message you can use today.',
      canonicalUrl: 'https://ai-tarotcard.com/1-card-tarot-fortune',
    },
    hero: {
      title: '1 Card Tarot Fortune',
      subtitle: 'One card. One clear theme. Fast guidance.',
      ctaText: 'Draw 1 Card',
    },
    draw: {
      defaultCount: 1,
      allowedCounts: [1, 3],
      topic: 'one-card',
      defaultQuestion: 'What is the key message I need today?',
    },
    what: {
      title: 'Why a single card works',
      paragraphs: [
        'Some days you do not want a long ritual. You want one clean message. A single card fortune reading cuts through the noise and gives you a theme you can hold.',
        'This is ideal for daily guidance, quick check ins, or when you feel overwhelmed.',
        'If you need more depth later, you can expand to three cards.',
      ],
    },
    how: {
      title: 'How to use a 1 card fortune draw',
      steps: [
        'Set a short, open question about your day.',
        'Draw 1 card and read the core meaning.',
        'Choose one action that aligns with the message.',
      ],
    },
    commonQuestions: {
      title: 'Common one card prompts',
      questions: [
        'What should I focus on today?',
        'What energy do I need to embody?',
        'What is the main theme around me?',
        'What is the smartest next step?',
        'What should I stop ignoring?',
      ],
    },
    faq: {
      title: 'FAQ',
      items: [
        {
          question: 'Is one card tarot accurate?',
          answer:
            'It is accurate for focus and reflection. The clarity comes from a good question.',
        },
        {
          question: 'Can I draw three cards instead?',
          answer:
            'Yes. Use three cards if you want context and direction.',
        },
        {
          question: 'How often should I draw one card?',
          answer:
            'Daily or weekly both work. Consistency matters more than frequency.',
        },
      ],
    },
  },
  {
    slug: '3-card-tarot-fortune',
    navLabel: '3 Card Tarot Fortune',
    seo: {
      title: '3 Card Tarot Fortune - Past Present Future | Mystic Tarot',
      description:
        'Draw three cards for a full fortune timeline: past, present, and future.',
      canonicalUrl: 'https://ai-tarotcard.com/3-card-tarot-fortune',
    },
    hero: {
      title: '3 Card Tarot Fortune Reading',
      subtitle: 'Past, present, future. A simple story for real clarity.',
      ctaText: 'Draw 3 Cards',
    },
    draw: {
      defaultCount: 3,
      allowedCounts: [1, 3],
      topic: 'three-card',
      defaultQuestion: 'What is the bigger story in this situation?',
    },
    what: {
      title: 'Why three cards give depth',
      paragraphs: [
        'Sometimes one card feels too small. You want context and movement. A three card fortune reading shows where you were, where you are, and where you might be headed.',
        'This format is quick, but it still tells a complete story.',
        'It works well for decisions, relationships, and longer term plans.',
      ],
    },
    how: {
      title: 'How to use a 3 card fortune spread',
      steps: [
        'Ask a question that needs context, not just a headline.',
        'Draw 3 cards and read them as a timeline.',
        'Use the last card as a guide for your next step.',
      ],
    },
    commonQuestions: {
      title: 'Common three card prompts',
      questions: [
        'What brought me here and what comes next?',
        'What is the real challenge and how do I move through it?',
        'What should I keep and what should I change?',
        'What does this situation lead to?',
        'What pattern is repeating?',
      ],
    },
    faq: {
      title: 'FAQ',
      items: [
        {
          question: 'Do the three cards always mean past, present, future?',
          answer:
            'That is the classic layout, but you can set any three positions you want.',
        },
        {
          question: 'Is three cards too much for a quick reading?',
          answer:
            'Not at all. It is still fast, but it gives richer context.',
        },
        {
          question: 'Can I draw one card instead?',
          answer:
            'Yes. One card is great when you only need a single theme.',
        },
      ],
    },
  },
  {
    slug: 'tarot-fortune-cards-meaning',
    navLabel: 'Tarot Fortune Cards Meaning',
    seo: {
      title: 'Tarot Fortune Cards Meaning - Upright and Reversed | Mystic Tarot',
      description:
        'Understand tarot fortune card meanings with simple, practical explanations and a quick draw.',
      canonicalUrl: 'https://ai-tarotcard.com/tarot-fortune-cards-meaning',
    },
    hero: {
      title: 'Tarot Fortune Cards Meaning Made Simple',
      subtitle: 'Learn the message behind the symbols in plain language.',
      ctaText: 'Draw and Learn Meanings',
    },
    draw: {
      defaultCount: 3,
      allowedCounts: [1, 3],
      topic: 'meaning',
      defaultQuestion: 'What does this card mean for me right now?',
    },
    what: {
      title: 'How to understand fortune card meanings',
      paragraphs: [
        'It is easy to feel lost when a card feels mysterious. You want to know what it means for your life, not just its textbook definition.',
        'Fortune card meanings are practical. Each card points to a mindset, a pattern, or a decision you can act on.',
        'Upright cards show the clear expression of a theme. Reversed cards point to blocks, delays, or internal work.',
      ],
    },
    how: {
      title: 'How to read card meanings quickly',
      steps: [
        'Notice the first symbol that stands out to you.',
        'Read the upright or reversed meaning as a theme.',
        'Connect that theme to your current situation.',
      ],
    },
    commonQuestions: {
      title: 'Common meaning questions',
      questions: [
        'What does this card mean in plain language?',
        'How does a reversed card change the message?',
        'Is the card a warning or an opportunity?',
        'What should I do with this meaning today?',
        'How do I apply the message to love or career?',
      ],
    },
    faq: {
      title: 'FAQ',
      items: [
        {
          question: 'Do reversed cards always mean something negative?',
          answer:
            'No. Reversals often point to inner work, delays, or a softer expression of the theme.',
        },
        {
          question: 'Should I memorize every card meaning?',
          answer:
            'You do not have to. Start with key themes and let experience build your understanding.',
        },
        {
          question: 'How do I make the meaning feel personal?',
          answer:
            'Connect the theme to a real decision or emotion you are facing right now.',
        },
      ],
    },
  },
];

export const FORTUNE_CLUSTER_SLUGS = FORTUNE_CLUSTER_PAGES.map((page) => page.slug);

export const getFortuneClusterPage = (slug: string): FortuneClusterPageConfig | null =>
  FORTUNE_CLUSTER_PAGES.find((page) => page.slug === slug) || null;

export const isFortuneClusterSlug = (slug: string): boolean =>
  FORTUNE_CLUSTER_SLUGS.includes(slug);
