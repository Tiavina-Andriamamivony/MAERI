import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import AnotherNav from "@/components/anotherNav";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://maeri.vercel.app'),
  title: 'MAERI Consulting',
  description: 'Fourniture de matières premières, mise en relation avec les fournisseurs, et formations professionnelles.',
  openGraph: {
    title: 'MAERI Consulting',
    description: 'Fourniture de matières premières, mise en relation avec les fournisseurs, et formations professionnelles.',
    url: 'https://maeri.vercel.app',
    siteName: 'MAERI Consulting',
    locale: 'fr_FR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AnotherNav/>
         <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
      </body>
    </html>
  );
}
