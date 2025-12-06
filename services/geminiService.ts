import { GoogleGenAI } from "@google/genai";
import { TAROT_SYSTEM_INSTRUCTION_ZH, TAROT_SYSTEM_INSTRUCTION_EN } from "../constants";
import { DrawnCard, SPREAD_LABELS, Language } from "../types";

// Initialize Gemini
// CRITICAL: Using process.env.API_KEY as per instructions
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTarotReading = async (question: string, cards: DrawnCard[], language: Language): Promise<string> => {
  const isZh = language === 'zh';
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

    // Construct prompt
    const prompt = isZh 
      ? `我给你的牌：{${cardsString}}，我的问题：{${question}}`
      : `Cards drawn: {${cardsString}}, My question: {${question}}`;

    const systemInstruction = isZh ? TAROT_SYSTEM_INSTRUCTION_ZH : TAROT_SYSTEM_INSTRUCTION_EN;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7, 
      }
    });

    return response.text || (isZh ? "迷雾太浓，星象暂时难以看清……（请稍后再试）" : "The mist is too thick, the stars are unclear... (Please try again later)");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return isZh ? "与灵界的连接似乎受到了干扰，请检查你的网络信号，静心后重试。" : "Connection to the spiritual realm seems interrupted. Please check your signal and try again.";
  }
};