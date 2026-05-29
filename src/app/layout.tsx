import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SiteCheck Pro - Shopify Store Audit Tool",
  description: "Get a complete audit of your Shopify store in 30 seconds. Performance, SEO, and conversion optimization insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-full bg-slate-50">{children}</body>
    </html>
  );
}
