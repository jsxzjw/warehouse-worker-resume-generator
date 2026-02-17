"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "../components/AdminLayout";

interface DashboardStats {
  totalBlogPosts: number;
  totalUsers: number;
  totalResumesCreated: number;
  totalPageViews: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalBlogPosts: 0,
    totalUsers: 0,
    totalResumesCreated: 0,
    totalPageViews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 验证管理员身份
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    // TODO: 从 API 获取统计数据
    // 临时使用模拟数据
    setStats({
      totalBlogPosts: 15,
      totalUsers: 1250,
      totalResumesCreated: 5430,
      totalPageViews: 28500,
    });
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-600">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Message */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Welcome to Admin Dashboard
          </h2>
          <p className="text-slate-600">
            Here's what's happening with your website today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Blog Posts */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                +12%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">
              {stats.totalBlogPosts}
            </h3>
            <p className="text-sm text-slate-600">Total Blog Posts</p>
          </div>

          {/* Total Users */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                +8%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">
              {stats.totalUsers.toLocaleString()}
            </h3>
            <p className="text-sm text-slate-600">Total Users</p>
          </div>

          {/* Total Resumes Created */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📄</span>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                +23%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">
              {stats.totalResumesCreated.toLocaleString()}
            </h3>
            <p className="text-sm text-slate-600">Resumes Created</p>
          </div>

          {/* Total Page Views */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👁️</span>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                +15%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">
              {stats.totalPageViews.toLocaleString()}
            </h3>
            <p className="text-sm text-slate-600">Page Views</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Create New Blog Post */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">✍️</span>
              <h3 className="text-lg font-bold">Create New Article</h3>
            </div>
            <p className="text-blue-100 text-sm mb-4">
              Write and publish a new blog post
            </p>
            <button
              onClick={() => router.push("/admin/blog/new")}
              className="w-full bg-white text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Create Article
            </button>
          </div>

          {/* View Users */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">👥</span>
              <h3 className="text-lg font-bold">Manage Users</h3>
            </div>
            <p className="text-green-100 text-sm mb-4">
              View and manage website users
            </p>
            <button
              onClick={() => router.push("/admin/users")}
              className="w-full bg-white text-green-600 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              View Users
            </button>
          </div>

          {/* Site Settings */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">⚙️</span>
              <h3 className="text-lg font-bold">Site Settings</h3>
            </div>
            <p className="text-purple-100 text-sm mb-4">
              Configure SEO and featured content
            </p>
            <button
              onClick={() => router.push("/admin/settings")}
              className="w-full bg-white text-purple-600 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
            >
              Settings
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    New blog post published: "How to Write a Winning Warehouse Worker Resume in 2025"
                  </p>
                  <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2 bg-green-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    15 new users registered today
                  </p>
                  <p className="text-xs text-slate-500 mt-1">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2 bg-purple-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    125 resumes created in the last 24 hours
                  </p>
                  <p className="text-xs text-slate-500 mt-1">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
