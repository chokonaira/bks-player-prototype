import type { Metadata } from "next";
import "./globals.css";
import { PlayerProvider } from "@/components/PlayerProvider";
import MiniPlayer from "@/components/MiniPlayer";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "BKS — Player Prototype",
  description: "Mobile-first player concept",
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
