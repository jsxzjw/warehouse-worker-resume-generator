# 后端 API 优化文档

## 概述

本文档说明了仓库工人简历生成器的后端 API 架构、优化和最佳实践。

---

## 环境变量管理

### 配置文件

所有环境变量集中管理在以下文件：
- `.env.example` - 环境变量模板
- `.env.local` - 本地开发配置（不提交到 Git）
- `app/lib/env.ts` - 环境变量类型定义和验证

### 必需的环境变量

```bash
# OpenAI API
OPENAI_API_KEY=sk-your-key-here              # 必需
OPENAI_BASE_URL=https://api.openai.com/v1   # 可选（默认 OpenAI）
OPENAI_MODEL=gpt-4o-mini                     # 可选（默认 gpt-4o-mini）
OPENAI_TEMPERATURE=0.7                       # 可选（默认 0.7）
OPENAI_MAX_TOKENS=2000                       # 可选（默认 2000）
```

### 可选的环境变量

```bash
# Stripe 支付
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_BASIC=price_...
STRIPE_PRICE_PREMIUM=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

# 邮件服务
RESEND_API_KEY=re_...

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MAX_FREE_RESUMES=1
```

---

## API 端点

### 1. 生成简历 API

**端点：** `POST /api/generate`

**请求体：**
```typescript
{
  prompt: string,              // 用户信息（必需）
  template?: "modern" | "classic" | "professional"  // 可选，默认 modern
}
```

**成功响应：** `200 OK`
```typescript
{
  resume: string,              // 生成的简历文本
  metadata: {
    model: string,             // 使用的 AI 模型
    tokensUsed: number,        // 使用的 token 数量
    template: string          // 使用的模板
  }
}
```

**错误响应：**
```typescript
{
  code: ErrorCode,             // 错误代码
  message: string,             // 用户友好的错误消息
  details?: string,            // 详细错误信息
  retryable: boolean,          // 是否可重试
  timestamp: string,           // ISO 8601 时间戳
  requestId?: string           // 请求 ID
}
```

---

## OpenAI API 优化

### 1. 模板特定关键词优化

每个模板都有特定的关键词和风格：

#### Modern 模板
- **关键词：** results-driven, innovative, dynamic, forward-thinking, metrics-oriented
- **风格：** 强调创新、效率指标、现代仓库技术

#### Classic 模板
- **关键词：** dependable, experienced, dedicated, conscientious, thorough
- **风格：** 强调可靠性、经验、传统仓库运营

#### Professional 模板
- **关键词：** strategic, leadership, managerial, supervisory, analytical
- **风格：** 强调领导力、流程改进、管理成就

### 2. 优化的提示词结构

```
基础提示词
  + 模板优化说明
    + 关键词列表
      + 用户信息
```

### 3. AI 参数优化

```typescript
{
  temperature: 0.7,           // 创造性平衡
  max_tokens: 2000,           // 控制输出长度
  presence_penalty: 0.3,      // 鼓励多样性
  frequency_penalty: 0.3,     // 减少重复
  timeout: 60000,            // 60 秒超时
  maxRetries: 2              // 自动重试
}
```

---

## 错误处理

### 错误代码

| 代码 | HTTP 状态 | 描述 | 可重试 |
|------|----------|------|--------|
| `MISSING_API_KEY` | 500 | API 密钥未配置 | ❌ |
| `MISSING_PROMPT` | 400 | 缺少用户输入 | ❌ |
| `INVALID_REQUEST` | 400 | 请求格式错误 | ❌ |
| `UNAUTHORIZED` | 401 | 认证失败 | ❌ |
| `TIMEOUT` | 408 | 请求超时 | ✅ |
| `RATE_LIMIT` | 429 | 速率限制 | ✅ |
| `INSUFFICIENT_QUOTA` | 402 | 余额不足 | ❌ |
| `NETWORK_ERROR` | 503 | 网络错误 | ✅ |
| `SERVICE_UNAVAILABLE` | 503 | 服务不可用 | ✅ |
| `UNKNOWN` | 500 | 未知错误 | ✅ |

### 错误响应示例

```json
{
  "code": "RATE_LIMIT",
  "message": "Too many requests",
  "details": "Please wait a moment before trying again.",
  "retryable": true,
  "timestamp": "2025-02-16T12:34:56.789Z",
  "requestId": "req_1234567890_abc123"
}
```

