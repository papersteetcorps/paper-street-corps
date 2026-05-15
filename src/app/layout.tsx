import { Suspense } from "react";
import { Fraunces, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/layout/PageTransition";

const body = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz", "SOFT"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "Forge — Figure Yourself Out",
  description:
    "No multiple choice. You tell your story. Forge reads the patterns across your life and shows you who you actually are. Six psychological frameworks.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${body.className} ${display.variable} ${mono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1 relative">
          <Suspense fallback={null}>
            <PageTransition>{children}</PageTransition>
          </Suspense>
        </main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
