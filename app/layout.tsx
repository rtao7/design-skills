import type { Metadata } from "next";
import { Inter, Dancing_Script, Caveat, Great_Vibes, Pacifico, Satisfy } from "next/font/google";
import { GeistPixelSquare } from "geist/font/pixel";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const satisfy = Satisfy({
  variable: "--font-satisfy",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Design Skills",
  description: "AI skills for UX and product designers",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${GeistPixelSquare.variable} ${dancingScript.variable} ${caveat.variable} ${greatVibes.variable} ${pacifico.variable} ${satisfy.variable}`}>
      <body className="bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
