import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const satoshi = localFont({
  src: [
    { path: '../../public/fonts/Satoshi-Light.woff2', weight: '300', style: 'normal' },
    { path: '../../public/fonts/Satoshi-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Satoshi-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/Satoshi-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../../public/fonts/Satoshi-Black.woff2', weight: '900', style: 'normal' },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "O.V.N.I Compta - Gestion Comptable",
  description: "Application de gestion comptable pour l'ASBL O.V.N.I",
  icons: {
    icon: "/logo-ovni.jpeg",
    apple: "/logo-ovni.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${jetbrainsMono.variable} ${satoshi.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
