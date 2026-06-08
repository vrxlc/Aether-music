"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Heart, MoreHorizontal, Plus, Check } from "lucide-react";
import { useMusic } from "@/contexts/music-context";
import { cn } from "@/lib/utils";

export function VibeVaultSection() {
  const { 
    tracks, 
    playTrack, 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    toggleLike, 
    isLiked,
    playlists,
    addToPlaylist 
  } = useMusic();
  const [showPlaylistMenu, setShowPlaylistMenu] = useState<string | null>(null);
  const [addedToPlaylist, setAddedToPlaylist] = useState<string | null>(null);

  const handleAddToPlaylist = (playlistId: string, trackId: string) => {
    addToPlaylist(playlistId, trackId);
    setAddedToPlaylist(`${playlistId}-${trackId}`);
    setTimeout(() => setAddedToPlaylist(null), 1500);
    setShowPlaylistMenu(null);
  };

  return (
    <div className="space-y-0.5 sm:mt-0 md:mt-0 mt-20 pb-4">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden glass-strong pt-0.5 sm:pt-4 md:pt-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        
        <div className="relative p-8 flex items-end gap-6">
          <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl shadow-black/30">
            <div className="w-full h-full bg-gradient-to-br from-primary/30 via-accent/20 to-primary/30 flex items-center justify-center">
              <Heart className="w-16 h-16 text-foreground/30" />
            </div>
          </div>
          
          <div className="pb-3">
            <h2 className="text-sm font-light text-foreground/80 mb-1">Aether&apos;s Special</h2>
            <p className="text-xs tracking-[0.2em] text-muted-foreground mb-2">
              COLLECTION
            </p>
            <h1 className="text-4xl font-light tracking-tight text-foreground mb-3">
              All Tracks
            </h1>
            <p className="text-muted-foreground">
              {tracks.length} tracks • Discover your next favorite
            </p>
          </div>
        </div>
      </section>

      {/* Track List */}
      <section>
        <div className="space-y-1">
          {/* Header */}
          <div className="grid grid-cols-[40px_1fr_1fr_100px] gap-4 px-4 py-2 text-xs text-muted-foreground border-b border-white/5">
            <span>#</span>
            <span>TITLE</span>
            <span>ALBUM</span>
            <span className="text-right">DURATION</span>
          </div>

          {/* Tracks */}
          {tracks.map((track, index) => {
            const isCurrentTrack = currentTrack?.id === track.id;
            const trackIsLiked = isLiked(track.id);

            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                onClick={() => {
                  if (isCurrentTrack) {
                    togglePlay();
                  } else {
                    playTrack(track);
                  }
                }}
                className={cn(
                  "grid grid-cols-[40px_1fr_1fr_100px] gap-4 px-4 py-3 rounded-lg cursor-pointer group items-center transition-colors relative",
                  isCurrentTrack && "bg-white/[0.02]"
                )}
              >
                {/* Number / Play */}
                <div className="relative">
                  <span
                    className={cn(
                      "text-sm group-hover:invisible",
                      isCurrentTrack ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {isCurrentTrack && isPlaying ? (
                      <div className="flex items-center gap-[2px]">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-[3px] bg-primary rounded-full"
                            animate={{ height: [4, 12, 4] }}
                            transition={{
                              duration: 0.5,
                              repeat: Infinity,
                              delay: i * 0.1,
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      index + 1
                    )}
                  </span>
                  <button className="absolute inset-0 flex items-center justify-center invisible group-hover:visible">
                    {isCurrentTrack && isPlaying ? (
                      <Pause className="w-4 h-4 text-foreground" />
                    ) : (
                      <Play className="w-4 h-4 text-foreground ml-0.5" />
                    )}
                  </button>
                </div>

                {/* Title & Artist */}
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={track.artwork}
                    alt={track.title}
                    className="w-10 h-10 rounded-md object-cover"
                  />
                  <div className="min-w-0">
                    <p
                      className={cn(
                        "text-sm truncate",
                        isCurrentTrack ? "text-primary" : "text-foreground"
                      )}
                    >
                      {track.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {track.artist}
                    </p>
                  </div>
                </div>

                {/* Album */}
                <p className="text-sm text-muted-foreground truncate">
                  {track.album}
                </p>

                {/* Duration & Actions */}
                <div className="flex items-center justify-end gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(track.id);
                    }}
                    className={cn(
                      "transition-opacity",
                      trackIsLiked ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}
                  >
                    <Heart
                      className={cn(
                        "w-4 h-4 transition-colors",
                        trackIsLiked
                          ? "fill-primary text-primary"
                          : "text-muted-foreground hover:text-primary"
                      )}
                    />
                  </motion.button>
                  
                  <span className="text-sm text-muted-foreground">
                    {Math.floor(track.duration / 60)}:
                    {(track.duration % 60).toString().padStart(2, "0")}
                  </span>
                  
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPlaylistMenu(showPlaylistMenu === track.id ? null : track.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </motion.button>

                    {/* Playlist Menu */}
                    <AnimatePresence>
                      {showPlaylistMenu === track.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute right-0 top-full mt-2 w-48 glass-strong rounded-xl p-2 z-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <p className="text-xs text-muted-foreground px-2 py-1 mb-1">Add to playlist</p>
                          {playlists.length === 0 ? (
                            <p className="text-xs text-muted-foreground/60 px-2 py-2">No playlists yet</p>
                          ) : (
                            playlists.map((playlist) => {
                              const alreadyAdded = playlist.trackIds.includes(track.id);
                              const justAdded = addedToPlaylist === `${playlist.id}-${track.id}`;
                              
                              return (
                                <button
                                  key={playlist.id}
                                  onClick={() => !alreadyAdded && handleAddToPlaylist(playlist.id, track.id)}
                                  disabled={alreadyAdded}
                                  className={cn(
                                    "w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left text-sm transition-colors",
                                    alreadyAdded 
                                      ? "text-muted-foreground/50 cursor-not-allowed" 
                                      : "text-foreground hover:bg-white/10"
                                  )}
                                >
                                  {justAdded ? (
                                    <Check className="w-4 h-4 text-primary" />
                                  ) : alreadyAdded ? (
                                    <Check className="w-4 h-4 text-muted-foreground/50" />
                                  ) : (
                                    <Plus className="w-4 h-4" />
                                  )}
                                  <span className="truncate">{playlist.name}</span>
                                </button>
                              );
                            })
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
