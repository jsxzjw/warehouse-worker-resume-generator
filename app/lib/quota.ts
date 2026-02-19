// 用户配额管理
// 基于 JSON 文件存储用户使用次数

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const USER_DATA_FILE = path.join(DATA_DIR, 'users.json');

// ==================== 数据结构 ====================

export interface UserUsage {
  email: string;
  plan: 'free' | 'basic' | 'premium';
  monthlyResumes: number;
  currentMonth: string; // 格式: "2026-02"
  lastReset: string; // ISO 日期
  createdAt: string;
}

export interface PlanLimits {
  templates: number;
  monthlyResumes: number;
  hasWatermark: boolean;
  canDownloadPDF: boolean;
  mustLogin: boolean;
  prioritySupport: boolean;
}

// ==================== 套餐配置 ====================

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    templates: 1,
    monthlyResumes: 1, // 只能生成1份
    hasWatermark: true,
    canDownloadPDF: false, // 不能下载PDF
    mustLogin: true, // 必须登录
    prioritySupport: false
  },
  basic: {
    templates: 3,
    monthlyResumes: -1, // -1 表示无限
    hasWatermark: false,
    canDownloadPDF: true,
    mustLogin: false,
    prioritySupport: true
  },
  premium: {
    templates: 5,
    monthlyResumes: -1,
    hasWatermark: false,
    canDownloadPDF: true,
    mustLogin: false,
    prioritySupport: true
  }
};

// ==================== 数据读写 ====================

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getUserData(): Record<string, UserUsage> {
  ensureDataDir();
  if (!fs.existsSync(USER_DATA_FILE)) {
    return {};
  }
  try {
    const data = fs.readFileSync(USER_DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

function saveUserData(data: Record<string, UserUsage>) {
  ensureDataDir();
  fs.writeFileSync(USER_DATA_FILE, JSON.stringify(data, null, 2));
}

// ==================== 核心功能 ====================

/**
 * 获取用户使用记录
 */
export function getUserUsage(email: string): UserUsage {
  const users = getUserData();
  const currentMonth = new Date().toISOString().slice(0, 7); // "2026-02"

  if (!users[email]) {
    // 新用户，创建默认记录
    const newUser: UserUsage = {
      email,
      plan: 'free',
      monthlyResumes: 0,
      currentMonth,
      lastReset: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    users[email] = newUser;
    saveUserData(users);
    return newUser;
  }

  const user = users[email];

  // 检查是否需要重置月度计数
  if (user.currentMonth !== currentMonth) {
    user.monthlyResumes = 0;
    user.currentMonth = currentMonth;
    user.lastReset = new Date().toISOString();
    saveUserData(users);
  }

  return user;
}

/**
 * 检查用户是否可以生成简历
 */
export function canGenerateResume(email: string): {
  allowed: boolean;
  reason?: string;
  remaining?: number;
} {
  const user = getUserUsage(email);
  const limits = PLAN_LIMITS[user.plan];

  // Basic 和 Premium 用户无限制
  if (limits.monthlyResumes === -1) {
    return { allowed: true, remaining: -1 };
  }

  const remaining = limits.monthlyResumes - user.monthlyResumes;

  if (remaining <= 0) {
    return {
      allowed: false,
      reason: 'monthly_limit_exceeded',
      remaining: 0
    };
  }

  return { allowed: true, remaining };
}

/**
 * 记录简历生成
 */
export function recordResumeGeneration(email: string): {
  success: boolean;
  remaining?: number;
  plan?: string;
  hasWatermark?: boolean;
  canDownloadPDF?: boolean;
  mustLogin?: boolean;
} {
  const user = getUserUsage(email);
  const limits = PLAN_LIMITS[user.plan];

  // Basic 和 Premium 用户不需要计数
  if (limits.monthlyResumes === -1) {
    return {
      success: true,
      remaining: -1,
      plan: user.plan,
      hasWatermark: limits.hasWatermark,
      canDownloadPDF: limits.canDownloadPDF,
      mustLogin: limits.mustLogin
    };
  }

  // 检查是否超过限制
  if (user.monthlyResumes >= limits.monthlyResumes) {
    return { success: false };
  }

  // 增加计数
  user.monthlyResumes += 1;

  // 保存到文件
  const users = getUserData();
  users[email] = user;
  saveUserData(users);

  return {
    success: true,
    remaining: limits.monthlyResumes - user.monthlyResumes,
    plan: user.plan,
    hasWatermark: limits.hasWatermark,
    canDownloadPDF: limits.canDownloadPDF,
    mustLogin: limits.mustLogin
  };
}

/**
 * 获取用户套餐信息
 */
export function getUserPlan(email: string): {
  plan: string;
  limits: PlanLimits;
  usage: UserUsage;
} {
  const user = getUserUsage(email);
  return {
    plan: user.plan,
    limits: PLAN_LIMITS[user.plan],
    usage: user
  };
}

/**
 * 升级用户套餐
 */
export function upgradeUserPlan(email: string, newPlan: 'basic' | 'premium'): boolean {
  const users = getUserData();

  if (!users[email]) {
    return false;
  }

  users[email].plan = newPlan;
  saveUserData(users);
  return true;
}

/**
 * 获取剩余次数（用于前端显示）
 */
export function getRemainingResumes(email: string): number {
  const user = getUserUsage(email);
  const limits = PLAN_LIMITS[user.plan];

  if (limits.monthlyResumes === -1) {
    return -1; // 无限
  }

  return Math.max(0, limits.monthlyResumes - user.monthlyResumes);
}
