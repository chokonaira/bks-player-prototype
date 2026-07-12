import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const serif = Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-serif" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
import { PlayerProvider } from "@/components/PlayerProvider";
import { LocaleProvider } from "@/components/LocaleProvider";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import OfflineBanner from "@/components/OfflineBanner";
import MiniPlayer from "@/components/MiniPlayer";
import BottomNav from "@/components/BottomNav";
import TopNav from "@/components/TopNav";

export const metadata: Metadata = {
  title: {
    default: "BKS Player Prototype",
    template: "%s · BKS Player Prototype",
  },
  description:
    "Mobile-first player & discovery concept for Best Kept Secret: persistent mini-player, resume, sleep timer, bottom-tab navigation.",
  applicationName: "BKS Player Prototype",
  manifest: "/manifest.json",
  openGraph: {
    title: "BKS Player Prototype",
    description:
      "Mobile-first player & discovery concept: persistent mini-player, resume, sleep timer, bottom-tab navigation.",
    type: "website",
    siteName: "BKS Player Prototype",
  },
  twitter: {
    card: "summary",
    title: "BKS Player Prototype",
    description: "Mobile-first player & discovery concept for Best Kept Secret.",
  },
};

export const viewport: Viewport = {
  themeColor: "#f1eee6",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} light`}>
      <body className="min-h-screen bg-base text-ink antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `try{document.documentElement.classList.toggle('light',localStorage.getItem('bks-theme')!=='dark')}catch(e){}`,
          }}
        />
        <ServiceWorkerRegister />
        <LocaleProvider>
          <OfflineBanner />
          <PlayerProvider>
            <TopNav />
            <main className="mx-auto max-w-6xl px-4 pb-40 pt-6 md:px-6 md:pt-8 lg:px-8 lg:pb-36">{children}</main>
            <MiniPlayer />
            <BottomNav />
          </PlayerProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
