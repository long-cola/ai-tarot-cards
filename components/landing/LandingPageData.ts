import { Language } from '../../types';

export interface LandingPageContent {
  slug: string;
  seo: {
    title: string;
    description: string;
    canonicalUrl: string;
  };
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    prefillQuestion: string;
  };
  intro?: {
    content: string;
  };
  problem: {
    title: string;
    paragraphs: string[];
  };
  commonSituations: {
    title: string;
    situations: string[];
  };
  aiExplanation: {
    title: string;
    content: string;
    points: string[];
  };
  tarotEntry: {
    title: string;
    ctaText: string;
  };
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export const LANDING_PAGE_SLUGS = [
  'will-he-contact-me-tarot',
  'love-tarot-reading',
  'should-i-leave-my-job-tarot',
  'career-tarot-reading',
  'daily-tarot-guidance'
] as const;

export type LandingPageSlug = typeof LANDING_PAGE_SLUGS[number];

const LANDING_PAGES: Record<LandingPageSlug, { en: LandingPageContent; zh: LandingPageContent }> = {
  'will-he-contact-me-tarot': {
    en: {
      slug: 'will-he-contact-me-tarot',
      seo: {
        title: 'Will He Contact Me? Free AI Tarot Reading for Clarity',
        description: 'Wondering if he will reach out again? This free AI tarot reading helps you reflect on emotions, timing, and next steps — no predictions, just insight.',
        canonicalUrl: 'https://ai-tarotcard.com/will-he-contact-me-tarot',
      },
      hero: {
        title: 'Will He Contact Me?',
        subtitle: 'The silence is deafening. You keep checking your phone, wondering if he will reach out. Let the ancient wisdom of tarot illuminate your path forward.',
        ctaText: 'Get My Free Reading',
        prefillQuestion: 'Will he contact me?',
      },
      intro: {
        content: 'When communication stops, it\'s natural to wonder whether he will ever reach out again. This question often comes with confusion, hope, and anxiety. This AI tarot reading is designed to help you reflect on emotional dynamics, timing, and possible next steps — not to predict the future, but to offer perspective when your thoughts feel stuck.',
      },
      problem: {
        title: 'Why This Question Haunts Us',
        paragraphs: [
          'Waiting for someone to reach out can be one of the most anxiety-inducing experiences in relationships. Every notification makes your heart race, every passing day adds to the uncertainty.',
          'You might be replaying your last conversation, wondering if you said something wrong, or if he is just busy with life. The not-knowing can be worse than any answer.',
          'This is exactly where tarot shines — not as a fortune-telling device, but as a mirror for your own intuition and a guide for understanding the energies at play.',
        ],
      },
      commonSituations: {
        title: 'Common Situations People Ask About',
        situations: [
          '"I miss him so much today, and I couldn\'t stop thinking about whether he would text me."',
          '"We stopped talking after an argument, and I don\'t know if he\'s thinking about me."',
          '"I sent the last message, and now there\'s silence."',
          '"We broke up, but nothing was clearly resolved."',
          '"He said he needed space — will he come back?"',
          '"We had a great date but he went silent afterward."',
        ],
      },
      aiExplanation: {
        title: 'How This AI Tarot Reading Helps',
        content: 'This reading is not about predicting the future. It helps you:',
        points: [
          'Reflect on emotional distance and connection',
          'Encourage clarity instead of impulsive actions',
          'Offer perspective when waiting feels overwhelming',
          'Understand your own feelings and desires',
        ],
      },
      tarotEntry: {
        title: 'Ready for Clarity?',
        ctaText: 'Start Your Free Reading Now',
      },
      faqs: [
        {
          question: 'Is this tarot reading free?',
          answer: 'Yes. This AI tarot reading is free and designed for personal reflection. No credit card required.',
        },
        {
          question: 'Does this reading predict the future?',
          answer: 'No. It offers emotional insight and perspective, not fixed predictions. Tarot helps you think clearly about your situation rather than telling you what will happen.',
        },
        {
          question: 'How accurate is an AI tarot reading?',
          answer: 'Accuracy depends on reflection and interpretation. This tool helps you think clearly rather than give absolute answers. It combines traditional tarot symbolism with AI analysis to provide meaningful insights.',
        },
      ],
    },
    zh: {
      slug: 'will-he-contact-me-tarot',
      seo: {
        title: '他会联系我吗？免费AI塔罗占卜获得清晰答案',
        description: '想知道他是否会主动联系？这个免费AI塔罗占卜帮助你反思情感、时机和下一步——不是预测，而是洞察。',
        canonicalUrl: 'https://ai-tarotcard.com/zh/will-he-contact-me-tarot',
      },
      hero: {
        title: '他会联系我吗？',
        subtitle: '等待的焦虑令人窒息。你不断查看手机，想知道他是否会主动联系。让塔罗的古老智慧为你指引方向。',
        ctaText: '开始免费占卜',
        prefillQuestion: '他会联系我吗？',
      },
      intro: {
        content: '当沟通停止时，想知道他是否会再次联系是很自然的。这个问题往往伴随着困惑、希望和焦虑。这个AI塔罗占卜旨在帮助你反思情感动态、时机和可能的下一步——不是预测未来，而是在你的思绪陷入困境时提供视角。',
      },
      problem: {
        title: '为什么这个问题困扰着我们',
        paragraphs: [
          '等待某人主动联系可能是感情中最令人焦虑的经历之一。每一条消息通知都让你心跳加速，每过一天都增添更多的不确定性。',
          '你可能在反复回想最后一次对话，想知道自己是不是说错了什么，或者他只是忙于生活。不知道答案有时比任何答案都更难受。',
          '这正是塔罗牌能够帮助你的地方——不是作为预测未来的工具，而是作为你内心直觉的镜子，帮助你理解当前的能量走向。',
        ],
      },
      commonSituations: {
        title: '常见情况',
        situations: [
          '"我今天太想他了，忍不住想他会不会给我发消息。"',
          '"我们吵架后就不说话了，我不知道他是否还在想我。"',
          '"我发了最后一条消息，现在一片沉默。"',
          '"我们分手了，但什么都没有明确解决。"',
          '"他说需要空间——他会回来吗？"',
          '"我们约会很愉快但之后他就沉默了。"',
        ],
      },
      aiExplanation: {
        title: 'AI塔罗占卜如何帮助你',
        content: '这个占卜不是预测未来。它帮助你：',
        points: [
          '反思情感距离和连接',
          '鼓励清晰思考而非冲动行动',
          '在等待令人不堪重负时提供视角',
          '理解你自己的感受和渴望',
        ],
      },
      tarotEntry: {
        title: '准备好获得清晰的答案了吗？',
        ctaText: '开始免费占卜',
      },
      faqs: [
        {
          question: '这个塔罗占卜是免费的吗？',
          answer: '是的。这个AI塔罗占卜是免费的，专为个人反思设计。无需信用卡。',
        },
        {
          question: '这个占卜会预测未来吗？',
          answer: '不会。它提供情感洞察和视角，而不是固定的预测。塔罗帮助你清晰地思考你的处境，而不是告诉你会发生什么。',
        },
        {
          question: 'AI塔罗占卜准确吗？',
          answer: '准确性取决于反思和解读。这个工具帮助你清晰思考，而不是给出绝对答案。它结合传统塔罗象征意义和AI分析，提供有意义的洞察。',
        },
      ],
    },
  },
  'love-tarot-reading': {
    en: {
      slug: 'love-tarot-reading',
      seo: {
        title: 'Free Love Tarot Reading - Is This Relationship Right for Me?',
        description: 'Confused about your love life? Get a free AI tarot reading to explore your emotions, relationship patterns, and what your heart truly needs.',
        canonicalUrl: 'https://ai-tarotcard.com/love-tarot-reading',
      },
      hero: {
        title: 'Love Tarot Reading',
        subtitle: 'Your heart has questions. Whether you are single, dating, or in a relationship, the cards can offer perspective on matters of the heart.',
        ctaText: 'Get Your Love Reading',
        prefillQuestion: 'What does my love life look like?',
      },
      problem: {
        title: 'Love Is Never Simple',
        paragraphs: [
          'Relationships are complex tapestries of emotions, expectations, and experiences. Sometimes we need an outside perspective to see clearly what our hearts already know.',
          'Whether you are wondering about a new connection, questioning an existing relationship, or seeking to understand your own patterns in love, the cards can illuminate paths you might not have considered.',
          'Love tarot is not about finding "the one" — it is about finding yourself within the context of love and connection.',
        ],
      },
      commonSituations: {
        title: 'Common Love Questions',
        situations: [
          'Is this relationship going anywhere or am I wasting my time?',
          'I have feelings for someone — should I tell them?',
          'We keep having the same arguments — what\'s really going on?',
          'I\'m torn between two people and don\'t know who to choose',
          'Is my partner being honest with me about their feelings?',
          'I\'m single and wondering when love will come into my life',
        ],
      },
      aiExplanation: {
        title: 'How AI Tarot Helps Your Love Life',
        content: 'This reading is designed for reflection, not prediction. Our AI combines tarot wisdom with psychological insight to explore:',
        points: [
          'Your current emotional state',
          'Patterns in how you love and receive love',
          'Influences affecting your romantic life',
          'Opportunities for growth and connection',
        ],
      },
      tarotEntry: {
        title: 'Explore Your Heart',
        ctaText: 'Start Your Free Love Reading',
      },
      faqs: [
        {
          question: 'Will this reading tell me who my soulmate is?',
          answer: 'Tarot does not predict specific people or events. Instead, it helps you understand yourself better, recognize patterns, and make more conscious choices in love.',
        },
        {
          question: 'Is this suitable for all relationship types?',
          answer: 'Absolutely. Our love tarot reading is designed to be inclusive and helpful for anyone seeking clarity about romantic connections, regardless of relationship status or orientation.',
        },
        {
          question: 'How often should I do a love reading?',
          answer: 'We recommend spacing readings at least a few days apart to allow time for reflection and action. Daily readings on the same question can lead to confusion rather than clarity.',
        },
      ],
    },
    zh: {
      slug: 'love-tarot-reading',
      seo: {
        title: '免费爱情塔罗占卜 - 这段感情适合我吗？',
        description: '对爱情感到困惑？获取免费AI塔罗解读，探索你的情感、关系模式，以及你的心真正需要什么。',
        canonicalUrl: 'https://ai-tarotcard.com/zh/love-tarot-reading',
      },
      hero: {
        title: '爱情塔罗占卜',
        subtitle: '你的心有很多疑问。无论你是单身、约会中还是恋爱中，塔罗牌都能为你的感情生活提供视角。',
        ctaText: '获取爱情占卜',
        prefillQuestion: '我的爱情生活会怎样？',
      },
      problem: {
        title: '爱情从来都不简单',
        paragraphs: [
          '感情是由情绪、期望和经历编织成的复杂织锦。有时我们需要一个外部视角，才能清晰地看到我们的心早已知道的事情。',
          '无论你是在思考一段新的感情、质疑现有的关系，还是想要理解自己在爱情中的模式，塔罗牌都能照亮你可能没有考虑过的道路。',
          '爱情塔罗不是关于找到"那个人"——而是关于在爱与连接的背景下发现自己。',
        ],
      },
      commonSituations: {
        title: '常见爱情问题',
        situations: [
          '这段关系有未来吗，还是我在浪费时间？',
          '我对某人有感觉——我该告诉他们吗？',
          '我们总是为同样的事情争吵——到底是怎么回事？',
          '我在两个人之间犹豫不决，不知道该选谁',
          '我的伴侣对我的感情是真诚的吗？',
          '我单身，想知道爱情什么时候会来到我的生活',
        ],
      },
      aiExplanation: {
        title: 'AI塔罗如何帮助你的感情生活',
        content: '这个占卜旨在帮助你反思，而非预测。我们的AI结合塔罗智慧和心理洞察来探索：',
        points: [
          '你当前的情感状态',
          '你爱人和接受爱的方式',
          '影响你浪漫生活的因素',
          '成长和建立连接的机会',
        ],
      },
      tarotEntry: {
        title: '探索你的内心',
        ctaText: '开始免费爱情占卜',
      },
      faqs: [
        {
          question: '这个占卜能告诉我谁是我的灵魂伴侣吗？',
          answer: '塔罗不会预测具体的人或事件。它帮助你更好地了解自己，识别模式，并在爱情中做出更有意识的选择。',
        },
        {
          question: '这适合所有类型的感情关系吗？',
          answer: '当然。我们的爱情塔罗占卜设计为包容性的，适合任何寻求浪漫关系清晰度的人，无论感情状态或取向如何。',
        },
        {
          question: '我应该多久做一次爱情占卜？',
          answer: '我们建议两次占卜之间至少间隔几天，以便有时间进行反思和行动。每天对同一个问题进行占卜可能会导致困惑而不是清晰。',
        },
      ],
    },
  },
  'should-i-leave-my-job-tarot': {
    en: {
      slug: 'should-i-leave-my-job-tarot',
      seo: {
        title: 'Should I Leave My Job? Free Tarot Reading for Career Clarity',
        description: 'Stuck at a career crossroads? This free AI tarot reading helps you explore hidden factors, reduce fear, and find clarity about staying or leaving your job.',
        canonicalUrl: 'https://ai-tarotcard.com/should-i-leave-my-job-tarot',
      },
      hero: {
        title: 'Should I Leave My Job?',
        subtitle: 'Career crossroads can feel paralyzing. When logic alone cannot guide you, sometimes you need to tap into deeper wisdom.',
        ctaText: 'Get Career Clarity',
        prefillQuestion: 'Should I leave my current job?',
      },
      problem: {
        title: 'The Weight of Career Decisions',
        paragraphs: [
          'Deciding whether to leave a job is rarely just about the job itself. It touches on identity, security, relationships, and dreams. The stakes feel impossibly high.',
          'You may have a list of pros and cons that seems perfectly balanced. Or perhaps your gut is screaming one thing while logic suggests another. This internal conflict is exhausting.',
          'Sometimes what we need is not more analysis, but a different lens through which to view our situation — a way to access wisdom that goes beyond spreadsheets and salary comparisons.',
        ],
      },
      commonSituations: {
        title: 'Common Situations People Face',
        situations: [
          'I feel burned out but I\'m afraid to leave without another job lined up',
          'My boss is toxic but the pay is good — should I stay?',
          'I have a job offer but I\'m scared to make the wrong choice',
          'I\'ve been here for years but I feel stuck and unfulfilled',
          'The work environment is affecting my mental health',
          'I want to change careers but I\'m worried about starting over',
        ],
      },
      aiExplanation: {
        title: 'How AI Tarot Helps Career Decisions',
        content: 'This reading will not tell you to quit or stay. Instead, it illuminates aspects of your situation you might be overlooking:',
        points: [
          'Hidden factors influencing your dissatisfaction or satisfaction',
          'The energy you are bringing to your work',
          'Potential outcomes of different paths',
          'What your intuition might be trying to tell you',
        ],
      },
      tarotEntry: {
        title: 'Find Your Answer',
        ctaText: 'Start Your Career Reading',
      },
      faqs: [
        {
          question: 'Will the tarot tell me to quit my job?',
          answer: 'No. Tarot does not make decisions for you. It offers perspectives and highlights aspects of your situation that can inform your own decision-making process.',
        },
        {
          question: 'I am scared to make the wrong choice. Can tarot help?',
          answer: 'The fear of making wrong choices is universal. Tarot can help by reducing the emotional noise around your decision and helping you see your situation more clearly. Clarity often reduces fear.',
        },
        {
          question: 'What if the reading contradicts what I want?',
          answer: 'Sometimes resistance to a reading reveals what we truly want. If a card suggesting change makes you feel relieved, or one suggesting stability makes you frustrated, pay attention to those reactions.',
        },
      ],
    },
    zh: {
      slug: 'should-i-leave-my-job-tarot',
      seo: {
        title: '我该辞职吗？免费塔罗占卜帮你找到职业答案',
        description: '在职业十字路口犹豫不决？这个免费AI塔罗占卜帮助你探索隐藏因素、减少恐惧，找到关于去留的清晰答案。',
        canonicalUrl: 'https://ai-tarotcard.com/zh/should-i-leave-my-job-tarot',
      },
      hero: {
        title: '我该辞职吗？',
        subtitle: '职业的十字路口可能让人感到无所适从。当仅凭逻辑无法指引你时，也许你需要触及更深层的智慧。',
        ctaText: '获取职业洞察',
        prefillQuestion: '我该离开现在的工作吗？',
      },
      problem: {
        title: '职业决策的重压',
        paragraphs: [
          '决定是否离职很少只是关于工作本身。它涉及身份认同、安全感、人际关系和梦想。利害关系似乎不可估量。',
          '你可能有一张看起来完美平衡的利弊清单。或者也许你的直觉在大声告诉你一件事，而逻辑却暗示另一件事。这种内心冲突令人疲惫。',
          '有时候我们需要的不是更多的分析，而是用不同的视角来看待我们的处境——一种超越电子表格和薪资比较的智慧。',
        ],
      },
      commonSituations: {
        title: '常见情况',
        situations: [
          '我感到精疲力竭，但害怕在没有下家的情况下离职',
          '我的老板很糟糕，但薪水不错——我该留下吗？',
          '我有一个工作机会，但害怕做出错误的选择',
          '我在这里工作多年，但感觉停滞不前、没有成就感',
          '工作环境正在影响我的心理健康',
          '我想转行，但担心从头开始',
        ],
      },
      aiExplanation: {
        title: 'AI塔罗如何帮助职业决策',
        content: '这个占卜不会告诉你辞职还是留下。它会照亮你可能忽视的方面：',
        points: [
          '影响你不满或满足感的隐藏因素',
          '你带入工作中的能量',
          '不同道路的可能结果',
          '你的直觉可能想告诉你什么',
        ],
      },
      tarotEntry: {
        title: '找到你的答案',
        ctaText: '开始职业占卜',
      },
      faqs: [
        {
          question: '塔罗会告诉我辞职吗？',
          answer: '不会。塔罗不会替你做决定。它提供视角，突出你处境中可以帮助你自己做出决定的方面。',
        },
        {
          question: '我害怕做出错误的选择，塔罗能帮助我吗？',
          answer: '害怕做出错误选择是人之常情。塔罗可以帮助减少决策周围的情绪噪音，帮助你更清晰地看待你的处境。清晰往往能减少恐惧。',
        },
        {
          question: '如果占卜结果与我想要的矛盾怎么办？',
          answer: '有时对占卜结果的抗拒会揭示我们真正想要的。如果暗示改变的牌让你感到如释重负，或者暗示稳定的牌让你感到沮丧，请注意这些反应。',
        },
      ],
    },
  },
  'career-tarot-reading': {
    en: {
      slug: 'career-tarot-reading',
      seo: {
        title: 'Career Tarot Reading - Am I on the Right Professional Path?',
        description: 'Feeling stuck or unfulfilled at work? This free AI career tarot reading helps you understand your professional energy, hidden opportunities, and next steps.',
        canonicalUrl: 'https://ai-tarotcard.com/career-tarot-reading',
      },
      hero: {
        title: 'Career Tarot Reading',
        subtitle: 'Your professional journey is more than a resume. Discover insights about your work life, ambitions, and the path that aligns with your true self.',
        ctaText: 'Explore Your Career Path',
        prefillQuestion: 'What guidance do you have for my career?',
      },
      problem: {
        title: 'Work Is Where We Spend Our Lives',
        paragraphs: [
          'We spend roughly a third of our lives working. Yet many of us feel disconnected from our professional path, unsure if we are heading in the right direction.',
          'Career questions go beyond salary and titles. They touch on purpose, fulfillment, and how we want to contribute to the world. These are not questions a career counselor can easily answer.',
          'Sometimes we need a tool that speaks to both our practical concerns and our deeper aspirations — one that honors the full complexity of who we are.',
        ],
      },
      commonSituations: {
        title: 'Common Career Questions',
        situations: [
          'I feel stuck in my career and don\'t know how to move forward',
          'Should I pursue this promotion or stay where I am?',
          'I\'m considering a career change but don\'t know if it\'s the right time',
          'How can I improve my relationship with my colleagues or boss?',
          'I\'m passionate about something but it doesn\'t pay well',
          'What skills should I focus on developing for my future?',
        ],
      },
      aiExplanation: {
        title: 'How AI Tarot Illuminates Your Career',
        content: 'Career tarot helps you step back and see your professional life from a new angle. Our AI analysis explores:',
        points: [
          'Your current professional energy and mindset',
          'Challenges and obstacles in your path',
          'Hidden opportunities you might be missing',
          'How your values align with your work',
        ],
      },
      tarotEntry: {
        title: 'Chart Your Course',
        ctaText: 'Start Your Free Career Reading',
      },
      faqs: [
        {
          question: 'Can tarot predict my career success?',
          answer: 'Tarot does not predict specific outcomes like promotions or job offers. It helps you understand your current situation, recognize patterns, and make more aligned career choices.',
        },
        {
          question: 'Is career tarot only for people unhappy at work?',
          answer: 'Not at all. Career tarot is valuable whether you love your job, hate it, or feel somewhere in between. It can help with advancement, transitions, or simply gaining perspective.',
        },
        {
          question: 'How is this different from career coaching?',
          answer: 'While career coaching focuses on practical strategies and goal-setting, tarot offers a more intuitive, reflective approach. Many people find value in using both — tarot for insight, coaching for action.',
        },
      ],
    },
    zh: {
      slug: 'career-tarot-reading',
      seo: {
        title: '事业塔罗占卜 - 我的职业道路对吗？',
        description: '工作中感到停滞或不满足？这个免费AI事业塔罗占卜帮助你理解职业能量、隐藏机会和下一步行动。',
        canonicalUrl: 'https://ai-tarotcard.com/zh/career-tarot-reading',
      },
      hero: {
        title: '事业塔罗占卜',
        subtitle: '你的职业旅程不仅仅是一份简历。发现关于你工作生活、抱负以及与真实自我相符道路的洞察。',
        ctaText: '探索职业道路',
        prefillQuestion: '关于我的事业有什么指引？',
      },
      problem: {
        title: '工作是我们生命的重要组成',
        paragraphs: [
          '我们大约三分之一的人生都在工作。然而，许多人感觉与自己的职业道路脱节，不确定是否朝着正确的方向前进。',
          '职业问题超越了薪水和头衔。它们涉及目标、成就感以及我们想如何为这个世界做出贡献。这些不是职业顾问能轻易回答的问题。',
          '有时我们需要一个工具，既能回应我们的实际关切，又能触及我们更深层的渴望——一个尊重我们完整复杂性的工具。',
        ],
      },
      commonSituations: {
        title: '常见职业问题',
        situations: [
          '我感觉职业生涯停滞不前，不知道如何前进',
          '我该争取这次晋升还是留在现在的位置？',
          '我在考虑转行，但不知道现在是不是合适的时机',
          '如何改善我与同事或老板的关系？',
          '我对某件事充满热情，但它收入不高',
          '我应该专注于发展哪些技能来规划未来？',
        ],
      },
      aiExplanation: {
        title: 'AI塔罗如何照亮你的事业',
        content: '事业塔罗帮助你退后一步，从新的角度看待你的职业生活。我们的AI分析探索：',
        points: [
          '你当前的职业能量和心态',
          '你道路上的挑战和障碍',
          '你可能错过的隐藏机会',
          '你的价值观与工作的契合度',
        ],
      },
      tarotEntry: {
        title: '规划你的航程',
        ctaText: '开始免费事业占卜',
      },
      faqs: [
        {
          question: '塔罗能预测我的事业成功吗？',
          answer: '塔罗不会预测具体的结果，如升职或工作机会。它帮助你理解当前的处境，识别模式，并做出更符合自己的职业选择。',
        },
        {
          question: '事业塔罗只适合对工作不满意的人吗？',
          answer: '完全不是。无论你热爱你的工作、讨厌它，还是介于两者之间，事业塔罗都很有价值。它可以帮助你晋升、转型，或只是获得洞察。',
        },
        {
          question: '这和职业咨询有什么不同？',
          answer: '职业咨询侧重于实际策略和目标设定，而塔罗提供更直觉、反思性的方法。许多人发现两者结合使用很有价值——塔罗提供洞察，咨询提供行动。',
        },
      ],
    },
  },
  'daily-tarot-guidance': {
    en: {
      slug: 'daily-tarot-guidance',
      seo: {
        title: 'Daily Tarot Guidance - What Should I Focus on Today?',
        description: 'Start your day with intention. Get a free daily tarot card reading to set your focus, build mindfulness, and navigate life with clarity.',
        canonicalUrl: 'https://ai-tarotcard.com/daily-tarot-guidance',
      },
      hero: {
        title: 'Daily Tarot Guidance',
        subtitle: 'Start your day with intention. A single card can set the tone, offer perspective, and help you navigate whatever comes your way.',
        ctaText: 'Get Today\'s Guidance',
        prefillQuestion: 'What should I focus on today?',
      },
      problem: {
        title: 'Every Day Is A Fresh Start',
        paragraphs: [
          'In the rush of daily life, it is easy to move on autopilot — reacting to events rather than consciously choosing how we want to engage with our day.',
          'A daily tarot practice is not about predicting what will happen. It is about pausing, reflecting, and setting an intention before the chaos begins.',
          'Even a few minutes of contemplation can shift your entire day from reactive to purposeful, from scattered to centered.',
        ],
      },
      commonSituations: {
        title: 'When to Use Daily Guidance',
        situations: [
          'I want to start my day with intention and clarity',
          'I\'m feeling anxious and need grounding before a big day',
          'I want to understand the energy around me today',
          'I need help focusing on what really matters',
          'I\'m going through a transition and want daily support',
          'I want to build a mindfulness practice that resonates with me',
        ],
      },
      aiExplanation: {
        title: 'How Daily Tarot Transforms Your Routine',
        content: 'A daily card is not a fortune — it is a focus. Our AI interpretation helps you:',
        points: [
          'Set a meaningful intention for the day',
          'Notice themes and patterns in your life',
          'Build self-awareness through regular reflection',
          'Create space for mindfulness in your morning',
        ],
      },
      tarotEntry: {
        title: 'Begin With Intention',
        ctaText: 'Draw Your Daily Card',
      },
      faqs: [
        {
          question: 'Should I draw a daily card every single day?',
          answer: 'There is no strict rule. Some people draw daily, others weekly. The key is consistency — whatever rhythm works for you. Even a few times a week can build meaningful self-awareness.',
        },
        {
          question: 'What if I get a "bad" card?',
          answer: 'There are no bad cards in tarot, only challenging ones. Cards like Death or The Tower often represent necessary change or breakthroughs. Our AI helps you see the growth opportunity in every card.',
        },
        {
          question: 'When is the best time to draw my daily card?',
          answer: 'Morning is ideal for most people — it sets the tone for the day. However, some prefer evening draws to reflect on the day past. Find what works for your schedule and stick with it.',
        },
      ],
    },
    zh: {
      slug: 'daily-tarot-guidance',
      seo: {
        title: '每日塔罗指引 - 今天我应该关注什么？',
        description: '带着意图开始新的一天。获取免费每日塔罗牌解读，设定专注点，建立正念，清晰地应对生活。',
        canonicalUrl: 'https://ai-tarotcard.com/zh/daily-tarot-guidance',
      },
      hero: {
        title: '每日塔罗指引',
        subtitle: '带着意图开始新的一天。一张牌可以设定基调，提供视角，帮助你应对一天中的任何事情。',
        ctaText: '获取今日指引',
        prefillQuestion: '今天我应该关注什么？',
      },
      problem: {
        title: '每一天都是新的开始',
        paragraphs: [
          '在日常生活的忙碌中，我们很容易进入自动驾驶模式——对事件做出反应，而不是有意识地选择如何参与我们的一天。',
          '每日塔罗练习不是关于预测会发生什么。而是关于在混乱开始之前暂停、反思和设定意图。',
          '即使只是几分钟的沉思，也能让你的整天从被动变为主动，从散乱变为专注。',
        ],
      },
      commonSituations: {
        title: '何时使用每日指引',
        situations: [
          '我想带着意图和清晰开始新的一天',
          '我感到焦虑，在重要的一天之前需要稳定情绪',
          '我想了解今天周围的能量',
          '我需要帮助专注于真正重要的事情',
          '我正在经历转变，想要每日的支持',
          '我想建立一个与我产生共鸣的正念练习',
        ],
      },
      aiExplanation: {
        title: '每日塔罗如何改变你的日常',
        content: '每日抽牌不是算命——而是聚焦。我们的AI解读帮助你：',
        points: [
          '为一天设定有意义的意图',
          '注意生活中的主题和模式',
          '通过定期反思建立自我意识',
          '在早晨为正念创造空间',
        ],
      },
      tarotEntry: {
        title: '带着意图开始',
        ctaText: '抽取今日塔罗牌',
      },
      faqs: [
        {
          question: '我应该每天都抽一张牌吗？',
          answer: '没有严格的规则。有些人每天抽，有些人每周抽。关键是保持一致——找到适合你的节奏。即使一周几次也能建立有意义的自我意识。',
        },
        {
          question: '如果我抽到一张"不好"的牌怎么办？',
          answer: '塔罗中没有坏牌，只有具有挑战性的牌。像死神或塔这样的牌通常代表必要的改变或突破。我们的AI帮助你看到每张牌中的成长机会。',
        },
        {
          question: '什么时候是抽取每日牌的最佳时间？',
          answer: '对大多数人来说，早晨是理想的时间——它为一天定下基调。然而，有些人更喜欢在晚上抽牌来反思过去的一天。找到适合你日程的方式并坚持下去。',
        },
      ],
    },
  },
};

export function getLandingPageData(slug: string, language: Language): LandingPageContent | null {
  const pageData = LANDING_PAGES[slug as LandingPageSlug];
  if (!pageData) return null;
  return pageData[language];
}

export function getAllLandingSlugs(): string[] {
  return [...LANDING_PAGE_SLUGS];
}

export function isLandingPageSlug(slug: string): slug is LandingPageSlug {
  return LANDING_PAGE_SLUGS.includes(slug as LandingPageSlug);
}
