import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PlayerProvider } from "@/components/PlayerProvider";
import MiniPlayer from "@/components/MiniPlayer";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: {
    default: "BKS — Player Prototype",
    template: "%s · BKS Player Prototype",
  },
  description:
    "Mobile-first player & discovery concept for Best Kept Secret: persistent mini-player, resume, sleep timer, bottom-tab navigation.",
  applicationName: "BKS Player Prototype",
  openGraph: {
    title: "BKS — Player Prototype",
    description:
      "Mobile-first player & discovery concept: persistent mini-player, resume, sleep timer, bottom-tab navigation.",
    type: "website",
    siteName: "BKS Player Prototype",
  },
  twitter: {
    card: "summary",
    title: "BKS — Player Prototype",
    description: "Mobile-first player & discovery concept for Best Kept Secret.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0d0d",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0d0d0d] text-white antialiased">
        <PlayerProvider>
          <main className="mx-auto max-w-5xl px-4 pb-40 pt-6">{children}</main>
          <MiniPlayer />
          <BottomNav />
        </PlayerProvider>
      </body>
    </html>
  );
}
