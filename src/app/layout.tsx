import { Suspense } from "react";
import { Plus_Jakarta_Sans, Space_Grotesk, Instrument_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/layout/PageTransition";
import ThemeProvider from "@/components/ThemeProvider";

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});
const brand = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-brand",
  weight: ["500", "600", "700"],
});

export const metadata = {
  title: "Forge — Figure Yourself Out",
  description: "No multiple choice. You tell your story. Forge reads the patterns across your life and shows you who you actually are. Six psychological frameworks.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${body.className} ${display.variable} ${brand.variable} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider>
          <Header />
          <main className="flex-1 px-6 py-10">
            <Suspense fallback={null}>
              <PageTransition>{children}</PageTransition>
            </Suspense>
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
