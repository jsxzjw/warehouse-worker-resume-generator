# 商业功能完整实现文档

## 概述

本文档详细说明了仓库工人简历生成器的所有商业功能实现，包括支付集��、邮箱收集、SEO 优化和社交分享。

---

## 1. Stripe 支付集成

### 1.1 API 端点

**创建支付会话**
- **端点：** `POST /api/stripe/checkout`
- **功能：** 创建 Stripe Checkout Session 用于支付

**请求体：**
```typescript
{
  plan: "basic" | "premium",      // 套餐类型
  email?: string,                 // 用户邮箱（可选）
  metadata?: Record<string, string>  // 元数据（可选）
}
```

**成功响应：** `200 OK`
```typescript
{
  success: true,
  url: "https://checkout.stripe.com/...",
  sessionId: "cs_test_..."
}
```

**错误响应：**
```typescript
{
  success: false,
  error: "错误消息"
}
```

### 1.2 价格配置

�� `.env.local` 中配置：
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_BASIC=price_basic_plan_id
STRIPE_PRICE_PREMIUM=price_premium_plan_id
```

### 1.3 前端集成

```typescript
// 创建支付会话
const response = await fetch('/api/stripe/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    plan: 'premium',
    email: user.email
  })
});

const data = await response.json();

// 重定向到 Stripe Checkout
if (data.success) {
  window.location.href = data.url;
}
```

### 1.4 支付成功回调

支付成功后，Stripe 会重定向到：
```
https://yourdomain.com/?payment=success&session_id={CHECKOUT_SESSION_ID}
```

你可以在前端处理这个回调：
```typescript
const { searchParams } = new URL(window.location.href);
const payment = searchParams.get('payment');
const sessionId = searchParams.get('session_id');

