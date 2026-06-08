"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MusicProvider } from "@/contexts/music-context";
import { DynamicBackground } from "@/components/dynamic-background";
import { Sidebar } from "@/components/sidebar";
import { MediaPlayer } from "@/components/media-player";
import { DiscoverSection } from "@/components/discover-section";
import { VibeVaultSection } from "@/components/vibe-vault-section";
import { LikedSongsSection } from "@/components/liked-songs-section";
import { RadioSection } from "@/components/radio-section";
import { PlaylistSection } from "@/components/playlist-section";
import { ProfileSection } from "@/components/profile-section";
import { LoginScreen } from "@/components/login-screen";
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
    case "profile":
      return <ProfileSection />;
    default:
      return <DiscoverSection />;
  }
}
function AppContent() {
  const [activeSection, setActiveSection] = useState("discover");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const searchParams = useSearchParams();

  // Handle deep-linking to sections (e.g., returning from billing)
  useEffect(() => {
    const section = searchParams.get("section");
    if (section) {
      setActiveSection(section);
    }
  }, [searchParams]);

  // Keyboard shortcut for search (/)
  useEffect(() => {
    // 1. Initialize auth state from localStorage on mount
    const savedAuth = localStorage.getItem("aether_auth_state");
    // Default to true if never set (for prototype ease), or false if explicitly signed out
    setIsAuthenticated(savedAuth === null ? true : savedAuth === "true");

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

    const handleSignOut = () => {
      // 2. Clear persistence on sign out
      setIsAuthenticated(false);
      localStorage.setItem("aether_auth_state", "false");
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("sign-out", handleSignOut);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("sign-out", handleSignOut);
    };
  }, []);

  const handleLogin = () => {
    // 3. Set persistence on login
    setIsAuthenticated(true);
    localStorage.setItem("aether_auth_state", "true");
  };

  // Wait until we've checked localStorage before rendering anything
  // to prevent a "flash" of the login screen
  if (isAuthenticated === null) return null;

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen text-foreground overflow-x-hidden">
      <DynamicBackground />

      {/* Sidebar handles its own responsive visibility but provides global modals */}
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-sm border-b border-white/[0.05]">
        <div className="flex items-center justify-between px-4 py-3 pt-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass-strong flex items-center justify-center">
              <span className="text-[10px] tracking-[0.2em] text-foreground/90">A</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-light tracking-wider">AETHER</div>
              <div className="text-[10px] text-muted-foreground">Mobile</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.dispatchEvent(new CustomEvent("open-search"));
              }}
              className="p-2 rounded-xl glass hover:bg-white/10 text-muted-foreground"
              aria-label="Search"
            >
              <span className="text-sm">⌕</span>
            </button>

            <button
              onClick={() => setActiveSection("discover")}
              className="p-2 rounded-xl glass hover:bg-white/10 text-muted-foreground"
              aria-label="Discover"
            >
              <span className="text-sm">♪</span>
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.dispatchEvent(new CustomEvent("open-profile"));
              }}
              className="p-2 rounded-xl glass hover:bg-white/10 text-muted-foreground"
              aria-label="Settings"
            >
              <span className="text-sm">⚙</span>
            </button>
          </div>
        </div>

        {/* Mobile section tabs */}
        <nav className="flex items-center justify-around px-4 pb-2 pb-5 mt-2">
          {[
            { id: "discover", label: "Discover" },
            { id: "vibe-vault", label: "Vibe Vault" },
            { id: "liked-songs", label: "Liked" },
            { id: "radio", label: "Radio" },
            { id: "profile", label: "Profile" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={
                activeSection === item.id
                  ? "px-3 py-1 rounded-full bg-white/10 text-foreground text-xs"
                  : "px-3 py-1 rounded-full bg-transparent text-muted-foreground hover:text-foreground text-xs"
              }
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="w-full md:flex-1 pt-16 md:pt-8 pb-28 md:pb-24 md:pr-8 px-4 md:px-6 overflow-x-hidden md:pl-6 md:pr-10">
        <div className="w-full max-w-6xl mx-auto">
          <MainContent activeSection={activeSection} />
        </div>
      </main>

      {/* Media Player */}
      <div className="h-[3px]" />
      <MediaPlayer />
    </div>
  );
}
export default function Home() {
  return (
    <MusicProvider>
      <Suspense fallback={null}>
        <AppContent />
      </Suspense>
    </MusicProvider>
  );
}