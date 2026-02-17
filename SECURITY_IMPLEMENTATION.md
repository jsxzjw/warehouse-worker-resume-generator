# 安全实施计划文档
生成时间: 2026-02-16
最后更新: 2026-02-16（已完成所有高优先级安全措施）

## 📋 当前安全状态

**✅ 安全等级**: 生产环境就绪（需要配置环境变量）

### ✅ 已实施的安全措施

#### 1. 环境变量管理
- **文件**: [app/lib/env.ts](app/lib/env.ts), [.env.example](.env.example)
- **状态**: ✅ 完成
- **详情**:
  - 管理员凭证从环境变量读取
  - JWT 密钥从环境变量读取
  - 提供配置模板和示例

#### 2. JWT Token 认证 ✅
- **文件**: [app/lib/auth.ts](app/lib/auth.ts)
- **状态**: ✅ 完成
- **实施的功能**:
  - ✅ JWT Token 生成和签名（HS256 算法）
  - ✅ JWT Token 验证（签名、过期时间、签发者、受众）
  - ✅ Token 自动过期（默认 24 小时）
  - ✅ 防止 Token 伪造
  - ✅ ���准 JWT 实现（使用 `jsonwebtoken` 库）

#### 3. 密码加密 (bcrypt) ✅
- **文件**: [app/lib/auth.ts](app/lib/auth.ts), [app/api/admin/login/route.ts](app/api/admin/login/route.ts)
- **状态**: ✅ 完成
- **实施的功能**:
  - ✅ bcrypt 密码哈希（salt rounds = 10）
  - ✅ 密码验证（`verifyPassword` 函数）
  - ✅ 自动检测哈希/明文密码
  - ✅ 开发环境兼容（支持明文密码）
  - ✅ 生产环境警告（检测明文密码时）
  - ✅ 密码哈希生成工具（GET `/api/admin/login?generate-hash=true`）

#### 4. HTTPS 强制 ✅
- **文件**: [next.config.ts](next.config.ts)
- **状态**: ✅ 完成
- **实施的功能**:
  - ✅ HSTS (HTTP Strict Transport Security) 响应头
  - ✅ `max-age=63072000` (2 年)
  - ✅ `includeSubDomains` - 包含所有子域名
  - ✅ `preload` - 允许浏览器预加载 HTTPS

#### 5. 安全 Cookie 设置 ✅
- **状态**: ✅ 完成
- **详情**:
  - ✅ `HttpOnly` - 防止 XSS 攻击
  - ✅ `Secure` - 仅通过 HTTPS 传输
  - ✅ `SameSite=Strict` - 防止 CSRF 攻击
  - ✅ `Max-Age=86400` - 24 小时过期

#### 6. 安全响应头 ✅
- **文件**: [next.config.ts](next.config.ts), [app/lib/auth.ts](app/lib/auth.ts)
- **状态**: ✅ 完成
- **包含的响应头**:
  ```typescript
  {
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    "X-Frame-Options": "SAMEORIGIN",
    "X-Content-Type-Options": "nosniff",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "X-DNS-Prefetch-Control": "on"
  }
  ```

#### 7. 统一认证中间件 ✅
- **文件**: [app/lib/auth.ts](app/lib/auth.ts)
- **状态**: ✅ 完成
- **功能**:
  - ✅ `verifyAdminAuth()` - 验证管理员身份
  - ✅ `verifyAdminToken()` - 验证 JWT Token
  - ✅ `createAuthResponse()` - 创建认证失败响应
  - ✅ 支持多种 Token 提取方式（Header + Cookie）

#### 8. API 路由保护 ✅
- **文件**:
  - [app/api/admin/login/route.ts](app/api/admin/login/route.ts)
  - [app/api/admin/verify/route.ts](app/api/admin/verify/route.ts)
- **状态**: ✅ 完成
- **详情**:
  - ✅ JWT Token 认证
  - ✅ 密码哈希验证（自动检测）
  - ✅ 安全响应头
  - ✅ 错误处理
  - ✅ 日志记录（不记录敏感信息）

---

## 🔧 生产环境配置指南

### 第 1 步：生成强密码哈希

