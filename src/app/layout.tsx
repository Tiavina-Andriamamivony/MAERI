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
  title: 'MA-ERI Consulting',
  description: 'Fourniture de matières premières, mise en relation avec les fournisseurs, formations professionnelles, et consultance IT. Startup malgache dans le rôle est de vous aider dans votre développement.',
  openGraph: {
    title: 'MA-ERI Consulting',
    description: 'Fourniture de matières premières, mise en relation avec les fournisseurs, formations professionnelles, et consultance IT. Startup malgache dans le rôle est de vous aider dans votre développement.',
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
