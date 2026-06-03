"use client";

import { motion } from "framer-motion";
import { Play, Pause, Heart, Trash2 } from "lucide-react";
import { useMusic } from "@/contexts/music-context";
import { cn } from "@/lib/utils";

export function LikedSongsSection() {
  const { 
    tracks, 
    playTrack, 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    toggleLike, 
    likedSongIds 
  } = useMusic();

  const likedTracks = tracks.filter((track) => likedSongIds.includes(track.id));

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden glass-strong">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
        
        <div className="relative p-8 flex items-end gap-6">
          <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl shadow-black/30">
            <div className="w-full h-full bg-gradient-to-br from-primary/40 via-accent/30 to-primary/40 flex items-center justify-center">
              <Heart className="w-20 h-20 text-foreground fill-foreground/30" />
            </div>
          </div>
          
          <div className="pb-2">
            <p className="text-xs tracking-[0.2em] text-muted-foreground mb-2">
              COLLECTION
            </p>
            <h1 className="text-4xl font-light tracking-tight text-foreground mb-3">
              Liked Songs
            </h1>
            <p className="text-muted-foreground">
              {likedTracks.length} tracks • Your personal favorites
            </p>
          </div>
        </div>
      </section>

      {/* Track List */}
      <section>
        {likedTracks.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-light text-foreground mb-2">No liked songs yet</h3>
            <p className="text-muted-foreground text-sm">
              Click the heart icon on any track to add it here
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {/* Header */}
            <div className="grid grid-cols-[40px_1fr_1fr_100px] gap-4 px-4 py-2 text-xs text-muted-foreground border-b border-white/5">
              <span>#</span>
              <span>TITLE</span>
              <span>ALBUM</span>
              <span className="text-right">DURATION</span>
            </div>

            {/* Tracks */}
            {likedTracks.map((track, index) => {
              const isCurrentTrack = currentTrack?.id === track.id;

              return (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                  onClick={() => {
                    if (isCurrentTrack) {
                      togglePlay();
                    } else {
                      playTrack(track);
                    }
                  }}
                  className={cn(
                    "grid grid-cols-[40px_1fr_1fr_100px] gap-4 px-4 py-3 rounded-lg cursor-pointer group items-center transition-colors",
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
                    <span className="text-sm text-muted-foreground">
                      {Math.floor(track.duration / 60)}:
                      {(track.duration % 60).toString().padStart(2, "0")}
                    </span>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(track.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
