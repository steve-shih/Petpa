import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Petpa 寵物補給站 | 合作貓舍一頁式購物平台",
  description: "以合作貓舍為核心的分潤電商平台，掃碼即可購買貓砂、飼料、保健品等寵物用品",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Noto+Sans+TC:wght@300;400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
