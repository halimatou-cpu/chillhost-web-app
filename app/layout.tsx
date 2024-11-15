import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/toaster";
import FaqSection from "@/components/FaqSection";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chillhost Main App",
  description: "A professional Next.js app for janitorial services.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="container mx-auto px-4 py-8">{children}</main>
          <FaqSection />
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