if (payment === 'success' && sessionId) {
  // 支付成功，解锁高级功能
  unlockPremiumFeatures(sessionId);
}
```

---

## 2. 简历保存功能

### 2.1 API 端点

**保存简历**
- **端点：** `POST /api/resume/save`
- **功能：** 保存用户简历到数据库/存储

**请求体：**
```typescript
{
  email: string,              // 必需
  name: string,               // 必需
  resume: string,             // 必需
  template: "modern" | "classic" | "professional",
  experience?: any[],
  education?: any[],
  skills?: string[]
}
```

**成功响应：** `200 OK`
```typescript
{
  success: true,
  id: "res_1234567890_abc123",
  message: "Resume saved successfully",
  data: { ...resumeData }
}
```

### 2.2 检索简历

**获取用户简历**
- **端点：** `GET /api/resume/save?email=user@example.com`
- **功能：** 获取指定用户的所有简历

**响应：**
```typescript
{
  success: true,
  resumes: [...],
  count: 5
}
```

### 2.3 前端集成

```typescript
// 保存简历
const saveResume = async () => {
  const response = await fetch('/api/resume/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: user.email,
      name: user.name,
      resume: resumeText,
      template: selectedTemplate,
      experience: experienceList,
      education: educationList,
      skills: skills
    })
  });

  const data = await response.json();

  if (data.success) {
    // 显示成功消息
    addToast('Resume saved successfully!', 'success');

    // 保存简历 ID 以便后续检索
    localStorage.setItem('saved_resume_id', data.id);
  }
};
```

---

## 3. 邮箱收集功能

### 3.1 API 端点

**保存邮箱**
- **端点：** `POST /api/email/save`
- **功能：** 保存用户邮箱到营销列表

**请求体：**
```typescript
{
  email: string,
  source?: "popup" | "footer" | "checkout",
  metadata?: Record<string, any>
}
```

**成功响应：** `200 OK`
```typescript
{
  success: true,
  message: "Email saved successfully",
  alreadyExists: false
}
```

### 3.2 获取邮箱统计

**获取统计**
- **端点：** `GET /api/email/save`
- **功能：** 获取邮箱收集统计信息

**响应：**
```typescript
{
  success: true,
  stats: {
    total: 150,
    bySource: {
      "popup": 100,
      "footer": 30,
      "checkout": 20
    }
  }
}
```

### 3.3 前端集成

```typescript
// 保存邮箱
const saveEmail = async (email: string, source: string) => {
  const response = await fetch('/api/email/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      source,
      metadata: {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      }
    })
  });

  const data = await response.json();

  if (data.success) {
    if (data.alreadyExists) {
      addToast('Email already registered', 'success');
    } else {
      addToast('Thank you for subscribing!', 'success');
    }
  }
};
```

---

## 4. SEO 优化

### 4.1 已实现的 SEO 功能

#### 元标签
- ✅ **Title**：优化的页面标题
- ✅ **Description**：详细的页面描述
- ✅ **Keywords**：15+ 个相关关键词
- ✅ **Canonical URL**：规范化 URL

#### Open Graph 标签
- ✅ **og:title** - Open Graph 标题
- ✅ **og:description** - Open Graph 描述
- ✅ **og:url** - 页面 URL
- ✅ **og:image** - 分享图片 (1200x630)
- ✅ **og:type** - website
- ✅ **og:locale** - en_US
- ✅ **og:locale:alternate** - es_ES

#### Twitter Card
- ✅ **twitter:card** - summary_large_image
- ✅ **twitter:title** - Twitter 标题
- ✅ **twitter:description** - Twitter 描述
- ✅ **twitter:image** - Twitter 图片
- ✅ **twitter:site** - 网站账号
- ✅ **twitter:creator** - 创建者账号

#### 结构化数据（Schema.org）
- ✅ **WebApplication** 类型
- ✅ 名称、描述、URL
- ✅ 应用类别
- ✅ 价格信息
- ✅ 评分信息

#### 其他优化
- ✅ **robots.txt** 配置
- ✅ **sitemap.xml** 生成
- ✅ **DNS 预解析**（性能优化）
- ✅ **多语言支持**（en, es）
- ✅ **Canonical 链接**

### 4.2 SEO 文件

**Sitemap** - `app/sitemap.ts`
```typescript
export default function sitemap() {
  return [
    {
      url: 'https://www.warehouseworkerresume.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // 更多 URL...
  ];
}
```

**Robots.txt** - `app/robots.ts`
```typescript
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: 'https://www.warehouseworkerresume.com/sitemap.xml',
  };
}
```

---

## 5. 社交分享功能

### 5.1 社交分享组件

**位置：** `app/components/social/SocialShare.tsx`

**支持的平台：**
- ✅ LinkedIn
- ✅ Facebook
- ✅ Twitter
- ✅ 复制链接

### 5.2 分享功能

**LinkedIn 分享**
```typescript
const shareToLinkedIn = () => {
  const url = encodeURIComponent(pageUrl);
  const title = encodeURIComponent(shareTitle);
  window.open(
    `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    '_blank',
    'width=600,height=400'
  );
};
```

**Facebook 分享**
```typescript
const shareToFacebook = () => {
  const url = encodeURIComponent(pageUrl);
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    '_blank',
    'width=600,height=400'
  );
};
```

**Twitter 分享**
```typescript
const shareToTwitter = () => {
  const url = encodeURIComponent(pageUrl);
  const text = encodeURIComponent(shareTitle);
  window.open(
    `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
    '_blank',
    'width=600,height=400'
  );
};
```

**复制链接**
```typescript
const copyLink = async () => {
  await navigator.clipboard.writeText(pageUrl);
  addToast('Link copied to clipboard!', 'success');
};
```

### 5.3 前端使用

```typescript
import { SocialShare } from '@/components/social/SocialShare';

<SocialShare
  darkMode={darkMode}
  url="https://www.warehouseworkerresume.com"
  title="Check out this professional resume builder!"
/>
```

---

## 6. 环境变量配置

### 6.1 必需的环境变量

```bash
# OpenAI API
OPENAI_API_KEY=sk-your-key-here              # 必需
OPENAI_BASE_URL=https://api.openai.com/v1   # 可选
OPENAI_MODEL=gpt-4o-mini                     # 可选

# Stripe 支付
STRIPE_SECRET_KEY=sk_test_...                # 支付功能必需
STRIPE_PRICE_BASIC=price_...                 # 支付功能必需
STRIPE_PRICE_PREMIUM=price_...               # 支付功能必需

