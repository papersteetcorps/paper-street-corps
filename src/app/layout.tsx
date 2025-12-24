import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Paper Street Corps",
  description: "Low-level tooling and formal psychological assessments",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 px-6 py-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
