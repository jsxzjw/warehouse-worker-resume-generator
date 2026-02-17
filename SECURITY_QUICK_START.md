# 🔐 安全设置快速指南

## ✅ 已完成的安全措施

所有高优先级安全措施已实施完成：

1. ✅ **JWT Token 认证** - 使用标准 JWT，防止令牌伪造
2. ✅ **密码加密 (bcrypt)** - 不可逆密码哈希，salt rounds = 10
3. ✅ **HTTPS 强制** - HSTS 响应头，强制 2 年 HTTPS
4. ✅ **安全 Cookie** - HttpOnly, Secure, SameSite=Strict
5. ✅ **安全响应头** - 完整的安全响应头配置

---

## 🚀 生产环境配置（3 步）

### 步骤 1：生成密码哈希

**选择一种方法**：

**A. 使用 API（开发环境）**
```bash
# 在浏览器访问
http://localhost:3000/api/admin/login?generate-hash=true&password=YourSecurePassword123
```

**B. 使用 Node.js**
```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('YourSecurePassword123', 10).then(h => console.log(h));"
```

### 步骤 2：生成 JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 步骤 3：配置环境变量

更新 `.env.local`：

```env
# 管理员凭证
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD_HASH=$2b$10$从步骤1复制的哈希

# JWT 配置
JWT_SECRET=从步骤2生成的密钥
JWT_EXPIRES_IN=24h

# 生产环境
NODE_ENV=production
```

**完成！重启应用即可使用。**

---

## 📝 重要说明

- ⚠️ **不要**使用默认的 `JWT_SECRET`（生产环境）
- ⚠️ **不要**在 `.env.local` 中使用明文 `ADMIN_PASSWORD`（生产环境）
- ✅ **使用** `ADMIN_PASSWORD_HASH` 替代
- ✅ **使用**强随机密钥（至少 64 字符）

---

## 🧪 验证配置

启动应用后，检查控制台日志：

**✅ 正确配置（使用哈希密码）**：
```
[Admin Login] Using bcrypt password verification
```

**⚠️ 警告（使用明文密码）**：
```
⚠️  SECURITY WARNING: Plain text password in production!
```

---

## 📚 详细文档

查看完整的安全实施文档：[SECURITY_IMPLEMENTATION.md](SECURITY_IMPLEMENTATION.md)

---

**当前状态**: ✅ 生产环境就绪（需配置环境变量）
**最后更新**: 2026-02-16
