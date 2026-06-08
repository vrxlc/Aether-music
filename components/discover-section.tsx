"use client";

import { motion } from "framer-motion";
import { Play, Pause, Sparkles } from "lucide-react";
import { useMusic } from "@/contexts/music-context";
import { cn } from "@/lib/utils";

const moodBoards = [
  {
    id: "1",
    title: "Ethereal Mornings",
    description: "Start your day with serenity",
    gradient: "from-[#a8b5a0]/20 to-[#c9d4c0]/10",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop",
    height: "h-80",
    trackIds: ["1", "4", "9"],
  },
  {
    id: "2",
    title: "Deep Focus",
    description: "Concentration soundscapes",
    gradient: "from-[#a0b5c9]/20 to-[#8fa0b5]/10",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop",
    height: "h-56",
    trackIds: ["2", "8"],
  },
  {
    id: "3",
    title: "Golden Hour",
    description: "Warm acoustic melodies",
    gradient: "from-[#d4c9a0]/20 to-[#c9b890]/10",
    image: "https://i.pinimg.com/736x/20/aa/9e/20aa9eabc9ef832c5e5948deb4cf30f4.jpg",
    height: "h-72",
    trackIds: ["3", "6", "7"],
  },
  {
    id: "4",
    title: "Night Drive",
    description: "Ambient electronic journeys",
    gradient: "from-[#c0a8b5]/20 to-[#b598a5]/10",
    image: "https://i.pinimg.com/control1/1200x/83/bd/26/83bd266c47068cf1489b7d13810ca23c.jpg",
    height: "h-64",
    trackIds: ["5", "10", "11", "12"],
  },
];

export function DiscoverSection() {
  const { tracks, playTrack, currentTrack, isPlaying, togglePlay } = useMusic();

  const handleMoodBoardClick = (trackIds: string[]) => {
    const firstTrack = tracks.find(t => t.id === trackIds[0]);
    if (firstTrack) {
      playTrack(firstTrack);
    }
  };

  return (
    <div className="space-y-8 pt-[30px] md:pt-0 md:pl-[20px]">
      {/* Mood Boards - Masonry Layout */}
      <section>
        <h2 className="text-lg font-light tracking-wide text-foreground/90 mb-6">
          Curated Mood Boards
        </h2>
        
        <div className="columns-2 gap-4 space-y-4">
          {moodBoards.map((board, index) => (
            <motion.div
              key={board.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              onClick={() => handleMoodBoardClick(board.trackIds)}
              className={cn(
                "break-inside-avoid rounded-2xl overflow-hidden cursor-pointer group relative glass",
                board.height
              )}
            >
              <div className="absolute inset-0">
                <img
                  src={board.image}
                  alt={board.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                )} />
              </div>
              
              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <h3 className="text-lg font-light text-white mb-1 md:mb-0">
                  {board.title}
                </h3>
                <p className="text-sm text-white/60">{board.description}</p>
                <p className="text-xs text-white/40 mt-2">{board.trackIds.length} tracks</p>
              </div>

              {/* Play button on hover */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Play className="w-4 h-4 text-white ml-0.5" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* All Tracks */}
      <section>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4 shadow-[0_0_15px_rgba(255,255,255,0.02)]">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/80">
            Aether&apos;s Special
          </span>
        </div>

        <h2 className="text-lg font-light tracking-wide text-foreground/90 mb-6">
          All Tracks
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-[13px] gap-y-4 lg:gap-y-4">
          {tracks.map((track, index) => {
            const isCurrentTrack = currentTrack?.id === track.id;
            
            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="group cursor-pointer"
                onClick={() => {
                  if (isCurrentTrack) {
                    togglePlay();
                  } else {
                    playTrack(track);
                  }
                }}
              >
                <div className="relative rounded-xl overflow-hidden mb-2 md:mb-3 aspect-square glass">
                  <img
                    src={track.artwork}
                    alt={track.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Prismatic overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Aether's Special Badge */}
                  <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[8px] uppercase tracking-widest text-white/90 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 shadow-[0_0_12px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:bg-white/20">
                    Aether&apos;s Special
                  </div>

                  {/* Play button */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    className={cn(
                      "absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                      isCurrentTrack && isPlaying
                        ? "bg-primary opacity-100"
                        : "bg-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100"
                    )}
                  >
                    {isCurrentTrack && isPlaying ? (
                      <Pause className="w-4 h-4 text-primary-foreground" />
                    ) : (
                      <Play className="w-4 h-4 text-white ml-0.5" />
                    )}
                  </motion.div>

                  {/* Now playing indicator */}
                  {isCurrentTrack && isPlaying && (
                    <div className="absolute top-3 left-3 flex items-center gap-1">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1 bg-primary rounded-full"
                          animate={{
                            height: [4, 12, 4],
                          }}
                          transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Genre badge */}
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm text-[10px] text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                    {track.genre}
                  </div>
                </div>
                
                <h3 className="text-sm font-medium text-foreground/90 truncate mb-1">
                  {track.title}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {track.artist}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
