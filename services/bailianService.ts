import { TAROT_SYSTEM_INSTRUCTION_ZH, TAROT_SYSTEM_INSTRUCTION_EN } from "../constants";
import { DrawnCard, Language } from "../types";

const API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";

export const getTarotReading = async (question: string, cards: DrawnCard[], language: Language): Promise<string> => {
  const isZh = language === 'zh';
  const apiKey = import.meta.env.VITE_BAILIAN_API_KEY || '';

  if (!apiKey) {
    return isZh 
      ? "缺少百炼 API Key，请在环境变量 VITE_BAILIAN_API_KEY 中配置后重试。"
      : "Missing Bailian API key. Please set VITE_BAILIAN_API_KEY and try again.";
  }

  try {
    // Format cards based on language
    const cardsString = cards.map(c => {
       const posName = isZh ? ["过去", "现在", "未来"][c.position] : ["The Past", "The Present", "The Future"][c.position];
       const cardName = isZh ? c.nameCn : c.name;
       const status = isZh 
          ? (c.isReversed ? "逆位" : "正位")
          : (c.isReversed ? "Reversed" : "Upright");
       return `${posName}: ${cardName} (${status})`;
    }).join(isZh ? "，" : ", ");

    // Construct prompt with explicit Markdown guidance for rich text output
    const formatHint = isZh 
      ? "请使用Markdown富文本输出，包含分节小标题、列表和重点加粗，不要只用纯文本段落。" 
      : "Please use Markdown rich text with section headings, bullet lists, and bold emphasis—avoid plain unstructured text.";

    const prompt = isZh 
      ? `我给你的牌：{${cardsString}}，我的问题：{${question}}。\n\n${formatHint}`
      : `Cards drawn: {${cardsString}}, My question: {${question}}.\n\n${formatHint}`;

    const systemInstruction = isZh ? TAROT_SYSTEM_INSTRUCTION_ZH : TAROT_SYSTEM_INSTRUCTION_EN;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "qwen-flash",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Bailian API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const messageContent = data?.choices?.[0]?.message?.content;
    const text = Array.isArray(messageContent)
      ? messageContent.map((part: { text?: string } | string) => typeof part === "string" ? part : (part?.text ?? "")).join("").trim()
      : (messageContent ?? "");

    return text || (isZh ? "迷雾太浓，星象暂时难以看清……（请稍后再试）" : "The mist is too thick, the stars are unclear... (Please try again later)");
  } catch (error) {
    console.error("Bailian API Error:", error);
    return isZh ? "与灵界的连接似乎受到了干扰，请检查你的网络信号，静心后重试。" : "Connection to the spiritual realm seems interrupted. Please check your signal and try again.";
  }
};
