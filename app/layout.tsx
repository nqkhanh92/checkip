import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "What's My IP — Check My Public IP Address",
  description:
    "Instantly check your public IP address, location, ISP, and detect VPN or proxy usage.",
  keywords: ["ip checker", "my ip", "public ip", "what is my ip", "ip address"],
  openGraph: {
    title: "What's My IP",
    description: "Check your public IP address instantly",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