# 邮件服务
RESEND_API_KEY=re_...                        # 邮件功能可选

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MAX_FREE_RESUMES=1
```

### 6.2 环境变量验证

```typescript
import { validateEnv, featureFlags } from '@/lib/env';

// 验证环境变量
const validation = validateEnv();
if (!validation.valid) {
  console.error('Missing env vars:', validation.missing);
}

// 检查功能可用性
console.log('Stripe enabled:', featureFlags.stripe);
console.log('Email enabled:', featureFlags.email);
```

---

## 7. 前端集成示例

### 7.1 完整的支付流程

```typescript
// 1. 用户点击升级按钮
const handleUpgrade = async (plan: "basic" | "premium") => {
  // 显示加载状态
  setUpgrading(true);

  try {
    // 2. 创建 Stripe Checkout Session
    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plan,
        email: user.email
      })
    });

    const data = await response.json();

    // 3. 重定向到 Stripe Checkout
    if (data.success) {
      window.location.href = data.url;
    } else {
      addToast(data.error || 'Payment setup failed', 'error');
    }
  } catch (error) {
    addToast('Unable to process payment', 'error');
  } finally {
    setUpgrading(false);
  }
};

// 4. 处理支付成功回调
useEffect(() => {
  const { searchParams } = new URL(window.location.href);
  const payment = searchParams.get('payment');
  const sessionId = searchParams.get('session_id');

  if (payment === 'success' && sessionId) {
    // 验证 session 并解锁功能
    verifyPaymentSession(sessionId);
  }
}, []);
```

### 7.2 保存简历流程

```typescript
const handleSaveResume = async () => {
  try {
    // 1. 保存到数据库
    const response = await fetch('/api/resume/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        name: user.name,
        resume: resumeText,
        template: selectedTemplate,
        experience: experienceList,
        education: educationList,
        skills: skills
      })
    });

    const data = await response.json();

    if (data.success) {
      // 2. 保存到 localStorage
      localStorage.setItem('saved_resume_id', data.id);
      localStorage.setItem('last_saved_at', new Date().toISOString());

      // 3. 显示成功消息
      addToast('Resume saved successfully!', 'success');
    }
  } catch (error) {
    addToast('Failed to save resume', 'error');
  }
};
```

### 7.3 邮箱收集流程

```typescript
// 1. 弹窗收集（30秒后显示）
useEffect(() => {
  const hasShown = localStorage.getItem('email_shown');

  if (!hasShown) {
    const timer = setTimeout(() => {
      setShowEmailCapture(true);
      localStorage.setItem('email_shown', 'true');
    }, 30000);

    return () => clearTimeout(timer);
  }
}, []);

// 2. 提交邮箱
const handleEmailSubmit = async (email: string) => {
  const response = await fetch('/api/email/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      source: 'popup',
      metadata: {
        timestamp: new Date().toISOString()
      }
    })
  });

  const data = await response.json();

  if (data.success) {
    addToast('Thank you for subscribing!', 'success');
    setShowEmailCapture(false);
  }
};
```

---

## 8. 数据库集成建议

### 8.1 推荐的数据库选项

**Vercel Postgres** (推荐)
```bash
npm install @vercel/postgres
```

```typescript
import { sql } from '@vercel/postgres';

// 保存简历
await sql`
  INSERT INTO resumes (email, name, resume, template)
  VALUES (${email}, ${name}, ${resume}, ${template})
`;
```

**Supabase**
```bash
npm install @supabase/supabase-js
```

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 保存简历
const { data, error } = await supabase
  .from('resumes')
  .insert({ email, name, resume, template });
```

**MongoDB**
```bash
npm install mongodb
```

```typescript
import { MongoClient } from 'mongodb';

const client = new MongoClient(MONGODB_URI);
await client.connect();
const db = client.db('warehouse-resumes');

// 保存简历
await db.collection('resumes').insertOne({
  email,
  name,
  resume,
  template,
  createdAt: new Date()
});
```

### 8.2 数据库 Schema

**PostgreSQL 示例**
```sql
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  resume TEXT NOT NULL,
  template VARCHAR(20) NOT NULL,
  experience JSONB,
  education JSONB,
  skills TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  source VARCHAR(50),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_resumes_email ON resumes(email);
CREATE INDEX idx_emails_source ON emails(source);
```

---

## 9. 部署清单

