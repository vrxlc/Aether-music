"use client";
import { useState, useEffect } from "react";
import { MusicProvider } from "@/contexts/music-context";
import { DynamicBackground } from "@/components/dynamic-background";
import { Sidebar } from "@/components/sidebar";
import { MediaPlayer } from "@/components/media-player";
import { DiscoverSection } from "@/components/discover-section";
import { VibeVaultSection } from "@/components/vibe-vault-section";
import { LikedSongsSection } from "@/components/liked-songs-section";
import { RadioSection } from "@/components/radio-section";
import { PlaylistSection } from "@/components/playlist-section";
function MainContent({ activeSection }: { activeSection: string }) {
  // Handle playlist sections
  if (activeSection.startsWith("playlist-")) {
    const playlistId = activeSection.replace("playlist-", "");
    return <PlaylistSection playlistId={playlistId} />;
  }
  switch (activeSection) {
    case "discover":
      return <DiscoverSection />;
    case "vibe-vault":
      return <VibeVaultSection />;
    case "liked-songs":
      return <LikedSongsSection />;
    case "radio":
      return <RadioSection />;
    default:
      return <DiscoverSection />;
  }
}
function AppContent() {
  const [activeSection, setActiveSection] = useState("discover");
  // Keyboard shortcut for search (/)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === "/") {
        e.preventDefault();
        // The sidebar handles the search modal, so we dispatch a custom event
        window.dispatchEvent(new CustomEvent("open-search"));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  return (
    <div className="min-h-screen text-foreground overflow-x-hidden">
      <DynamicBackground />
      
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      {/* Main Content */}
      <main className="ml-0 md:ml-64 pb-32 pt-8 pr-4 md:pr-8">
        <div className="max-w-6xl mx-auto">
          <MainContent activeSection={activeSection} />
        </div>
      </main>
      {/* Media Player */}
      <MediaPlayer />
    </div>
  );
}
export default function Home() {
  return (
    <MusicProvider>
      <AppContent />
    </MusicProvider>
  );
}