**方法 1：使用 API（开发环境）**
```bash
# 访问以下 URL 生成密码哈希
http://localhost:3000/api/admin/login?generate-hash=true&password=your_secure_password
```

**方法 2：使用 Node.js 脚本**
```bash
node -e "
const bcrypt = require('bcrypt');
bcrypt.hash('your_secure_password', 10).then(hash => console.log(hash));
"
```

**方法 3：使用在线工具**
- 访问：https://bcrypt-generator.com/
- 输入密码，选择 cost factor = 10
- 复制生成的哈希

### 第 2 步：生成 JWT Secret

**方法 1：使用 Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**方法 2：使用 OpenSSL**
```bash
openssl rand -hex 64
```

### 第 3 步：配置环境变量

创建或更新 `.env.local` 文件：

```env
# ==================== Admin Credentials ====================
ADMIN_EMAIL=admin@warehouseworkerresume.com
# 使用生成的 bcrypt 哈希（不是明文密码！）
ADMIN_PASSWORD_HASH=$2b$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ

# ==================== JWT Configuration ====================
# 使用生成的强随机字符串（至少 64 字符）
JWT_SECRET=your-generated-secret-key-min-64-characters-long-and-random
JWT_EXPIRES_IN=24h

# ==================== Other Configuration ====================
NODE_ENV=production
OPENAI_API_KEY=sk-your-openai-api-key
# ... 其他配置
```

### 第 4 步：验证配置

启动应用后，检查日志：

**✅ 成功的日志（使用哈希密码）**:
```
[Admin Login] Using bcrypt password verification
[Admin Login] Successful: {
  adminId: "admin_001",
  email: "admin@warehouseworkerresume.com",
  passwordType: "hashed"
}
```

**⚠️ 警告日志（使用明文密码 - 生产环境不应该看到）**:
```
⚠️  SECURITY WARNING: Plain text password in production!
[Admin Login] Using plain text password comparison (development mode)
```

---

## 🎯 安全特性总结

### 🔐 认证和授权
- ✅ JWT Token（防伪造、自动过期）
- ✅ bcrypt 密码哈希（不可逆、加盐）
- ✅ 双重 Token 验证（Header + Cookie）
- ✅ 严格的受众和签发者验证

### 🛡️ 网络安全
- ✅ HTTPS 强制（HSTS）
- ✅ 安全 Cookie（HttpOnly, Secure, SameSite）
- ✅ CSRF 防护
- ✅ XSS 防护

### 📤 数据保护
- ✅ 密码不返回到前端
- ✅ Token 不在 URL 中暴露
- ✅ 日志不记录敏感信息
- ✅ 错误消息不泄露系统信息

### 🔒 响应头保护
- ✅ `Strict-Transport-Security` - 强制 HTTPS
- ✅ `X-Frame-Options` - 防止点击劫持
- ✅ `X-Content-Type-Options` - 防止 MIME 嗅探
- ✅ `X-XSS-Protection` - XSS 过滤器
- ✅ `Referrer-Policy` - 控制 Referrer 信息
- ✅ `Permissions-Policy` - 限制浏览器功能

---

## 🧪 测试安全功能

### 测试 JWT Token 验证

**1. 正常登录（应该成功）**:
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@warehouseworkerresume.com","password":"your_password"}'
```

**2. 验证 Token（应该成功）**:
```bash
curl -X GET http://localhost:3000/api/admin/verify \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**3. 过期 Token（应该失败）**:
```bash
# 等待 24 小时后，或修改 JWT_EXPIRES_IN 为 "1s"
curl -X GET http://localhost:3000/api/admin/verify \
  -H "Authorization: Bearer EXPIRED_TOKEN"
# 响应: {"success":true,"valid":false,"error":"Token has expired"}
```

**4. 无效 Token（应该失败）**:
```bash
curl -X GET http://localhost:3000/api/admin/verify \
  -H "Authorization: Bearer invalid_token"
# 响应: {"success":true,"valid":false,"error":"Invalid token signature"}
```

### 测试密码哈希

