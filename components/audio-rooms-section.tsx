"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Globe, MessageCircle, Sparkles, Flame, Heart, Zap, X } from "lucide-react";
import { useMusic, type Room } from "@/contexts/music-context";
import { cn } from "@/lib/utils";

interface Particle {
  id: number;
  emoji: string;
  x: number;
}

function RoomCard({ room }: { room: Room }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showChat, setShowChat] = useState(false);

  const triggerReaction = useCallback((emoji: string, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    const newParticle: Particle = {
      id: Date.now(),
      emoji,
      x,
    };
    
    setParticles((prev) => [...prev, newParticle]);
    
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 1500);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="relative rounded-2xl glass-strong p-5 overflow-hidden"
    >
      {/* Floating particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ y: 0, opacity: 1, scale: 1 }}
            animate={{ y: -100, opacity: 0, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute bottom-20 text-2xl pointer-events-none z-20"
            style={{ left: particle.x }}
          >
            {particle.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Room Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-medium text-foreground">{room.name}</h3>
            {room.isPublic ? (
              <Globe className="w-3.5 h-3.5 text-muted-foreground" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">Hosted by {room.host}</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          Join
        </motion.button>
      </div>

      {/* Current Track */}
      {room.currentTrack && (
        <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-white/[0.02]">
          <img
            src={room.currentTrack.artwork}
            alt={room.currentTrack.title}
            className="w-10 h-10 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground truncate">
              {room.currentTrack.title}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {room.currentTrack.artist}
            </p>
          </div>
          
          {/* Now playing indicator */}
          <div className="flex items-center gap-[2px]">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-[2px] bg-primary/60 rounded-full"
                animate={{ height: [3, 10, 3] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Listeners */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex -space-x-2">
          {room.listeners.slice(0, 5).map((listener) => (
            <div key={listener.id} className="relative">
              <div
                className={cn(
                  "w-8 h-8 rounded-full border-2 border-[#0D0D11] overflow-hidden",
                  listener.isActive && "ring-2 ring-primary/50"
                )}
              >
                <img
                  src={listener.avatar}
                  alt={listener.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Active pulse */}
              {listener.isActive && (
                <>
                  <div className="absolute inset-0 rounded-full border border-primary/30 animate-pulse-ring" />
                  <div
                    className="absolute inset-0 rounded-full border border-primary/20 animate-pulse-ring"
                    style={{ animationDelay: "0.5s" }}
                  />
                </>
              )}
            </div>
          ))}
          
          {room.listeners.length > 5 && (
            <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-[#0D0D11] flex items-center justify-center">
              <span className="text-[10px] text-muted-foreground">
                +{room.listeners.length - 5}
              </span>
            </div>
          )}
        </div>

        <span className="text-xs text-muted-foreground">
          {room.listeners.filter((l) => l.isActive).length} listening
        </span>
      </div>

      {/* Reaction Bar */}
      <div className="flex items-center gap-2">
        {[
          { emoji: "🔥", icon: Flame, color: "text-orange-400" },
          { emoji: "💖", icon: Heart, color: "text-pink-400" },
          { emoji: "⚡", icon: Zap, color: "text-yellow-400" },
          { emoji: "✨", icon: Sparkles, color: "text-blue-400" },
        ].map(({ emoji, icon: Icon, color }) => (
          <motion.button
            key={emoji}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => triggerReaction(emoji, e)}
            className={cn(
              "flex-1 py-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors flex items-center justify-center",
              color
            )}
          >
            <Icon className="w-4 h-4" />
          </motion.button>
        ))}
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowChat(!showChat)}
          className="flex-1 py-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors flex items-center justify-center text-muted-foreground"
        >
          <MessageCircle className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Chat Drawer */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-4"
          >
            <div className="p-3 rounded-xl bg-white/[0.02] space-y-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-muted-foreground">Room Chat</span>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              
              {[
                { user: "Alex", message: "This track is amazing! 🎵" },
                { user: "Sam", message: "Perfect vibes for tonight" },
              ].map((chat, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-xs text-primary">{chat.user}:</span>
                  <span className="text-xs text-foreground/70">{chat.message}</span>
                </div>
              ))}
              
              <input
                type="text"
                placeholder="Send a message..."
                className="w-full mt-2 px-3 py-2 rounded-lg bg-white/[0.03] text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function AudioRoomsSection() {
  const { rooms } = useMusic();

  return (
    <div className="space-y-10">
      {/* Header */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="text-2xl font-light tracking-wide text-foreground mb-2">
              Audio Rooms
            </h1>
            <p className="text-muted-foreground text-sm">
              Listen together with friends in real-time
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 rounded-xl glass text-sm font-medium text-foreground hover:bg-white/[0.06] transition-colors"
          >
            Create Room
          </motion.button>
        </div>
      </section>

      {/* Active Rooms */}
      <section>
        <h2 className="text-sm tracking-[0.1em] text-muted-foreground mb-4">
          LIVE NOW
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {rooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <RoomCard room={room} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Create Room CTA */}
      <section>
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="rounded-2xl glass-strong p-8 text-center cursor-pointer"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mx-auto mb-4 flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-primary/70" />
          </div>
          <h3 className="text-lg font-light text-foreground mb-2">
            Start Your Own Room
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Create a private or public listening room and invite friends to sync up 
            and experience music together in real-time.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
