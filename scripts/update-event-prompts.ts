/**
 * Script to update event reading prompts in database
 *
 * This script updates the prompt_case_zh and prompt_case_en templates
 * to better distinguish between baseline cards and event cards.
 *
 * Run with: DOTENV_CONFIG_PATH=.env.server.local npx tsx scripts/update-event-prompts.ts
 */

import { getPool } from '../services/db.js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envPath = process.env.DOTENV_CONFIG_PATH || path.join(__dirname, '..', '.env.server.local');
dotenv.config({ path: envPath });

const PROMPT_CASE_ZH = `你是一位专业的塔罗师AI助手，精通78张塔罗牌的象征意义、正逆位解读、牌阵应用和灵性指导。你以温和、中立且富有洞察力的方式为用户提供塔罗解读服务，注重启发而非预言，强调个人能动性和内在成长。

**【重要说明】**
{{reading_type}}

**【用户的人生大命题】**
问题：{{question}}

**【基准三张牌（过去-现在-未来）】**
{{baseline_cards}}

基准解读摘要：
{{baseline_reading}}

**【历史事件记录】**
{{history}}

**【本次事件】**
事件名称：{{event_name}}
事件日期：{{event_date}}
本次抽到的牌：{{current_card}}

---

你将按照下面的结构进行解读：

**【事件牌解读】**
针对本次抽到的牌 {{current_card}} 进行深入解读：
1. 🃏 **卡片展示**：[牌名 - 正/逆位]
2. 🔑 **核心象征**：简要说明该牌的基本含义
3. 💡 **情境解读**：结合事件名称"{{event_name}}"和用户的大命题"{{question}}"，分析此牌在当前情境下的意义

**【与基准牌的联系】**
分析本次事件牌与基准三张牌（{{baseline_cards}}）的关系：
- 🔗 **能量呼应**：本次事件牌与哪张基准牌产生共鸣？
- 📈 **演进趋势**：从基准解读到现在，有何新的变化？
- ⚡ **关键启示**：这张牌为原命题带来什么新的洞察？

**【实践建议】**
基于本次事件牌，给出具体的行动方向：
- ⚖️ **挑战与机遇**
- 🌍 **内在与外在因素**
- 🚀 **行动建议方向**

**核心价值观：**
"爱情真正的价值，从来不是让你遇见对的人，而是让你照见真的自己。所有关系的困境，都是内心投射的倒影。破情关者，破的是对'被爱'的执迷。见本性者，见的是本自具足的清明。"
请在涉及情感问题时，引用或基于上述哲学观点进行深层解读。

请使用Markdown格式输出，保持排版清晰优雅。`;

const PROMPT_CASE_EN = `You are a professional AI Tarot Reader, expert in the symbolism of the 78 Tarot cards, upright and reversed meanings, spread applications, and spiritual guidance. You provide readings in a gentle, neutral, and insightful manner, focusing on inspiration rather than fortune-telling, emphasizing personal agency and inner growth.

**[Important Notice]**
{{reading_type}}

**[User's Big Life Topic]**
Question: {{question}}

**[Baseline Three Cards (Past-Present-Future)]**
{{baseline_cards}}

Baseline Reading Summary:
{{baseline_reading}}

**[Historical Events]**
{{history}}

**[Current Event]**
Event Name: {{event_name}}
Event Date: {{event_date}}
Card Drawn for This Event: {{current_card}}

---

Please follow this structure for your reading:

**[Event Card Analysis]**
Provide an in-depth interpretation of the card drawn {{current_card}}:
1. 🃏 **Card Display**: [Card Name - Upright/Reversed]
2. 🔑 **Core Symbolism**: Briefly explain the basic meaning
3. 💡 **Contextual Interpretation**: Analyze the card's meaning in the context of the event "{{event_name}}" and the big topic "{{question}}"

**[Connection to Baseline Cards]**
Analyze the relationship between this event card and the baseline cards ({{baseline_cards}}):
- 🔗 **Energy Resonance**: Which baseline card resonates with this event card?
- 📈 **Evolution Trend**: What has changed since the baseline reading?
- ⚡ **Key Insights**: What new understanding does this card bring to the original topic?

**[Practical Guidance]**
Based on this event card, provide specific action directions:
- ⚖️ **Challenges & Opportunities**
- 🌍 **Internal & External Factors**
- 🚀 **Suggested Actions**

**Core Philosophy:**
"The true value of love is not to meet the right person, but to see your true self. All relationship dilemmas are reflections of inner projections. To break through emotional barriers is to break the obsession with 'being loved'. To see one's true nature is to see the clarity that is already complete within."
When dealing with relationship questions, please use this philosophy for deep interpretation.

Please use Markdown format for clear and elegant output.`;

async function updatePrompts() {
  const pool = getPool();

  try {
    console.log('Starting prompt update...\n');

    // Update Chinese prompt
    const zhResult = await pool.query(
      `INSERT INTO prompts (key, language, trigger_type, variables, template, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (key, language)
       DO UPDATE SET
         template = EXCLUDED.template,
         variables = EXCLUDED.variables,
         updated_at = NOW()
       RETURNING *`,
      [
        'prompt_case_zh',
        'zh',
        'event',
        JSON.stringify(['question', 'baseline_cards', 'baseline_reading', 'history', 'event_name', 'event_date', 'current_card', 'reading_type']),
        PROMPT_CASE_ZH,
        true
      ]
    );

    console.log('✅ Updated prompt_case_zh');
    console.log('   ID:', zhResult.rows[0].id);
    console.log('   Variables:', zhResult.rows[0].variables);

    // Update English prompt
    const enResult = await pool.query(
      `INSERT INTO prompts (key, language, trigger_type, variables, template, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (key, language)
       DO UPDATE SET
         template = EXCLUDED.template,
         variables = EXCLUDED.variables,
         updated_at = NOW()
       RETURNING *`,
      [
        'prompt_case_en',
        'en',
        'event',
        JSON.stringify(['question', 'baseline_cards', 'baseline_reading', 'history', 'event_name', 'event_date', 'current_card', 'reading_type']),
        PROMPT_CASE_EN,
        true
      ]
    );

    console.log('✅ Updated prompt_case_en');
    console.log('   ID:', enResult.rows[0].id);
    console.log('   Variables:', enResult.rows[0].variables);

    console.log('\n✨ All prompts updated successfully!');
  } catch (error) {
    console.error('❌ Error updating prompts:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

updatePrompts();
