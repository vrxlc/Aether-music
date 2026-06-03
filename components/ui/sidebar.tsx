"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Settings, X, Camera, Heart, Plus, Radio, Music, Trash2, Edit2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMusic } from "@/contexts/music-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}
const navItems: NavItem[] = [
  { id: "discover", label: "Discover", icon: <Music className="w-4 h-4" /> },
  { id: "vibe-vault", label: "Vibe Vault", icon: <Heart className="w-4 h-4" /> },
  { id: "radio", label: "Live Radio", icon: <Radio className="w-4 h-4" /> },
];
interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}
function ProfileModal({ onClose }: { onClose: () => void }) {
  const { userProfile, updateUserProfile } = useMusic();
  const [formData, setFormData] = useState({
    name: userProfile.name,
    email: userProfile.email,
    bio: userProfile.bio,
  });
  const [avatarUrl, setAvatarUrl] = useState(userProfile.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleSave = () => {
    updateUserProfile({
      ...formData,
      avatar: avatarUrl,
    });
    onClose();
  };
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file);
      setAvatarUrl(objectUrl);
    }
  };
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative z-10 w-full max-w-md glass-strong rounded-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-light text-foreground">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex justify-center mb-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-white/10">
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={handleAvatarClick}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Camera className="w-6 h-6 text-white" />
              <span className="text-[10px] text-white mt-1">Upload Photo</span>
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
              Display Name
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-white/5 border-white/10 focus:border-primary/50"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
              Email
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-white/5 border-white/10 focus:border-primary/50"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-md bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none text-foreground placeholder:text-muted-foreground"
              placeholder="Tell us about yourself..."
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {userProfile.isPremium ? "Premium Member" : "Free Member"}
              </span>
              {userProfile.isPremium && (
                <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-400 rounded-full">
                  Premium
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-white/10 hover:bg-white/5"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            Save Changes
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
function SearchModal({ onClose }: { onClose: () => void }) {
  const { searchQuery, setSearchQuery, searchResults, playTrack, tracks } = useMusic();
  const displayTracks = searchQuery.trim() ? searchResults : tracks;
  const title = searchQuery.trim() ? `Search results for "${searchQuery}"` : "All Tracks";
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative z-10 w-full max-w-2xl glass-strong rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, artist, album, or genre..."
              className="pl-10 bg-white/5 border-white/10 focus:border-primary/50"
              autoFocus
            />
          </div>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-4">
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
            {title} ({displayTracks.length})
          </h3>
          {displayTracks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tracks found</p>
              <p className="text-sm text-muted-foreground/60 mt-1">
                Try searching for a different term
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {displayTracks.map((track, index) => (
                <motion.button
                  key={track.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => {
                    playTrack(track);
                    onClose();
                  }}
                  className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group text-left"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={track.artwork}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                      {track.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {track.artist} &bull; {track.album}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {track.genre}
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
function CreatePlaylistModal({ onClose }: { onClose: () => void }) {
  const { createPlaylist } = useMusic();
  const [name, setName] = useState("");
  const handleCreate = () => {
    if (name.trim()) {
      createPlaylist(name.trim());
      onClose();
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative z-10 w-full max-w-sm glass-strong rounded-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-light text-foreground mb-4">Create New Playlist</h2>
        
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Playlist name..."
          className="bg-white/5 border-white/10 focus:border-primary/50 mb-4"
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
        />
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-white/10 hover:bg-white/5"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            Create
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const { 
    userProfile, 
    setSearchQuery, 
    likedSongIds, 
    playlists, 
    deletePlaylist, 
    renamePlaylist 
  } = useMusic();

  useEffect(() => {
    const handleOpenSearch = () => {
      setShowSearch(true);
      setMobileOpen(false);
    };
    window.addEventListener("open-search", handleOpenSearch);
    return () => window.removeEventListener("open-search", handleOpenSearch);
  }, []);

  const handleCloseSearch = () => {
    setShowSearch(false);
    setSearchQuery("");
  };
  const handleStartRename = (playlistId: string, currentName: string) => {
    setEditingPlaylistId(playlistId);
    setEditingName(currentName);
  };
  const handleSaveRename = (playlistId: string) => {
    if (editingName.trim()) {
      renamePlaylist(playlistId, editingName.trim());
    }
    setEditingPlaylistId(null);
    setEditingName("");
  };
  const SidebarInner = ({ mode }: { mode: "desktop" | "mobile" }) => {
    return (
      <aside
        className={cn(
          "top-0 bottom-24 p-6 flex flex-col z-10",
          mode === "desktop"
            ? "fixed left-0 w-64 hidden md:flex"
            : "fixed left-0 top-0 h-screen w-72 max-w-[85vw] bg-background/95 backdrop-blur-md border-r border-white/10 flex md:hidden"
        )}
      >
        {/* Logo */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-light tracking-[0.2em] text-foreground/90">AETHER</h1>
            <p className="text-[10px] tracking-[0.3em] text-muted-foreground mt-1">MUSIC</p>
          </div>
          {mode === "mobile" && (
            <button
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-xl hover:bg-white/10 text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={() => {
            setShowSearch(true);
            setMobileOpen(false);
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl glass hover:bg-white/10 transition-colors mb-6 group"
        >
          <Search className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            Search tracks...
          </span>
          <kbd className="ml-auto text-[10px] text-muted-foreground/60 px-1.5 py-0.5 rounded bg-white/5">
            /
          </kbd>
        </button>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto">
          <div className="space-y-1 relative">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id);
                  if (mode === "mobile") setMobileOpen(false);
                }}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={cn(
                  "relative w-full text-left py-3 px-4 text-sm font-light tracking-wide transition-colors duration-300 flex items-center gap-3",
                  activeSection === item.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/80"
                )}
              >
                {(hoveredItem === item.id || activeSection === item.id) && (
                  <motion.div
                    layoutId={mode === "desktop" ? "nav-indicator" : `nav-indicator-${mode}`}
                    className="absolute inset-0 rounded-xl glass"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{item.icon}</span>
                <span className="relative z-10">{item.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Liked Songs */}
          <div className="mt-8">
            <button
              onClick={() => {
                onSectionChange("liked-songs");
                if (mode === "mobile") setMobileOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                activeSection === "liked-songs"
                  ? "glass text-foreground"
                  : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center">
                <Heart className="w-4 h-4 text-foreground fill-foreground" />
              </div>
              <div className="text-left">
                <p className="text-sm font-light">Liked Songs</p>
                <p className="text-[10px] text-muted-foreground">{likedSongIds.length} tracks</p>
              </div>
            </button>
          </div>

          {/* Playlists Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between px-4 mb-3">
              <h3 className="text-[10px] tracking-[0.2em] text-muted-foreground">YOUR PLAYLISTS</h3>
              <button
                onClick={() => {
                  setShowCreatePlaylist(true);
                  if (mode === "mobile") setMobileOpen(false);
                }}
                className="p-1 rounded hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {playlists.length === 0 ? (
              <p className="px-4 text-xs text-muted-foreground/60">No playlists yet. Create one!</p>
            ) : (
              <div className="space-y-1">
                {playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className={cn(
                      "group relative flex items-center",
                      activeSection === `playlist-${playlist.id}` && "bg-white/5 rounded-lg"
                    )}
                  >
                    {editingPlaylistId === playlist.id ? (
                      <div className="flex-1 flex items-center gap-2 px-4 py-2">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="h-7 text-sm bg-white/10 border-white/20"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveRename(playlist.id);
                            if (e.key === "Escape") setEditingPlaylistId(null);
                          }}
                        />
                        <button onClick={() => handleSaveRename(playlist.id)} className="p-1 rounded hover:bg-white/10">
                          <Check className="w-4 h-4 text-primary" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            onSectionChange(`playlist-${playlist.id}`);
                            if (mode === "mobile") setMobileOpen(false);
                          }}
                          className="flex-1 text-left py-2 px-4 text-sm font-light text-muted-foreground hover:text-foreground/80 transition-colors"
                        >
                          <span className="truncate block">{playlist.name}</span>
                          <span className="text-[10px] text-muted-foreground/60">{playlist.trackIds.length} tracks</span>
                        </button>
                        <div className="absolute right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleStartRename(playlist.id, playlist.name)}
                            className="p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => deletePlaylist(playlist.id)}
                            className="p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-red-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* User Profile */}
        <div className="mt-auto pt-6 border-t border-white/[0.05]">
          <button
            onClick={() => {
              setShowProfile(true);
              if (mode === "mobile") setMobileOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-white/5 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-primary/30 transition-all">
              <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-sm font-light text-foreground/90 truncate">{userProfile.name}</p>
              <p className="text-[10px] text-muted-foreground">{userProfile.isPremium ? "Premium" : "Free"}</p>
            </div>
            <Settings className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </aside>
    );
  };

  return (
    <>
      <AnimatePresence>
        {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
        {showSearch && <SearchModal onClose={handleCloseSearch} />}
        {showCreatePlaylist && <CreatePlaylistModal onClose={() => setShowCreatePlaylist(false)} />}
      </AnimatePresence>

      {/* Mobile top-left menu button */}
      <div className="fixed top-4 left-4 z-20 md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-muted-foreground"
          aria-label="Open menu"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Desktop sidebar */}
      <SidebarInner mode="desktop" />

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-10 bg-black/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="z-30 md:hidden"
            >
              <SidebarInner mode="mobile" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
