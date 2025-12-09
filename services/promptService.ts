import { getPool } from './db.js';

export interface Prompt {
  id: string;
  key: string;
  language: string;
  trigger_type: 'initial' | 'event';
  variables: string[];
  template: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PromptVariables {
  question?: string;
  baseline_cards?: string;
  baseline_reading?: string;
  history?: string;
  event_name?: string;
  current_card?: string;
  reading_structure?: string;
}

/**
 * 获取指定 key 和 language 的 Prompt 模板
 */
export async function getPrompt(key: string, language: string = 'zh'): Promise<Prompt | null> {
  const pool = getPool();
  const result = await pool.query(
    `SELECT * FROM prompts
     WHERE key = $1 AND language = $2 AND is_active = true
     LIMIT 1`,
    [key, language]
  );

  return result.rows[0] || null;
}

/**
 * 渲染 Prompt 模板，替换变量
 */
export function renderPrompt(template: string, variables: PromptVariables): string {
  let rendered = template;

  // 替换所有 {{variable}} 占位符
  Object.entries(variables).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      rendered = rendered.replace(regex, String(value));
    }
  });

  // 移除未提供值的占位符（保留空行）
  rendered = rendered.replace(/\{\{[^}]+\}\}/g, '');

  return rendered.trim();
}

/**
 * 获取并渲染 Prompt
 */
export async function getRenderedPrompt(
  key: string,
  language: string,
  variables: PromptVariables
): Promise<string | null> {
  const prompt = await getPrompt(key, language);

  if (!prompt) {
    console.warn(`[PromptService] Prompt not found: key=${key}, language=${language}`);
    return null;
  }

  return renderPrompt(prompt.template, variables);
}

/**
 * 获取所有 Prompts（用于管理后台）
 */
export async function getAllPrompts(): Promise<Prompt[]> {
  const pool = getPool();
  const result = await pool.query(
    `SELECT * FROM prompts ORDER BY key, language, created_at DESC`
  );

  return result.rows;
}

/**
 * 创建 Prompt
 */
export async function createPrompt(data: {
  key: string;
  language: string;
  trigger_type: 'initial' | 'event';
  variables: string[];
  template: string;
}): Promise<Prompt> {
  const pool = getPool();
  const result = await pool.query(
    `INSERT INTO prompts (key, language, trigger_type, variables, template)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [data.key, data.language, data.trigger_type, JSON.stringify(data.variables), data.template]
  );

  return result.rows[0];
}

/**
 * 更新 Prompt
 */
export async function updatePrompt(id: string, data: {
  key?: string;
  language?: string;
  trigger_type?: 'initial' | 'event';
  variables?: string[];
  template?: string;
  is_active?: boolean;
}): Promise<Prompt | null> {
  const pool = getPool();

  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (data.key !== undefined) {
    updates.push(`key = $${paramIndex++}`);
    values.push(data.key);
  }
  if (data.language !== undefined) {
    updates.push(`language = $${paramIndex++}`);
    values.push(data.language);
  }
  if (data.trigger_type !== undefined) {
    updates.push(`trigger_type = $${paramIndex++}`);
    values.push(data.trigger_type);
  }
  if (data.variables !== undefined) {
    updates.push(`variables = $${paramIndex++}`);
    values.push(JSON.stringify(data.variables));
  }
  if (data.template !== undefined) {
    updates.push(`template = $${paramIndex++}`);
    values.push(data.template);
  }
  if (data.is_active !== undefined) {
    updates.push(`is_active = $${paramIndex++}`);
    values.push(data.is_active);
  }

  if (updates.length === 0) {
    return null;
  }

  updates.push(`updated_at = NOW()`);
  values.push(id);

  const result = await pool.query(
    `UPDATE prompts SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );

  return result.rows[0] || null;
}

/**
 * 删除 Prompt
 */
export async function deletePrompt(id: string): Promise<boolean> {
  const pool = getPool();
  const result = await pool.query(
    `DELETE FROM prompts WHERE id = $1`,
    [id]
  );

  return result.rowCount !== null && result.rowCount > 0;
}
