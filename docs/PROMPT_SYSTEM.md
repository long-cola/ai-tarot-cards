# Prompt 系统使用文档

## 概述

本系统将 AI 提示词从前端代码中解耦，统一由后台数据库配置。管理员可以通过后台界面灵活配置和管理提示词模板。

## 架构设计

### 核心原则

1. **模板化存储**：Prompt 作为「模板数据」存储在数据库中
2. **多语言支持**：每个 Prompt 必须有 language 字段（zh / en）
3. **变量占位符**：使用 `{{variable}}` 占位符，不在模板中直接拼接数据
4. **职责分离**：
   - 前端/API 只负责提供变量
   - Service 层负责获取模板并渲染最终 prompt

### 数据库结构

```sql
CREATE TABLE prompts (
  id UUID PRIMARY KEY,
  key TEXT NOT NULL,                    -- Prompt 唯一标识
  language TEXT NOT NULL DEFAULT 'zh',  -- 语言：zh / en
  trigger_type TEXT NOT NULL,           -- 触发时机：initial / event
  variables JSONB NOT NULL DEFAULT '[]', -- 支持的变量列表
  template TEXT NOT NULL,               -- 模板内容
  is_active BOOLEAN DEFAULT true,       -- 是否启用
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(key, language)
);
```

## 使用指南

### 1. 初始化数据库

首先需要运行数据库迁移脚本，创建 prompts 表：

```bash
# 应用 schema
psql $DATABASE_URL -f services/schema.sql

# 迁移现有提示词到数据库
npx tsx scripts/migrate-prompts.ts
```

### 2. 后台管理

访问 `/admin.html` 并登录后，点击「加载 Prompts」按钮进入 Prompt 管理界面。

#### 创建 Prompt

1. 填写 **Key**：如 `tarot_initial_reading`
2. 选择 **语言**：中文或 English
3. 选择 **触发时机**：
   - **首次请求**：用户抽三张牌，没有事件或不是命题时
   - **事件请求**：用户已创建命题，进行抽单张牌时
4. 选择 **变量**（多选）：
   - `question` - 我的问题
   - `baseline_cards` - 基础抽牌结果（过去、现在、未来）
   - `baseline_reading` - 基础解读摘要
   - `history` - 历史事件
   - `event_name` - 当前事件名称
   - `current_card` - 本次事件抽到的牌
   - `reading_structure` - 解读结构说明
5. 填写 **模板内容**：使用 `{{variable}}` 占位符

#### 示例模板

```
你是一位专业的塔罗师AI助手。

我的问题是：{{question}}
基础抽牌结果：{{baseline_cards}}（分别代表过去、现在、未来）
历史事件：{{history}}
当前事件名称：{{event_name}}
本次事件抽到的牌：{{current_card}}
```

### 3. API 调用

修改后的 API 支持从数据库读取 prompt 模板：

```typescript
// POST /api/tarot-reading
{
  "question": "我的职业发展如何？",
  "cards": [...],
  "language": "zh",
  "promptKey": "tarot_event_reading",  // 指定 prompt key
  "variables": {                        // 提供变量值
    "question": "我的职业发展如何？",
    "baseline_cards": "过去: 愚者(正位), 现在: 魔术师(正位), 未来: 女祭司(逆位)",
    "history": "2024-01-01、面试、塔(逆位)；2024-02-01、入职、星币骑士(正位)",
    "event_name": "晋升机会",
    "current_card": "权杖三(正位)"
  }
}
```

### 4. Service 层使用

```typescript
import { getRenderedPrompt } from './services/promptService.js';

// 获取并渲染 prompt
const prompt = await getRenderedPrompt(
  'tarot_event_reading',  // key
  'zh',                   // language
  {                       // variables
    question: '我的职业发展如何？',
    baseline_cards: '过去: 愚者(正位)...',
    history: '2024-01-01、面试、塔(逆位)...',
    event_name: '晋升机会',
    current_card: '权杖三(正位)'
  }
);
```

## 内置 Prompt Keys

### tarot_initial_reading
- **触发时机**：首次请求
- **支持变量**：question, baseline_cards
- **用途**：用户首次抽三张牌时的解读

### tarot_event_reading
- **触发时机**：事件请求
- **支持变量**：question, baseline_cards, baseline_reading, history, event_name, current_card
- **用途**：用户为已有命题抽事件牌时的解读

## 变量说明

| 变量名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| `question` | string | 用户的问题 | "我的职业发展如何？" |
| `baseline_cards` | string | 基础三张牌 | "过去: 愚者(正位), 现在: 魔术师(正位), 未来: 女祭司(逆位)" |
| `baseline_reading` | string | 基础解读摘要 | "你正处在一个新的开始..." |
| `history` | string | 历史事件摘要 | "2024-01-01、面试、塔(逆位)；2024-02-01、入职、星币骑士(正位)" |
| `event_name` | string | 当前事件名称 | "晋升机会" |
| `current_card` | string | 当前抽到的牌 | "权杖三(正位)" |
| `reading_structure` | string | 解读结构说明 | "【单牌解读结构】..." |

## 最佳实践

### 1. 命名规范
- Key 使用下划线命名：`tarot_event_reading`
- 保持 key 语义清晰、描述性强

### 2. 版本管理
- 不要直接修改生产环境的 prompt
- 先创建新版本测试，确认无误后再替换
- 可以通过 `is_active` 字段控制启用/禁用

### 3. 变量使用
- 尽量使用标准变量名，保持一致性
- 在模板中清晰标注每个变量的含义
- 避免在模板中做复杂的逻辑判断

### 4. 多语言支持
- 为每个 key 同时创建中英文版本
- 确保两个版本的变量使用一致
- 注意文化差异，调整表达方式

## 故障排除

### Prompt 未找到
- API 会自动 fallback 到内置的默认 prompt
- 检查数据库中是否存在对应的 key 和 language
- 查看 API 日志中的警告信息

### 变量未替换
- 检查变量名是否正确（区分大小写）
- 确认 API 调用时是否传递了该变量
- 查看 promptService 的渲染逻辑

### 模板格式错误
- 确保使用 `{{variable}}` 格式，不要有空格
- 测试时先用简单模板，逐步完善
- 在后台编辑时注意保存格式

## API 接口

### 管理接口（需要管理员权限）

```
GET    /api/admin/prompts       # 获取所有 prompts
POST   /api/admin/prompts       # 创建 prompt
PUT    /api/admin/prompts/:id   # 更新 prompt
DELETE /api/admin/prompts/:id   # 删除 prompt
```

## 技术栈

- **数据库**：PostgreSQL (Neon)
- **后端**：Vercel Functions + TypeScript
- **Service 层**：promptService.ts
- **前端**：admin.html

## 更新日志

### 2024-12-09
- 初始版本发布
- 支持两种触发类型：initial / event
- 支持 7 种常用变量
- 完整的后台管理界面
- 自动 fallback 机制
