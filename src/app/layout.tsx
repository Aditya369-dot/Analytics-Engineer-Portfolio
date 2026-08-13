import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const siteUrl = new URL("https://snapbiz.ai");

const siteTitle = "Aditya Bholla | Data + AI Engineer";
const siteDescription =
  "Portfolio of Aditya Bholla, a Data + AI engineer building analytics platforms, data systems, and grounded AI solutions.";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: siteTitle,
  description: siteDescription,
  applicationName: "Aditya Bholla Portfolio",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: siteTitle,
    description: siteDescription,
    siteName: "Aditya Bholla Portfolio",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] -translate-y-20 rounded-lg bg-foreground px-4 py-2 font-display text-sm font-semibold text-background transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
