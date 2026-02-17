"use client";

import { usePathname } from "next/navigation";
import { MainLayout } from "./MainLayout";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith("/admin");

  // Admin 路径不使用 MainLayout
  if (isAdminPath) {
    return <>{children}</>;
  }

  // 普通页面使用 MainLayout
  return <MainLayout>{children}</MainLayout>;
}
