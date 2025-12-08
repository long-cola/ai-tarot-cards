# 管理员后台设置指南

## 概述

管理员后台已经从硬编码的凭证迁移到数据库管理。现在所有管理员账号都存储在 `admin_users` 表中,密码使用 bcrypt 加密。

## 功能特性

管理员后台支持以下功能:

1. **用户管理**
   - 查看所有用户列表
   - 显示用户注册时间
   - 显示用户是否付费
   - 显示付费用户的到期时间
   - 显示用户的课题数量和事件数量

2. **课题管理**
   - 查看用户的所有课题
   - 查看课题详情(标题、创建时间、事件数量)
   - 查看课题的初始三张牌
   - 查看课题的基准解读

3. **事件管理**
   - 查看课题下的所有事件
   - 显示事件名称
   - 显示事件抽的牌
   - 显示事件的解读结果

## 创建管理员账号

### 方法 1: 使用命令行脚本

```bash
# 创建管理员账号
node server/create-admin.js <email> <password> [name]

# 示例
node server/create-admin.js admin@example.com SecurePassword123 "管理员"
```

### 方法 2: 使用 API (需要 ADMIN_CODE_SECRET)

```bash
curl -X POST http://localhost:3001/api/admin/create \
  -H "Content-Type: application/json" \
  -H "x-admin-secret: YOUR_ADMIN_CODE_SECRET" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePassword123",
    "name": "管理员"
  }'
```

## 访问管理员后台

1. 打开浏览器访问: `http://localhost:5173/admin.html` (开发环境)
2. 输入管理员邮箱和密码
3. 点击"登录并加载"按钮

## 环境变量配置

确保在 `.env.server.local` 文件中配置了以下环境变量:

```env
# 数据库连接
DATABASE_URL=your_postgres_connection_string

# 管理员密钥 (用于创建管理员账号)
ADMIN_CODE_SECRET=your_secret_key_here

# JWT 密钥
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret
```

## 安全注意事项

1. **密码安全**: 管理员密码使用 bcrypt 加密存储,永远不会以明文形式保存
2. **认证方式**: 支持两种认证方式:
   - Basic Auth: 使用邮箱和密码
   - Header Auth: 使用 `x-admin-secret` header (仅用于服务器间通信)
3. **不要在前端硬编码凭证**: 所有管理员凭证都应该存储在数据库中
4. **定期更换密码**: 建议定期更换管理员密码

## 数据库表结构

### admin_users 表

```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## API 端点

### 创建管理员账号
- **POST** `/api/admin/create`
- **Headers**: `x-admin-secret: YOUR_SECRET`
- **Body**: `{ "email": "...", "password": "...", "name": "..." }`

### 获取用户列表
- **GET** `/api/admin/users`
- **Auth**: Basic Auth (email:password)

### 获取用户的课题列表
- **GET** `/api/admin/users/:id/topics`
- **Auth**: Basic Auth

### 获取课题详情
- **GET** `/api/admin/topics/:id`
- **Auth**: Basic Auth

### 获取课题的事件列表
- **GET** `/api/admin/topics/:id/events`
- **Auth**: Basic Auth

## 故障排除

### 问题: 无法登录管理员后台

1. 确认管理员账号已创建
2. 检查邮箱和密码是否正确
3. 查看浏览器控制台的错误信息
4. 检查服务器日志

### 问题: 数据库连接失败

1. 确认 `DATABASE_URL` 环境变量已正确配置
2. 确认数据库服务正在运行
3. 检查网络连接

### 问题: 创建管理员账号失败

1. 确认 `ADMIN_CODE_SECRET` 环境变量已配置
2. 确认邮箱格式正确
3. 确认密码强度足够(建议至少8位,包含字母和数字)
4. 检查该邮箱是否已被使用

## 开发和部署

### 本地开发

```bash
# 启动开发服务器
npm run dev

# 访问管理员后台
open http://localhost:5173/admin.html
```

### 生产部署

1. 确保所有环境变量已在 Vercel 中配置
2. 部署前先创建管理员账号
3. 访问 `https://your-domain.com/admin.html`

## 更新日志

- **2025-12-07**:
  - 将管理员认证从硬编码迁移到数据库
  - 添加 bcrypt 密码加密
  - 创建管理员账号创建脚本
  - 更新前端移除硬编码凭证
