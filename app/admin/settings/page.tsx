"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "../components/AdminLayout";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [seoSettings, setSeoSettings] = useState({
    siteName: "Warehouse Worker Resume Generator",
    siteDescription: "Create professional warehouse worker resumes in minutes with our AI-powered builder",
    siteKeywords: "warehouse resume, forklift operator resume, warehouse worker resume",
    ogImage: "/og-image.png",
    twitterHandle: "@warehouseworker",
  });

  const [featuredPosts, setFeaturedPosts] = useState<number[]>([1, 2]);

  useEffect(() => {
    // 验证管理员身份
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    // TODO: 从 API 获取设置
  }, [router]);

  const handleSaveSeo = async () => {
    setLoading(true);
    try {
      // TODO: 调用 API 保存设置
      console.log("Saving SEO settings:", seoSettings);
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("SEO settings saved successfully!");
    } catch (error) {
      alert("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const allPosts = [
    { id: 1, title: "How to Write a Winning Warehouse Worker Resume in 2025" },
    { id: 2, title: "Top 10 Skills Every Warehouse Worker Should List" },
    { id: 3, title: "Warehouse Worker Interview Questions and Best Answers" },
  ];

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Site Settings</h2>
          <p className="text-slate-600">Configure your website settings and SEO</p>
        </div>

        {/* SEO Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span>🔍</span> SEO Settings
          </h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="siteName" className="block text-sm font-semibold text-slate-700 mb-2">
                Site Name
              </label>
              <input
                id="siteName"
                type="text"
                value={seoSettings.siteName}
                onChange={(e) => setSeoSettings({ ...seoSettings, siteName: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="siteDescription" className="block text-sm font-semibold text-slate-700 mb-2">
                Site Description
              </label>
              <textarea
                id="siteDescription"
                value={seoSettings.siteDescription}
                onChange={(e) => setSeoSettings({ ...seoSettings, siteDescription: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="siteKeywords" className="block text-sm font-semibold text-slate-700 mb-2">
                Site Keywords (comma-separated)
              </label>
              <input
                id="siteKeywords"
                type="text"
                value={seoSettings.siteKeywords}
                onChange={(e) => setSeoSettings({ ...seoSettings, siteKeywords: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ogImage" className="block text-sm font-semibold text-slate-700 mb-2">
                  OG Image Path
                </label>
                <input
                  id="ogImage"
                  type="text"
                  value={seoSettings.ogImage}
                  onChange={(e) => setSeoSettings({ ...seoSettings, ogImage: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="twitterHandle" className="block text-sm font-semibold text-slate-700 mb-2">
                  Twitter Handle
                </label>
                <input
                  id="twitterHandle"
                  type="text"
                  value={seoSettings.twitterHandle}
                  onChange={(e) => setSeoSettings({ ...seoSettings, twitterHandle: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveSeo}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save SEO Settings"}
              </button>
            </div>
          </div>
        </div>

        {/* Homepage Featured Articles */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span>⭐</span> Homepage Featured Articles
          </h3>

          <p className="text-sm text-slate-600 mb-4">
            Select articles to feature on the homepage. These will appear in the blog section.
          </p>

          <div className="space-y-3">
            {allPosts.map((post) => (
              <label
                key={post.id}
                className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                  featuredPosts.includes(post.id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={featuredPosts.includes(post.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFeaturedPosts([...featuredPosts, post.id]);
                    } else {
                      setFeaturedPosts(featuredPosts.filter(id => id !== post.id));
                    }
                  }}
                  className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="flex-1 text-sm font-medium text-slate-900">{post.title}</span>
                {featuredPosts.includes(post.id) && (
                  <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    Featured
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Analytics Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span>📊</span> Analytics & Tracking
          </h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="googleAnalytics" className="block text-sm font-semibold text-slate-700 mb-2">
                Google Analytics ID
              </label>
              <input
                id="googleAnalytics"
                type="text"
                placeholder="G-XXXXXXXXXX"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="gscVerification" className="block text-sm font-semibold text-slate-700 mb-2">
                Google Search Console Verification
              </label>
              <input
                id="gscVerification"
                type="text"
                placeholder="Verification meta tag code"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
            </div>
          </div>
        </div>

        {/* Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">Settings Notice</h3>
              <p className="text-sm text-yellow-700">
                Some settings may require a rebuild or redeploy to take effect. Make sure to test changes after saving.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
