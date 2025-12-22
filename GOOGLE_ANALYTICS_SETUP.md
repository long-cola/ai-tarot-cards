# Google Analytics 4 集成指南

## 概述
本指南将帮助你为AI Tarot Cards网站集成Google Analytics 4 (GA4)进行流量分析和用户行为追踪。

---

## 第一步: 创建GA4账号

### 1. 访问Google Analytics
前往: https://analytics.google.com/

### 2. 创建账号和媒体资源
1. 点击"开始测量"
2. 输入账号名称（如: AI Tarot Cards）
3. 配置数据分享设置（建议全选）
4. 创建媒体资源:
   - 媒体资源名称: AI Tarot Cards
   - 报告时区: 选择你的时区
   - 货币: 选择你的货币
5. 填写业务信息:
   - 行业类别: 娱乐/生活方式
   - 企业规模: 选择合适的规模
6. 设置业务目标（可多选）:
   - 获取新客户
   - 提高用户互动度
   - 增加收入

### 3. 设置数据流
1. 选择平台: Web
2. 输入网站URL: `https://ai-tarotcard.com`
3. 输入数据流名称: AI Tarot Cards Website
4. 点击"创建数据流"

### 4. 获取测量ID
创建完成后，你会看到一个测量ID，格式为: `G-XXXXXXXXXX`

**记下这个ID，后面需要使用！**

---

## 第二步: 添加GA4代码到网站

### 方法1: 手动添加（推荐用于生产环境）

在 `index.html` 的 `<head>` 部分添加以下代码：

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  // 基础配置
  gtag('config', 'G-XXXXXXXXXX', {
    'send_page_view': true,
    'anonymize_ip': true, // GDPR合规
    'cookie_flags': 'SameSite=None;Secure'
  });
</script>
```

**重要**: 将 `G-XXXXXXXXXX` 替换为你的实际测量ID！

### 方法2: 使用环境变量（推荐用于开发/生产分离）

1. 在 `.env` 文件中添加:
```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

2. 在 `index.html` 中使用:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=%VITE_GA_MEASUREMENT_ID%"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '%VITE_GA_MEASUREMENT_ID%');
</script>
```

---

## 第三步: 配置自定义事件追踪

### 追踪重要用户行为

在相应的组件中添加事件追踪:

```typescript
// 追踪塔罗占卜开始
const trackTarotReading = (question: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'tarot_reading_start', {
      'event_category': 'engagement',
      'event_label': 'quick_reading',
      'value': question.length
    });
  }
};

// 追踪牌阵抽取
const trackCardDraw = (cardName: string, position: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'card_drawn', {
      'event_category': 'engagement',
      'card_name': cardName,
      'card_position': position
    });
  }
};

// 追踪命题创建
const trackTopicCreation = (topicTitle: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'topic_created', {
      'event_category': 'conversion',
      'event_label': 'life_topic',
      'value': 1
    });
  }
};

// 追踪分享功能
const trackShare = (shareType: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'share', {
      'method': 'link_copy',
      'content_type': shareType,
      'item_id': 'tarot_reading'
    });
  }
};