**1. 使用哈希密码登录（推荐）**:
```bash
# .env.local
ADMIN_PASSWORD_HASH=$2b$10$...
```

**2. 开发环境明文密码（仅开发）**:
```bash
# .env.local
ADMIN_PASSWORD=admin123456

# 日志会显示:
# [Admin Login] Using plain text password comparison (development mode)
```

---

## 📊 安全检查清单

### ✅ 已完成（生产环境就绪）
- [x] JWT Token 认证
- [x] bcrypt 密码哈希
- [x] HTTPS 强制（HSTS）
- [x] 安全 Cookie 设置
- [x] 安全响应头
- [x] 统一认证中间件
- [x] API 路由保护
- [x] 环境变量隔离

### 🔧 生产环境配置（必须完成）
- [ ] 生成并配置 `ADMIN_PASSWORD_HASH`
- [ ] 生成并配置 `JWT_SECRET`（至少 64 字符）
- [ ] 设置 `NODE_ENV=production`
- [ ] 更新管理员邮箱和密码
- [ ] 配置其他必需的环境变量（API 密钥等）

### 🟡 可选增强（推荐）
- [ ] 速率限制（防止暴力破解）
- [ ] 双因素认证（2FA）
- [ ] 会话管理（Token 撤销）
- [ ] 审计日志（详细的登录日志）
- [ ] IP 白名单（限制管理员访问）

---

## 📚 安全最佳实践

### 密码安全
- ✅ 使用 bcrypt 哈希（salt rounds = 10）
- ✅ 不在日志中记录密码
- ✅ 不在错误消息中暴露密码信息
- ✅ 定期更新管理员密码

### Token 管理
- ✅ JWT Token 自动过期（24 小时）
- ✅ 使用强密钥签名（至少 64 字符）
- ✅ 验证签发者和受众
- ✅ 不在 URL 中传递 Token

### 环境配置
- ✅ 生产环境不使用默认密钥
- ✅ `.env.local` 不提交到 Git
- ✅ 敏感配置使用环境变量
- ✅ 不同环境使用不同配置

### 监控和日志
- ✅ 记录登录成功/失败
- ✅ 不记录敏感信息
- ✅ 检测异常登录行为
- ✅ 定期审计安全日志

---

## 🚨 常见安全问题

### Q1: 如何生成密码哈希？
**A**: 使用以下任一方法：
1. 访问 `GET /api/admin/login?generate-hash=true&password=your_password`（仅开发环境）
2. 使用 Node.js: `require('bcrypt').hash('password', 10)`
3. 使用在线工具: https://bcrypt-generator.com/

### Q2: 如何更新 JWT Secret？
**A**:
1. 生成新的 secret: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
2. 更新 `.env.local`: `JWT_SECRET=新的_secret`
3. 重启应用
4. 所有现有的 Token 将失效，用户需要重新登录

### Q3: 生产环境是否仍支持明文密码？
**A**: 不建议。系统会检测并显示警告：
```
⚠️  SECURITY WARNING: Plain text password in production!
```
强烈建议使用 `ADMIN_PASSWORD_HASH` 而不是 `ADMIN_PASSWORD`。

### Q4: Token 过期时间是多少？
**A**: 默认 24 小时。可以在 `.env.local` 中配置：
```env
JWT_EXPIRES_IN=24h  # 或 "7d", "12h", "30m" 等
```

### Q5: 如何强制所有用户重新登录？
**A**:
1. 更改 `JWT_SECRET`
2. 重启应用
3. 所有现有 Token 将失效

---

## 📞 安全问题报告

如果您发现任何安全问题，请：
1. 不要在公开问题追踪器中报告
2. 通过私密渠道报告给维护者
3. 提供详细的重现步骤
4. 等待确认后再公开披露

---

## 📝 版本历史

- **v1.0.0** (2026-02-16): 初始安全实施
  - ✅ JWT Token 认证
  - ✅ bcrypt 密码哈希
  - ✅ HTTPS 强制
  - ✅ 安全响应头
  - ✅ 统一认证中间件

---

**最后更新**: 2026-02-16
**维护者**: Claude Code
**状态**: ✅ 生产环境就绪（需要配置环境变量）
