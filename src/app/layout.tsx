import { Geist, JetBrains_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { ClerkProvider} from '@clerk/nextjs'
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

export const metadata = {
  metadataBase: new URL("https://maeri.vercel.app"),
  title: {
    default: "MA-ERI Consulting — Matière, savoir, digital.",
    template: "%s · MA-ERI Consulting",
  },
  description:
    "Startup malgache. Approvisionnement industriel, formation professionnelle et conseil informatique pour les entreprises qui construisent, produisent et forment.",
  openGraph: {
    title: "MA-ERI Consulting — Matière, savoir, digital.",
    description:
      "Startup malgache. Approvisionnement industriel, formation professionnelle et conseil informatique pour les entreprises qui construisent, produisent et forment.",
    url: "https://maeri.vercel.app",
    siteName: "MA-ERI Consulting",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="fr" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${jetbrainsMono.variable} ${fraunces.variable} antialiased bg-background text-foreground`}
        >
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
    </ClerkProvider>
  );
}
