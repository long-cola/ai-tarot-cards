# 图片资源准备指南

## 需要创建的图片资源

为了完善SEO和用户体验，需要准备以下图片资源：

---

## 1. Favicon (网站图标)
**文件**: `public/favicon.ico`
- **尺寸**: 32x32 像素 (标准favicon尺寸)
- **格式**: .ico
- **设计建议**:
  - 简洁的塔罗牌图标或水晶球
  - 紫色系配色 (#9333EA)
  - 在小尺寸下清晰可辨

**工具推荐**:
- [Favicon.io](https://favicon.io/)
- [RealFaviconGenerator](https://realfavicongenerator.net/)

---

## 2. PWA 图标

### icon-192.png
**文件**: `public/icon-192.png`
- **尺寸**: 192x192 像素
- **格式**: PNG (透明背景)
- **用途**: Android Chrome 主屏幕图标
- **设计要求**:
  - 中心图案占70-80%
  - 四周留白，防止被遮挡
  - 符合Material Design规范

### icon-512.png
**文件**: `public/icon-512.png`
- **尺寸**: 512x512 像素
- **格式**: PNG (透明背景)
- **用途**: PWA splash screen、高分辨率设备
- **设计要求**:
  - 与192版本保持一致的设计
  - 更多细节和清晰度

---

## 3. Apple Touch Icon
**文件**: `public/apple-touch-icon.png`
- **尺寸**: 180x180 像素
- **格式**: PNG (不透明背景)
- **用途**: iOS Safari 添加到主屏幕
- **设计要求**:
  - iOS会自动添加圆角，无需预先圆角
  - 建议使用实色背景 (#0F172A 深蓝色)
  - 图标居中，四周适当留白

---

## 4. Open Graph 分享图片
**文件**: `public/og-image.jpg`
- **尺寸**: 1200x630 像素 (Facebook/Twitter 推荐)
- **格式**: JPG (优化后 < 1MB)
- **用途**: 社交媒体分享预览图
- **设计要求**:
  - 包含品牌名称: "神秘塔罗 AI"
  - 副标题: "AI驱动的塔罗牌占卜体验"
  - 视觉元素: 塔罗牌、神秘氛围
  - 颜色: 紫色渐变背景 (#0F172A -> #9333EA)
  - 确保重要内容在安全区域内 (1200x630中心的1200x570)

**Figma模板参考**:
```
背景: 渐变 (#0F172A 到 #1E293B)
装饰: 星星、塔罗牌图案
文字:
  - 主标题: "神秘塔罗 AI" (48px, 粗体)
  - 副标题: "AI驱动的塔罗牌占卜体验" (24px, 常规)
图标: 3张塔罗牌排列
```

---

## 设计配色方案

### 主色调
- **深蓝紫**: `#0F172A` (背景)
- **亮紫色**: `#9333EA` (主题色)
- **浅紫色**: `#A855F7` (次要色)
- **金黄色**: `#FCD34D` (强调色)
- **白色**: `#FFFFFF` (文字)

### 字体
- **中文**: Noto Serif SC (已使用)
- **英文**: Cinzel (已使用)

---

## 快速设计方案

如果你不熟悉设计工具，可以:

### 方案1: 使用AI生成
使用 Midjourney / DALL-E / Stable Diffusion:
```
Prompt: "mystical tarot card app icon, purple gradient background, crystal ball and tarot cards, minimalist design, dark theme, digital art"
```

### 方案2: 使用在线工具
1. **Canva** - 有免费模板
   - 搜索 "app icon" 或 "social media post"
   - 调整为所需尺寸
   - 使用紫色主题

2. **Figma** (推荐)
   - 创建对应尺寸的画布
   - 导入素材或使用图形工具绘制
   - 导出PNG/JPG

### 方案3: 使用现有塔罗牌图片
如果你有塔罗牌图片的使用权:
1. 选择一张代表性的牌
2. 添加品牌名称和渐变背景
3. 调整到对应尺寸

---

## 图片优化建议

创建图片后，使用以下工具优化:

1. **TinyPNG** - 压缩PNG图片
   - https://tinypng.com/
   - 减小文件大小，不损失肉眼可见的质量

2. **Squoosh** - Google的图片优化工具
   - https://squoosh.app/
   - 支持多种格式转换和压缩

3. **ImageOptim** (Mac)
   - 批量优化图片
   - 自动移除元数据

---

## 放置位置

创建好的图片应放置在:
```
public/
├── favicon.ico           # 32x32 网站图标
├── icon-192.png          # 192x192 PWA小图标
├── icon-512.png          # 512x512 PWA大图标
├── apple-touch-icon.png  # 180x180 iOS图标
└── og-image.jpg          # 1200x630 分享图片
```

---

## 验证清单

图片准备完成后，请检查:
- [ ] 所有图片文件已放置在 `public/` 目录
- [ ] 文件名完全匹配 (区分大小写)
- [ ] PNG图片背景透明 (除了apple-touch-icon)
- [ ] 文件大小合理 (icon < 50KB, og-image < 500KB)
- [ ] 在不同设备上测试显示效果

---

## 部署后验证

1. **Favicon测试**:
   - 在浏览器标签页查看
   - 添加书签测试

2. **PWA图标测试**:
   - Chrome开发者工具 > Application > Manifest
   - 检查图标是否正确加载

3. **Open Graph测试**:
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   - 输入网址，查看预览图

---

## 需要帮助?

如果你需要设计帮助，可以:
1. 雇佣设计师 (Fiverr, 99designs)
2. 使用模板网站 (Flaticon, Iconfinder)
3. 参考竞品设计灵感

**注意**: 确保你使用的所有图片和素材都有适当的使用许可。
