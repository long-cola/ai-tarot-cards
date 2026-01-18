import { getUserFromRequest } from '../services/jwt.js';
import { getRenderedPrompt } from '../services/promptService.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ ok: false, message: 'not_authenticated' });
  }

  const { BAILIAN_API_KEY } = process.env;

  if (!BAILIAN_API_KEY) {
    return res.status(500).json({
      ok: false,
      message: 'bailian_api_key_not_configured',
    });
  }

  const {
    question,
    cards,
    language,
    promptKey,
    variables = {}
  } = req.body;

  // Determine the prompt key based on language and type
  // Default to 'first' (initial reading) if not specified
  const isZh = language === 'zh';
  const defaultPromptKey = isZh ? 'prompt_first_zh' : 'prompt_first_en';
  const finalPromptKey = promptKey || defaultPromptKey;

  if (!question || !cards || !Array.isArray(cards) || cards.length === 0) {
    return res.status(400).json({
      ok: false,
      message: 'invalid_request',
    });
  }

  try {
    // Log the variables being passed
    console.log('[tarot-reading] Request params:', {
      promptKey: finalPromptKey,
      language,
      variables,
      question: question.substring(0, 50) + '...'
    });

    // Try to get prompt from database
    let systemInstruction = await getRenderedPrompt(finalPromptKey, language, variables);

    // Log the rendered prompt (first 200 chars)
    if (systemInstruction) {
      console.log('[tarot-reading] ✅ Prompt loaded from database');
      console.log('[tarot-reading] Rendered prompt preview:', systemInstruction.substring(0, 300) + '...');
      console.log('[tarot-reading] Checking if variables were replaced:');
      console.log('[tarot-reading] - Contains {{question}}?', systemInstruction.includes('{{question}}'));
      console.log('[tarot-reading] - Contains {{baseline_cards}}?', systemInstruction.includes('{{baseline_cards}}'));
      console.log('[tarot-reading] - Contains actual question?', systemInstruction.includes(question.substring(0, 10)));
    }

    // Fallback to default prompts if not found in database
    if (!systemInstruction) {
      console.warn(`[tarot-reading] ❌ Prompt not found in DB: ${finalPromptKey}/${language}, using fallback`);
      console.warn('[tarot-reading] Please create this prompt in the admin panel!');

      // Format cards based on language
      const cardsString = cards
        .map((c: any) => {
          const posName = cards.length === 1
            ? (isZh ? '单牌' : 'Card')
            : (isZh
              ? ['过去', '现在', '未来'][c.position]
              : ['The Past', 'The Present', 'The Future'][c.position]);
          const cardName = isZh ? c.nameCn : c.name;
          const status = isZh ? (c.isReversed ? '逆位' : '正位') : c.isReversed ? 'Reversed' : 'Upright';
          return `${posName}: ${cardName} (${status})`;
        })
        .join(isZh ? '，' : ', ');

      // System instructions (fallback)
      const TAROT_SYSTEM_INSTRUCTION_ZH = `你是一位专业的塔罗师AI助手，精通78张塔罗牌的象征意义、正逆位解读、牌阵应用和灵性指导。你以温和、中立且富有洞察力的方式为用户提供塔罗解读服务，注重启发而非预言，强调个人能动性和内在成长。

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
"爱情真正的价值，从来不是让你遇见对的人，而是让你照见真的自己。所有关系的困境，都是内心投射的倒影。破情关者，破的是对'被爱'的执迷。见本性者，见的是本自具足的清明。"
请在涉及情感问题时，引用或基于上述哲学观点进行深层解读。

请使用Markdown格式输出，保持排版清晰优雅。`;

      const TAROT_SYSTEM_INSTRUCTION_EN = `You are a professional AI Tarot Reader, expert in the symbolism of the 78 Tarot cards, upright and reversed meanings, spread applications, and spiritual guidance. You provide readings in a gentle, neutral, and insightful manner, focusing on inspiration rather than fortune-telling, emphasizing personal agency and inner growth.

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

Please use Markdown format for clear and elegant output.`;

      const formatHint = isZh
        ? '请使用Markdown富文本输出，包含分节小标题、列表和重点加粗，不要只用纯文本段落。'
        : 'Please use Markdown rich text with section headings, bullet lists, and bold emphasis—avoid plain unstructured text.';

      const prompt = isZh
        ? `我给你的牌：{${cardsString}}，我的问题：{${question}}。\n\n${formatHint}`
        : `Cards drawn: {${cardsString}}, My question: {${question}}.\n\n${formatHint}`;

      systemInstruction = (isZh ? TAROT_SYSTEM_INSTRUCTION_ZH : TAROT_SYSTEM_INSTRUCTION_EN) + '\n\n' + prompt;
    }

    // Call Bailian API with extended timeout
    console.log('[tarot-reading] Calling Bailian API...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 seconds timeout

    try {
      const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${BAILIAN_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'qwen-flash',
          messages: [
            { role: 'user', content: systemInstruction },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[tarot-reading] Bailian API error:', response.status, errorText);
        return res.status(500).json({
          ok: false,
          message: 'ai_api_error',
          details: `${response.status}: ${errorText}`,
        });
      }

      const data = await response.json();
      const messageContent = data?.choices?.[0]?.message?.content;
      const text = Array.isArray(messageContent)
        ? messageContent
            .map((part: any) => (typeof part === 'string' ? part : part?.text ?? ''))
            .join('')
            .trim()
        : messageContent ?? '';

      if (!text) {
        return res.status(500).json({
          ok: false,
          message: 'empty_response',
        });
      }

      console.log('[tarot-reading] ✅ Successfully got response from Bailian API');
      res.json({ ok: true, reading: text });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      console.error('[tarot-reading] Fetch error:', fetchError.message);

      if (fetchError.name === 'AbortError') {
        return res.status(504).json({
          ok: false,
          message: 'ai_api_timeout',
          details: 'Request to AI service timed out after 25 seconds',
        });
      }

      throw fetchError; // Re-throw to be caught by outer catch
    }
  } catch (error: any) {
    console.error('Tarot reading error:', error);
    res.status(500).json({
      ok: false,
      message: 'internal_error',
      details: error.message,
    });
  }
}

export const config = {
  maxDuration: 30,
};
