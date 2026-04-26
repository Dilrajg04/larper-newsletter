import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LARPER — AI & Tech for Students",
  description:
    "One issue every Monday. AI and tech news explained simply. No jargon without an explanation. Free.",
  openGraph: {
    title: "LARPER — AI & Tech for Students",
    description:
      "One issue every Monday. AI and tech news explained simply. No jargon without an explanation. Free.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Analytics />
        <footer className="border-t border-zinc-200 py-8 mt-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500 font-mono">
            <span>LARPER &copy; {new Date().getFullYear()}. AI &amp; tech explained for students.</span>
            <div className="flex items-center gap-3">
              <span>Created by Dilraj Grewal</span>
              <span className="text-zinc-300">·</span>
              <a
                href="https://www.linkedin.com/in/dilraj-singh-grewal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                LinkedIn ↗
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