// 追踪升级为会员
const trackUpgrade = (plan: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      'transaction_id': Date.now().toString(),
      'value': plan === 'member' ? 19.9 : 0,
      'currency': 'CNY',
      'items': [{
        'item_name': 'Pro Membership',
        'item_category': 'membership',
        'price': 19.9,
        'quantity': 1
      }]
    });
  }
};
```

### TypeScript类型声明

在 `src/global.d.ts` 中添加:

```typescript
interface Window {
  gtag?: (
    command: 'config' | 'event' | 'set',
    targetId: string,
    config?: Record<string, any>
  ) => void;
  dataLayer?: any[];
}
```

---

## 第四步: 配置GA4设置

### 1. 设置转化目标

在GA4中:
1. 进入"管理" > "事件"
2. 将以下事件标记为转化:
   - `topic_created` (命题创建)
   - `purchase` (会员升级)
   - `share` (分享功能使用)

### 2. 创建自定义维度

在"管理" > "自定义定义" > "创建自定义维度":

| 维度名称 | 范围 | 事件参数 |
|---------|------|----------|
| 卡牌名称 | 事件 | card_name |
| 卡牌位置 | 事件 | card_position |
| 分享类型 | 事件 | content_type |
| 会员计划 | 用户 | user_plan |

### 3. 配置增强型衡量功能

在"数据流" > "增强型衡量功能"中启用:
- ✅ 网页浏览量
- ✅ 滚动次数
- ✅ 出站点击次数
- ✅ 网站搜索（如适用）
- ✅ 视频互动（如适用）
- ✅ 文件下载（如适用）

---

## 第五步: 验证安装

### 1. 使用GA4实时报告
1. 在GA4中打开"报告" > "实时"
2. 访问你的网站
3. 查看是否有活跃用户显示

### 2. 使用Google Tag Assistant
1. 安装Chrome扩展: [Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
2. 访问你的网站
3. 点击扩展图标，检查GA4标签是否正常工作

### 3. 使用浏览器开发者工具
1. 打开Chrome DevTools
2. 切换到"Network"标签
3. 过滤: `google-analytics.com`或`analytics.google.com`
4. 访问页面，应该看到请求发送

---

## 第六步: Google Search Console集成

### 1. 关联Search Console
1. 在GA4中: "管理" > "产品关联" > "Search Console链接"
2. 点击"关联"
3. 选择你的Search Console媒体资源
4. 确认关联

### 2. 在Search Console中验证网站
前往: https://search.google.com/search-console

**方法1: HTML文件验证**
1. 下载验证文件
2. 上传到网站根目录

**方法2: HTML标签验证**（推荐）
1. 复制meta标签
2. 添加到 `index.html` 的 `<head>` 中:
```html
<meta name="google-site-verification" content="your-verification-code" />
```

**方法3: GA4验证**
如果已关联GA4，可自动验证

### 3. 提交Sitemap
1. 在Search Console中选择媒体资源
2. 左侧菜单 > "索引" > "站点地图"
3. 输入sitemap URL:
   - `https://ai-tarotcard.com/sitemap.xml`
   - `https://ai-tarotcard.com/api/sitemap-dynamic`
4. 点击"提交"

---

## 第七步: 设置数据保留和隐私

### 1. 数据保留期限
在"管理" > "数据设置" > "数据保留":
- 建议选择: **14个月**（免费用户最长）

### 2. 隐私设置
在"数据设置" > "数据收集":
- ✅ 启用Google信号数据收集（用于跨设备追踪）
- ✅ 启用再营销功能（如需）

### 3. GDPR合规（如适用）
如果你的用户来自欧盟，需要:
1. 添加Cookie同意横幅
2. 在GA配置中添加 `anonymize_ip: true`
3. 更新隐私政策

---

## 第八步: 创建重要报告

### 推荐的自定义报告

#### 1. 用户获取报告
- 维度: 来源/媒介
- 指标: 用户数、新用户数、会话数、转化次数

#### 2. 用户行为漏斗
- 步骤1: 访问首页
- 步骤2: 开始占卜
- 步骤3: 抽取卡牌
- 步骤4: 查看解读
- 步骤5: 创建命题/分享

#### 3. 会员转化报告
- 维度: 用户类型
- 指标: purchase事件、转化率、收入

---

## 重要指标监控

### 关键指标 (KPIs)

1. **流量指标**
   - 每日活跃用户 (DAU)
   - 每月活跃用户 (MAU)
   - 新用户比例

2. **互动指标**
   - 占卜完成率
   - 平均每用户占卜次数
   - 命题创建率

3. **转化指标**
   - 分享转化率
   - 会员升级率
   - 用户留存率（D1, D7, D30）

4. **技术指标**
   - 页面加载时间
   - 跳出率
   - 错误率

---

## 故障排查

### 问题: 数据未显示
1. 检查测量ID是否正确
2. 确认代码是否正确放置在`<head>`中
3. 检查浏览器控制台是否有错误
4. 确认没有被广告拦截器阻止
5. 等待24-48小时（非实时数据）

### 问题: 自定义事件未追踪
1. 检查事件名称是否正确
2. 确认`window.gtag`已定义
3. 使用GA4 DebugView查看实时事件
4. 检查事件参数是否符合GA4限制

### 问题: 转化未记录
1. 确认事件已标记为转化
2. 检查转化计数方法（每次会话/每个事件）
3. 验证事件参数是否完整

---

## 下一步行动

- [ ] 创建GA4账号并获取测量ID
- [ ] 将测量ID添加到代码中
- [ ] 部署到生产环境
- [ ] 验证数据收集正常
- [ ] 关联Google Search Console
- [ ] 提交sitemap
- [ ] 设置自定义事件追踪
- [ ] 创建自定义报告
- [ ] 设置数据导出和备份（可选）

---

## 相关资源

- [GA4官方文档](https://support.google.com/analytics/answer/9304153)
- [GA4事件命名规范](https://support.google.com/analytics/answer/9322688)
- [Google Search Console帮助](https://support.google.com/webmasters)
- [GDPR合规指南](https://support.google.com/analytics/answer/9019185)

---

**注意**: 请确保遵守所在地区的隐私法规（GDPR, CCPA等）。