### 9.1 Vercel 部署

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "feat: add payment and email features"
   git push origin main
   ```

2. **在 Vercel 导入项目**
   - 访问 vercel.com
   - 点击 "New Project"
   - 导入你的 GitHub 仓库

3. **配置环境变量**
   在 Vercel 项目设置中添加：
   ```
   OPENAI_API_KEY
   STRIPE_SECRET_KEY
   STRIPE_PRICE_BASIC
   STRIPE_PRICE_PREMIUM
   RESEND_API_KEY
   NEXT_PUBLIC_APP_URL
   ```

4. **部署**
   - Vercel 会自动部署
   - 等待部署完成

5. **配置域名**
   - 在 Vercel 项目设置中添加自定义域名
   - 更新 DNS 记录

### 9.2 Stripe 设置

1. **创建产品和价格**
   - 登录 Stripe Dashboard
   - 导航到 "Products"
   - 创建两个产品：
     - Basic Plan ($4.99)
     - Premium Plan ($9.99)

2. **获取价格 ID**
   - 复制每个产品的 Price ID
   - 添加到环境变量

3. **配置 Webhook**（可选）
   - 在 Stripe Dashboard 中创建 Webhook
   - 设置端点 URL: `https://yourdomain.com/api/stripe/webhook`
   - 选择事件：`checkout.session.completed`

---

## 10. 测试清单

### 10.1 功能测试

- [ ] 用户可以生成简历
- [ ] 用户可以选择不同的模板
- [ ] 用户可以下载 PDF
- [ ] 用户可以保存简历
- [ ] 用户可以提供邮箱
- [ ] 支付流程正常工作
- [ ] 社交分享按钮正常工作
- [ ] SEO 标签正确显示

### 10.2 性能测试

- [ ] 页面加载时间 < 3 秒
- [ ] 简历生成时间 < 10 秒
- [ ] PDF 下载时间 < 5 秒
- [ ] 移动端响应正常

### 10.3 安全测试

- [ ] API 密钥不暴露在客户端
- [ ] 输入验证正常工作
- [ ] SQL 注入防护（如果使用数据库）
- [ ] XSS 防护
- [ ] HTTPS 正常工作

---

## 11. 监控和分析

### 11.1 推荐工具

**错误追踪**
- Sentry (https://sentry.io)
- LogRocket (https://logrocket.com)

**分析**
- Google Analytics
- Vercel Analytics
- PostHog

**性能监控**
- Vercel Speed Insights
- Google PageSpeed Insights

### 11.2 关键指标

- 用户注册数
- 简历生成数
- PDF 下载数
- 支付转化率
- 邮箱收集数
- 社交分享次数

---

## 12. 故障排除

### 12.1 常见问题

**问题：支付失败**
- 检查 Stripe API 密钥是否正确
- 检查价格 ID 是否正确
- 查看 Stripe Dashboard 中的日志

**问题：邮箱无法保存**
- 检查邮箱格式验证
- 检查 API 端点是否可访问
- 查看浏览器控制台错误

**问题：SEO 标签不显示**
- 检查 metadata 是否正确导出
- 使用 Facebook Open Graph 调试工具
- 使用 Twitter Card Validator

**问题：社交分享不工作**
- 检查 URL 是否正确
- 检查是否有 og:image
- 尝试不同的平台测试

---

## 13. 下一步改进

### 13.1 功能改进

- [ ] 添加用户账户系统
- [ ] 添加简历编辑功能
- [ ] 添加多语言支持
- [ ] 添加更多模板
- [ ] 添加简历预览功能

### 13.2 营销改进

- [ ] 创建营销落地页
- [ ] 设置邮件营销活动
- [ ] 创建 SEO 博客内容
- [ ] 添加联盟计划
- [ ] 创建演示视频

### 13.3 技术改进

- [ ] 添加数据库持久化
- [ ] 添加 CDN 加速
- [ ] 添加缓存层
- [ ] 添加 A/B 测试
- [ ] 添加分析追踪

---

## 14. 联系支持

如有问题或需要帮助，请联系：
- GitHub: [项目地址]
- Email: support@warehouseworkerresume.com
- 文档: [在线文档]

---

**最后更新：** 2025-02-16
