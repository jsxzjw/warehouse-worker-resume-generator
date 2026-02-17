// 仓库工人简历生成器 - 自动安装和部署脚本
// 使用方法：node install.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname);

console.log('🚀 开始安装和部署...\n');

// 1. 安装依赖
console.log('📦 安装依赖包...');
try {
  execSync('npm install', { cwd: rootDir, stdio: 'inherit' });
  console.log('✅ 依赖安装完成\n');
} catch (error) {
  console.error('❌ 依赖安装失败:', error.message);
  process.exit(1);
}

// 2. 创建必要的目录
const dirs = [
  'app/components/wizard',
  'app/components/wizard/steps',
  'app/components/templates',
  'app/components/pricing',
  'app/components/social',
  'app/components/email',
  'app/components/ui',
  'app/api/email',
  'app/api/stripe',
  'app/config',
  'app/hooks',
  'app/store',
  'app/types',
  'app/utils',
  'app/i18n/locales',
  'app/templates/email'
];

dirs.forEach(dir => {
  const fullPath = path.join(rootDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ 创建目录: ${dir}`);
  }
});

console.log('');

// 3. 检查环境变量文件
const envExamplePath = path.join(rootDir, '.env.example');
const envPath = path.join(rootDir, '.env.local');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  console.log('📝 复制环境变量示例文件...');
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✅ 已创建 .env.local 文件');
  console.log('⚠️  请配置你的 API Keys:\n');
  console.log('   - OPENAI_API_KEY: 你的 OpenAI API Key');
  console.log('   - STRIPE_SECRET_KEY: Stripe 密钥');
  console.log('   - STRIPE_PRICE_BASIC: Stripe Basic 价格 ID');
  console.log('   - STRIPE_PRICE_PREMIUM: Stripe Premium 价格 ID\n');
  console.log('   然后运行: npm run dev\n');
}

console.log('🎉 安装完成！');
console.log('\n📝 下一步:');
console.log('   1. 配置 .env.local 文件');
console.log('   2. 运行: npm run dev');
console.log('   3. 访问: http://localhost:3000\n');
