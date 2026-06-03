"use client";

import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Volume1,
  Maximize2,
  Heart,
  Shuffle,
  Repeat,
  Radio,
  Signal,
} from "lucide-react";
import { useMusic } from "@/contexts/music-context";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

function Waveform({ isPlaying }: { isPlaying: boolean }) {
  const bars = 40;

  return (
    <div className="flex items-center gap-[2px] h-8">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] bg-gradient-to-t from-primary/40 to-primary/80 rounded-full"
          animate={
            isPlaying
              ? {
                  height: [8, Math.random() * 24 + 8, 8],
                }
              : { height: 8 }
          }
          transition={{
            duration: 0.5 + Math.random() * 0.3,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.02,
          }}
        />
      ))}
    </div>
  );
}

function VinylModal({ onClose }: { onClose: () => void }) {
  const { currentTrack, isPlaying } = useMusic();

  if (!currentTrack) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative z-10 flex flex-col items-center gap-12"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Vinyl disc */}
        <div className="relative">
          <motion.div
            className="w-72 h-72 rounded-full relative"
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={
              isPlaying
                ? {
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }
                : {}
            }
            style={{
              background: `
                radial-gradient(circle at center, #1a1a1a 0%, #0a0a0a 30%),
                conic-gradient(from 0deg, #1a1a1a, #2a2a2a, #1a1a1a, #2a2a2a, #1a1a1a)
              `,
              boxShadow:
                "0 0 60px rgba(0,0,0,0.5), inset 0 0 30px rgba(0,0,0,0.5)",
            }}
          >
            {/* Grooves */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full border border-white/[0.03]"
                style={{
                  inset: `${20 + i * 10}px`,
                }}
              />
            ))}

            {/* Center label */}
            <div className="absolute inset-[90px] rounded-full overflow-hidden">
              <img
                src={currentTrack.artwork}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Center hole */}
            <div className="absolute inset-[130px] rounded-full bg-[#0D0D11]" />
          </motion.div>
        </div>

        {/* Track info */}
        <div className="text-center">
          <h2 className="text-2xl font-light tracking-wide text-foreground mb-2">
            {currentTrack.title}
          </h2>
          <p className="text-muted-foreground">{currentTrack.artist}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function MediaPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlay,
    seekTo,
    setVolume,
    toggleMute,
    showExpanded,
    setShowExpanded,
    nextTrack,
    previousTrack,
    toggleLike,
    isLiked,
    currentRadio,
    isRadioMode,
    stopRadio,
  } = useMusic();

  const formatTime = useCallback((seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const handleProgressChange = useCallback(
    (value: number[]) => {
      if (currentTrack && duration && !isRadioMode) {
        const newTime = (value[0] / 100) * duration;
        seekTo(newTime);
      }
    },
    [currentTrack, duration, seekTo, isRadioMode]
  );

  const handleVolumeChange = useCallback(
    (value: number[]) => {
      setVolume(value[0] / 100);
    },
    [setVolume]
  );

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className="w-5 h-5" />;
    if (volume < 0.5) return <Volume1 className="w-5 h-5" />;
    return <Volume2 className="w-5 h-5" />;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const playerShellClass =
    "fixed bottom-4 left-4 right-4 md:left-72 md:right-8 z-40";

  // Show radio player if in radio mode
  if (isRadioMode && currentRadio) {
    return (
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={playerShellClass}
      >
        <div className="glass-strong rounded-2xl p-4 shadow-2xl shadow-black/20">
          <div className="flex items-center gap-6">
            {/* Radio Info */}
            <div className="flex items-center gap-4 min-w-[240px]">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden">
                <img
                  src={currentRadio.logo}
                  alt={currentRadio.name}
                  className="w-full h-full object-cover"
                />
                {isPlaying && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                )}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground truncate max-w-[140px]">
                    {currentRadio.name}
                  </p>
                  <div className="flex items-center gap-1">
                    <Signal className="w-3 h-3 text-red-400" />
                    <span className="text-[10px] text-red-400">LIVE</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                  {currentRadio.country} • {currentRadio.genre}
                </p>
              </div>
            </div>

            {/* Radio Icon */}
            <div className="text-muted-foreground">
              <Radio className="w-5 h-5" />
            </div>

            {/* Center Controls */}
            <div className="flex-1 flex flex-col items-center gap-2">
              {/* Playback Controls */}
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-background" />
                  ) : (
                    <Play className="w-5 h-5 text-background ml-0.5" />
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={stopRadio}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Stop Radio
                </motion.button>
              </div>

              {/* Live indicator */}
              <div className="flex items-center gap-2">
                <div className="flex items-end gap-[2px]">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-[3px] bg-red-500/60 rounded-full"
                      animate={isPlaying ? { height: [4, 12, 4] } : { height: 4 }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">Live Broadcast</span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2 min-w-[140px]">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMute}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {getVolumeIcon()}
              </motion.button>

              <div className="flex-1">
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Show empty state if no track or radio
  if (!currentTrack) {
    return (
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={playerShellClass}
      >
        <div className="glass-strong rounded-2xl p-4 shadow-2xl shadow-black/20">
          <div className="flex items-center justify-center py-2">
            <p className="text-muted-foreground text-sm">
              Select a track to start playing
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  const trackIsLiked = isLiked(currentTrack.id);

  return (
    <>
      <AnimatePresence>
        {showExpanded && <VinylModal onClose={() => setShowExpanded(false)} />}
      </AnimatePresence>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={playerShellClass}
      >
        <div className="glass-strong rounded-2xl p-4 shadow-2xl shadow-black/20">
          <div className="flex items-center gap-6">
            {/* Track Info */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowExpanded(true)}
              className="flex items-center gap-4 min-w-[240px] group"
            >
              <div className="relative w-14 h-14 rounded-xl overflow-hidden">
                <img
                  src={currentTrack.artwork}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Maximize2 className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground truncate max-w-[160px]">
                  {currentTrack.title}
                </p>
                <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                  {currentTrack.artist}
                </p>
              </div>
            </motion.button>

            {/* Like Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleLike(currentTrack.id)}
              className={cn(
                "transition-colors",
                trackIsLiked ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Heart className={cn("w-5 h-5", trackIsLiked && "fill-current")} />
            </motion.button>

            {/* Center Controls & Progress */}
            <div className="flex-1 flex flex-col items-center gap-2">
              {/* Playback Controls */}
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Shuffle className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={previousTrack}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <SkipBack className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-background" />
                  ) : (
                    <Play className="w-5 h-5 text-background ml-0.5" />
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextTrack}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <SkipForward className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Repeat className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-xl flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-10 text-right tabular-nums">
                  {formatTime(currentTime)}
                </span>

                <div className="flex-1 relative group">
                  <Slider
                    value={[progress]}
                    max={100}
                    step={0.1}
                    onValueChange={handleProgressChange}
                    className="cursor-pointer"
                  />
                </div>

                <span className="text-xs text-muted-foreground w-10 tabular-nums">
                  {formatTime(duration || currentTrack.duration)}
                </span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2 min-w-[140px]">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMute}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {getVolumeIcon()}
              </motion.button>

              <div className="flex-1">
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

