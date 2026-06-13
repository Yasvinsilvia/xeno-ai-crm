import type { Metadata } from "next";
import "./globals.css";
import BackgroundAurora from "@/components/BackgroundAurora";
import TopDynamicIsland from "@/components/TopDynamicisland";

export const metadata: Metadata = {
  title: "Xeno AI | Mission Control",
  description: "AI-native marketing strategist",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 antialiased">
        
        {/* The Mouse-Tracking Glow */}
        <BackgroundAurora />

        {/* The Expanding Top Navigation */}
        <TopDynamicIsland />

        {/* The Main Workspace */}
        <div className="relative z-10 flex-1 w-full pt-16">
          {children}
        </div>

      </body>
    </html>
  );
}