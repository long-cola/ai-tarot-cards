import { TarotCardData } from './types.js';

export const MAJOR_ARCANA: TarotCardData[] = [
  { id: 0, name: "The Fool", nameCn: "愚人", meaningUpright: "新的开始，天真，自发性", meaningReversed: "鲁莽，冒险，甚至愚蠢", meaningUprightEn: "beginnings, trust, spontaneity", meaningReversedEn: "recklessness, naivete, poor planning", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg" },
  { id: 1, name: "The Magician", nameCn: "魔术师", meaningUpright: "创造力，资源，力量，显化", meaningReversed: "操纵，计划不周，潜能未发", meaningUprightEn: "manifestation, skill, resourcefulness", meaningReversedEn: "manipulation, shortcuts, unused potential", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg" },
  { id: 2, name: "The High Priestess", nameCn: "女祭司", meaningUpright: "直觉，神秘知识，神圣女性", meaningReversed: "秘密，与直觉断联，压抑", meaningUprightEn: "intuition, inner wisdom, mystery", meaningReversedEn: "secrets, blocked intuition, suppression", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg" },
  { id: 3, name: "The Empress", nameCn: "皇后", meaningUpright: "女性力量，美丽，自然，滋养", meaningReversed: "创造力受阻，依赖他人", meaningUprightEn: "nurture, abundance, creativity", meaningReversedEn: "blocked growth, dependence, neglect", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg" },
  { id: 4, name: "The Emperor", nameCn: "皇帝", meaningUpright: "权威，建立，结构，父亲形象", meaningReversed: "支配，过度控制，僵化", meaningUprightEn: "structure, authority, stability", meaningReversedEn: "rigidity, control, domination", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg" },
  { id: 5, name: "The Hierophant", nameCn: "教皇", meaningUpright: "精神智慧，信仰，传统", meaningReversed: "个人信仰，自由，挑战现状", meaningUprightEn: "tradition, guidance, shared values", meaningReversedEn: "rebellion, blind faith, outdated rules", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg" },
  { id: 6, name: "The Lovers", nameCn: "恋人", meaningUpright: "爱，和谐，关系，价值观一致", meaningReversed: "不和谐，失衡，自我中心", meaningUprightEn: "love, alignment, choice", meaningReversedEn: "disharmony, imbalance, misalignment", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3a/RWS_Tarot_06_Lovers.jpg" },
  { id: 7, name: "The Chariot", nameCn: "战车", meaningUpright: "控制，意志力，成功，行动", meaningReversed: "缺乏方向，由于，失控", meaningUprightEn: "willpower, victory, momentum", meaningReversedEn: "loss of control, scattered direction", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg" },
  { id: 8, name: "Strength", nameCn: "力量", meaningUpright: "力量，勇气，说服力，影响力", meaningReversed: "自我怀疑，低能量，内心软弱", meaningUprightEn: "courage, compassion, inner power", meaningReversedEn: "self-doubt, weakness, insecurity", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg" },
  { id: 9, name: "The Hermit", nameCn: "隐士", meaningUpright: "内省，独处，寻找灵魂", meaningReversed: "孤立，孤独，退缩", meaningUprightEn: "introspection, solitude, guidance", meaningReversedEn: "isolation, withdrawal, avoidance", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg" },
  { id: 10, name: "Wheel of Fortune", nameCn: "命运之轮", meaningUpright: "好运，业力，生命周期，命运", meaningReversed: "坏运，抗拒改变，阻碍", meaningUprightEn: "change, cycles, luck", meaningReversedEn: "resistance to change, bad timing", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg" },
  { id: 11, name: "Justice", nameCn: "正义", meaningUpright: "正义，公平，真相，因果", meaningReversed: "不公，逃避责任，不诚实", meaningUprightEn: "truth, fairness, accountability", meaningReversedEn: "bias, imbalance, avoidance", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg" },
  { id: 12, name: "The Hanged Man", nameCn: "倒吊人", meaningUpright: "暂停，臣服，放手，新视角", meaningReversed: "拖延，抗拒，停滞", meaningUprightEn: "surrender, pause, new perspective", meaningReversedEn: "stalling, stubbornness, delay", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg" },
  { id: 13, name: "Death", nameCn: "死神", meaningUpright: "结束，改变，转化，过渡", meaningReversed: "抗拒改变，停滞不前", meaningUprightEn: "transformation, endings, renewal", meaningReversedEn: "resistance to change, stagnation", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg" },
  { id: 14, name: "Temperance", nameCn: "节制", meaningUpright: "平衡，适度，耐心，目的", meaningReversed: "失衡，过度，自我修复", meaningUprightEn: "balance, moderation, harmony", meaningReversedEn: "excess, imbalance, extremes", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg" },
  { id: 15, name: "The Devil", nameCn: "恶魔", meaningUpright: "阴影自我，依恋，成瘾，束缚", meaningReversed: "释放限制性信念，探索黑暗思想", meaningUprightEn: "attachment, temptation, shadow", meaningReversedEn: "release, freedom, reclaiming power", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg" },
  { id: 16, name: "The Tower", nameCn: "高塔", meaningUpright: "突然的改变，动荡，混乱，启示", meaningReversed: "避免灾难，恐惧改变", meaningUprightEn: "upheaval, revelation, disruption", meaningReversedEn: "avoiding change, fear of collapse", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg" },
  { id: 17, name: "The Star", nameCn: "星星", meaningUpright: "希望，信仰，目标，更新", meaningReversed: "缺乏信仰，绝望，自我怀疑", meaningUprightEn: "hope, healing, inspiration", meaningReversedEn: "despair, doubt, lack of faith", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg" },
  { id: 18, name: "The Moon", nameCn: "月亮", meaningUpright: "幻觉，恐惧，焦虑，潜意识", meaningReversed: "释放恐惧，压抑的情感", meaningUprightEn: "uncertainty, illusion, subconscious", meaningReversedEn: "clarity, release fear, truth", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg" },
  { id: 19, name: "The Sun", nameCn: "太阳", meaningUpright: "积极，快乐，温暖，成功", meaningReversed: "内心小孩，情绪低落，过度乐观", meaningUprightEn: "joy, success, vitality", meaningReversedEn: "setback, pessimism, overconfidence", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg" },
  { id: 20, name: "Judgement", nameCn: "审判", meaningUpright: "审判，重生，内心召唤，宽恕", meaningReversed: "自我怀疑，忽视召唤", meaningUprightEn: "awakening, reckoning, renewal", meaningReversedEn: "self-doubt, ignoring the call", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg" },
  { id: 21, name: "The World", nameCn: "世界", meaningUpright: "完成，整合，成就，旅行", meaningReversed: "寻求结束，捷径，延误", meaningUprightEn: "completion, wholeness, achievement", meaningReversedEn: "delay, unfinished business, shortcuts", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg" },
];

export const TAROT_SYSTEM_INSTRUCTION_ZH = `
你是一位专业的塔罗师AI助手，精通78张塔罗牌的象征意义、正逆位解读、牌阵应用和灵性指导。你以温和、中立且富有洞察力的方式为用户提供塔罗解读服务，注重启发而非预言，强调个人能动性和内在成长。

你将按照下面的结构进行解读：

**【单牌解读结构】**
(请针对抽出的每一张牌分别进行以下解读)
1. 🃏 **卡片展示**：[牌名 - 正/逆位]
2. 🔑 **核心象征**：简要说明该牌的基本含义
3. 💡 **情境解读**：结合用户问题分析此牌在当前情境下的意义

**【多牌综合解读】**
(综合所有牌面进行总结)
分析牌间关系、能量流动和整体故事线，结合用户给你的问题指出可能的：
- ⚖️ **挑战与机遇**
- 🌍 **内在与外在因素**
- 🚀 **行动建议方向**

**核心价值观：**
“爱情真正的价值，从来不是让你遇见对的人，而是让你照见真的自己。所有关系的困境，都是内心投射的倒影。破情关者，破的是对‘被爱’的执迷。见本性者，见的是本自具足的清明。”
请在涉及情感问题时，引用或基于上述哲学观点进行深层解读。

请使用Markdown格式输出，保持排版清晰优雅。
`;

export const TAROT_SYSTEM_INSTRUCTION_EN = `
You are a professional AI Tarot Reader, expert in the symbolism of the 78 Tarot cards, upright and reversed meanings, spread applications, and spiritual guidance. You provide readings in a gentle, neutral, and insightful manner, focusing on inspiration rather than fortune-telling, emphasizing personal agency and inner growth.

Please follow this structure for your reading:

**[Single Card Analysis]**
(Analyze each drawn card individually)
1. 🃏 **Card**: [Card Name - Upright/Reversed]
2. 🔑 **Core Symbolism**: Briefly explain the basic meaning.
3. 💡 **Contextual Interpretation**: Analyze the card's meaning in the context of the user's question.

**[Synthesis & Guidance]**
(Synthesize all cards)
Analyze the relationships between cards, energy flow, and the overall narrative. Combine with the user's question to point out:
- ⚖️ **Challenges & Opportunities**
- 🌍 **Internal & External Factors**
- 🚀 **Suggested Actions**

**Core Philosophy:**
"The true value of love is not to meet the right person, but to see your true self. All relationship dilemmas are reflections of inner projections. To break through emotional barriers is to break the obsession with 'being loved'. To see one's true nature is to see the clarity that is already complete within."
When dealing with relationship questions, please use this philosophy for deep interpretation.

Please use Markdown format for clear and elegant output.
`;

export const TRANSLATIONS = {
  zh: {
    appTitle: "神秘塔罗",
    startTitle: "命运之镜",
    startSubtitle: "连接你的直觉，照见真实自己",
    suggestionsLabel: "灵感示例",
    suggestionsHint: "点选快速填入你的命题",
    placeholder: "在此输入你心中的困惑...",
    startBtn: "开启占卜",
    shuffling: "命运洗牌中...",
    drawTitle: "请凭直觉抽取三张牌",
    questionLabel: "你的问题",
    analyzing: "解读命运中...",
    againBtn: "再次占卜",
    limitReached: "今日占卜次数已达上限（5次）。请明日再来。",
    past: "过去",
    present: "现在",
    future: "未来",
    upright: "正位",
    reversed: "逆位",
    position0: "过去",
    position1: "现在",
    position2: "未来",
    topics: "命题",
    topicsList: "命题列表",
    topicsEmpty: "暂无命题，完成一次占卜后将自动生成。",
    topicsQuota: "剩余可创建命题",
    topicSaved: "已将您的问题创建为一个命题",
    topicSaveFailed: "命题保存失败，请稍后重试或升级会员。",
    viewTopic: "查看命题",
    savingTopic: "正在创建命题...",
    upgradeTitle: "免费 vs 会员",
    upgradeDesc: "升级可创建更多命题、每个命题更多事件，并解锁到期前提醒。",
    upgradeFree: "免费：1 个命题，3 次事件，可查看所有历史。",
    upgradeMember: "会员：30 个命题/月，每个命题 500 次事件，高频使用不设常规上限。",
    redeemNow: "兑换会员码",
    close: "关闭",
    planBadgeMember: "会员",
    planBadgeFree: "免费",
  },
  en: {
    appTitle: "Mystic Tarot",
    startTitle: "Mirror of Fate",
    startSubtitle: "Connect with intuition, see your true self",
    suggestionsLabel: "Suggested prompts",
    suggestionsHint: "Tap to auto-fill your focus question",
    placeholder: "Focus on your question...",
    startBtn: "Begin Reading",
    shuffling: "Shuffling Destiny...",
    drawTitle: "Draw Three Cards by Intuition",
    questionLabel: "Your Question",
    analyzing: "Consulting the Stars...",
    againBtn: "Ask Another Question",
    limitReached: "Daily limit reached (5/5). Please come back tomorrow.",
    past: "The Past",
    present: "The Present",
    future: "The Future",
    upright: "Upright",
    reversed: "Reversed",
    position0: "The Past",
    position1: "The Present",
    position2: "The Future",
    topics: "Topics",
    topicsList: "Topic List",
    topicsEmpty: "No topics yet. Complete a reading to create one automatically.",
    topicsQuota: "Topics remaining",
    topicSaved: "Your question has been saved as a topic",
    topicSaveFailed: "Failed to save topic. Please retry or upgrade.",
    viewTopic: "View Topic",
    savingTopic: "Creating topic...",
    upgradeTitle: "Free vs Member",
    upgradeDesc: "Upgrade to create more topics, log more events per topic, and get expiry alerts.",
    upgradeFree: "Free: 1 topic, 3 events, view all history.",
    upgradeMember: "Member: 30 topics/month, 500 events per topic, high-frequency usage with no normal cap.",
    redeemNow: "Redeem code",
    close: "Close",
    planBadgeMember: "Member",
    planBadgeFree: "Free",
  }
};

// Big Topic Case Study Slug Mappings
export const BIG_TOPIC_SLUG_MAP: Record<string, string> = {
  'Will-He-Contact-Me': '37fae20a-e28f-4ca8-b819-ddd730596a49',
  'Will-Our-Relationship-Continue': '44455bbc-d41e-432e-a3db-24dd1b5ba70b',
  'Is-My-Current-Job-Right-for-Me': '12ac8ec7-f79a-4d63-87eb-24b21fd13045',
};