---

## 重试逻辑

### 自动重试条件

以下错误会触发自动重试：
- 网络错误（ECONNRESET, ECONNREFUSED）
- 超时错误
- 速率限制（429）

### 重试配置

```typescript
{
  maxRetries: 2,              // 最多重试 2 次
  initialDelay: 1000,         // 初始延迟 1 秒
  maxDelay: 5000,            // 最大延迟 5 秒
  timeoutMs: 60000           // 60 秒超时
}
```

### 退避策略

使用指数退避算法：
```
延迟 = min(初始延迟 × 2^(重试次数), 最大延迟)
```

---

## 最佳实践

### 1. 前端集成

```typescript
// 发送请求时包含模板
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: userPrompt,
    template: selectedTemplate  // modern | classic | professional
  })
});

// 处理响应
const data = await response.json();

if (data.resume) {
  // 成功 - 使用生成的简历
  console.log('Tokens used:', data.metadata.tokensUsed);
} else {
  // 错误处理
  console.error('Error:', data.message);
  if (data.retryable) {
    // 显示重试按钮
  }
}
```

### 2. 环境变量验证

```typescript
import { validateEnv, featureFlags } from '@/lib/env';

// 启动时验证环境变量
const validation = validateEnv();
if (!validation.valid) {
  console.error('Missing env vars:', validation.missing);
}

// 检查功能可用性
if (!featureFlags.stripe) {
  console.warn('Stripe payment disabled');
}
```

### 3. 错误日志

```typescript
// 在生产环境中集成日志服务
if (process.env.NODE_ENV === 'production') {
  // Sentry, DataDog, 等
}
```

---

## 安全考虑

### 1. API 密钥管理

- ✅ 使用环境变量
- ✅ 永不提交 `.env.local` 到 Git
- ✅ 使用不同的测试/生产密钥
- ❌ 不要在客户端代码中暴露密钥

### 2. 速率限制

- 前端：限制按钮点击频率
- 后端：API 提供商的速率限制
- 用户：每个用户的最大免费简历数量

### 3. 输入验证

- 验证所有用户输入
- 限制 prompt 长度（建议 < 5000 字符）
- 清理特殊字符

---

## 性能优化

### 1. 缓存策略

```typescript
// 可以添加缓存层（Redis）
const cacheKey = `resume:${hash(prompt)}:${template}`;
```

### 2. Token 使用监控

```typescript
// 跟踪每个用户的 token 使用
const tokensUsed = data.metadata.tokensUsed;
await updateUserTokenUsage(userId, tokensUsed);
```

### 3. 并发请求

```typescript
// 限制并发请求数
import pLimit from 'p-limit';
const limit = pLimit(5); // 最多 5 个并发请求
```

---

## 部署清单

### Vercel 部署

1. 在 Vercel 项目设置中添加环境变量
2. 确保所有必需的变量都已设置
3. 部署后测试 API 端点

### 环境变量检查

```bash
# 本地开发
curl http://localhost:3000/api/generate

# 生产环境
curl https://your-domain.com/api/generate
```

---

## 故障排除

### 问题：API 调用失败

1. 检查环境变量是否正确设置
2. 验证 API 密钥是否有效
3. 查看浏览器控制台的错误消息

### 问题：生成质量差

1. 尝试调整 `OPENAI_TEMPERATURE`
2. 尝试使用不同的 `OPENAI_MODEL`
3. 检查用户输入是否完整

### 问题：速率限制

1. 实现 API 调用排队
2. 增加重试延迟
3. 考虑升级 API 计划

---

## API 更新日志

### v2.0.0 (2025-02-16)

**新增：**
- ✅ 模板特定关键词优化
- ✅ 环境变量统一管理
- ✅ 改进的错误处理
- ✅ 自动重试逻辑
- ✅ Token 使用追踪
- ✅ 请求 ID 生成

**改进：**
- ✅ 更友好的错误消息
- ✅ 更详细的元数据
- ✅ 更好的日志记录
- ✅ 类型安全的配置

---

## 联系支持

如有问题或需要帮助，请联系：
- GitHub Issues: [项目地址]
- Email: support@warehouseworkerresume.com
