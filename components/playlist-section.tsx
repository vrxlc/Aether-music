"use client";

import { motion } from "framer-motion";
import { Play, Pause, Music, Trash2, X } from "lucide-react";
import { useMusic, Playlist, Track } from "@/contexts/music-context";
import { cn } from "@/lib/utils";

interface PlaylistSectionProps {
  playlistId: string;
}

export function PlaylistSection({ playlistId }: PlaylistSectionProps) {
  const { 
    tracks, 
    playlists,
    playTrack, 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    removeFromPlaylist 
  } = useMusic();

  const playlist = playlists.find(p => p.id === playlistId);
  
  if (!playlist) {
    return (
      <div className="text-center py-16">
        <Music className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="text-lg font-light text-foreground mb-2">Playlist not found</h3>
      </div>
    );
  }

  const playlistTracks = playlist.trackIds
    .map(id => tracks.find(t => t.id === id))
    .filter((t): t is Track => t !== undefined);

  const totalDuration = playlistTracks.reduce((acc, track) => acc + track.duration, 0);
  const formatTotalDuration = () => {
    const minutes = Math.floor(totalDuration / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours} hr ${minutes % 60} min`;
    }
    return `${minutes} min`;
  };

  // Get artwork from first 4 tracks for mosaic
  const artworks = playlistTracks.slice(0, 4).map(t => t.artwork);

  return (
    <div className="space-y-10 max-w-5xl mx-auto">

      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden glass-strong">
        <div className="relative p-8 flex items-end justify-center gap-6 text-left">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/10" />


          <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl shadow-black/30">
            {artworks.length >= 4 ? (
              <div className="w-full h-full grid grid-cols-2 grid-rows-2">
                {artworks.map((art, i) => (
                  <img
                    key={i}
                    src={art}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ))}
              </div>
            ) : artworks.length > 0 ? (
              <img
                src={artworks[0]}
                alt={playlist.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-accent/30 via-primary/20 to-accent/30 flex items-center justify-center">
                <Music className="w-16 h-16 text-foreground/30" />
              </div>
            )}
          </div>
          
          <div className="pb-2">
            <p className="text-xs tracking-[0.2em] text-muted-foreground mb-2">
              PLAYLIST

            </p>
            <h1 className="text-4xl font-light tracking-tight text-foreground mb-3 text-left">
              {playlist.name}
            </h1>
            <p className="text-muted-foreground">
              {playlistTracks.length} tracks • {formatTotalDuration()}
            </p>
          </div>
        </div>
      </section>


      {/* Track List */}

      <section>
        {playlistTracks.length === 0 ? (
          <div className="text-center py-16">
            <Music className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-light text-foreground mb-2">This playlist is empty</h3>
            <p className="text-muted-foreground text-sm">
              Go to Vibe Vault and click the menu on any track to add it here
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {/* Header (desktop only) */}
            <div className="hidden md:grid grid-cols-[40px_1fr_1fr_100px] gap-4 px-4 py-2 text-xs text-muted-foreground border-b border-white/5">
              <span>#</span>
              <span>TITLE</span>
              <span>ALBUM</span>
              <span className="text-right">DURATION</span>
            </div>

            {/* Tracks */}
            {playlistTracks.map((track, index) => {
              const isCurrentTrack = currentTrack?.id === track.id;

              return (
                <motion.div
                  key={`${playlist.id}-${track.id}`}
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
                    // Mobile: simplified 1-row card (no column squeezing)
                    "flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer group transition-colors",
                    "md:grid md:grid-cols-[40px_1fr_1fr_100px] md:gap-4 md:items-center",
                    isCurrentTrack && "bg-white/[0.02]"
                  )}
                >
                  {/* Number / Play (hidden on mobile) */}
                  <div className="relative hidden md:block">
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
                  <div className="flex items-center gap-3 min-w-0 flex-1">
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
                  <p className="text-sm text-muted-foreground truncate hidden md:block">
                    {track.album}
                  </p>

                  {/* Duration & Actions */}
                  <div className="flex items-center justify-end gap-3 flex-1 md:flex-none">
                    <span className="text-sm text-muted-foreground">
                      {Math.floor(track.duration / 60)}:
                      {(track.duration % 60).toString().padStart(2, "0")}
                    </span>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromPlaylist(playlist.id, track.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
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
