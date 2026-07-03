import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gasasri AI | Unified Healthcare Intelligence",
  description: "AI-powered healthcare platform securely connecting patients, doctors, and hospitals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} min-h-screen bg-slate-950 text-slate-50 antialiased selection:bg-indigo-500/30`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
