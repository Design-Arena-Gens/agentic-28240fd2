import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "设计案例管理系统",
  description: "每日设计锻炼 - 高质量设计案例输入与整理",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased bg-gray-50">
        {children}
      </body>
    </html>
  );
}
