import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "dskill — AI Skills for Designers",
  description: "Curated AI skills, tools, news, and community for UX and product designers.",
  openGraph: {
    title: "dskill — AI Skills for Designers",
    description: "Curated AI skills, tools, news, and community for UX and product designers.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "dskill — AI Skills for Designers",
    description: "Curated AI skills, tools, news, and community for UX and product designers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
