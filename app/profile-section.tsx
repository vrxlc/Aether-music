"use client";

import { motion } from "framer-motion";
import { User, Mail, ShieldCheck, Music, Heart, Settings, Camera, LogOut, CreditCard } from "lucide-react";
import { useMusic } from "@/contexts/music-context";
import { cn } from "@/lib/utils";

export function ProfileSection() {
  const { userProfile, likedSongIds, playlists } = useMusic();

  const handleEditClick = () => {
    window.dispatchEvent(new CustomEvent("open-profile"));
  };

  return (
    <div className="space-y-6 pt-4 pb-12 sm:pt-0">
      {/* Profile Header Card */}
      <section className="relative rounded-3xl overflow-hidden glass-strong p-8 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        
        <div className="relative flex flex-col items-center space-y-4">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-105">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <button 
              onClick={handleEditClick}
              className="absolute bottom-0 right-0 p-2.5 rounded-full bg-primary text-primary-foreground shadow-xl transition-transform active:scale-90"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-light tracking-tight text-foreground">
              {userProfile.name}
            </h1>
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs font-light">
              <Mail className="w-3 h-3" />
              <span>{userProfile.email}</span>
            </div>
          </div>

          {userProfile.isPremium && (
            <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20 flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[9px] uppercase tracking-[0.25em] text-amber-400 font-medium">
                Aether Premium
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Analytics/Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          whileTap={{ scale: 0.98 }}
          className="glass rounded-2xl p-5 flex flex-col items-center space-y-2 border border-white/5"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <span className="text-xl font-light text-foreground">{likedSongIds.length}</span>
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Loved Tracks</span>
        </motion.div>
        <motion.div 
          whileTap={{ scale: 0.98 }}
          className="glass rounded-2xl p-5 flex flex-col items-center space-y-2 border border-white/5"
        >
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
            <Music className="w-5 h-5" />
          </div>
          <span className="text-xl font-light text-foreground">{playlists.length}</span>
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Collections</span>
        </motion.div>
      </div>

      {/* About Section */}
      <section className="glass rounded-2xl p-6 space-y-3 border border-white/5">
        <div className="flex items-center gap-2 text-muted-foreground opacity-60">
          <User className="w-3.5 h-3.5" />
          <h2 className="text-[10px] uppercase tracking-[0.2em] font-medium">Identity</h2>
        </div>
        <p className="text-sm font-light leading-relaxed text-foreground/70 italic">
          &quot;{userProfile.bio}&quot;
        </p>
      </section>

      {/* Preferences & Management */}
      <section className="space-y-3">
        <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 px-2 font-medium">Member Access</h2>
        <div className="space-y-2">
          <button 
            onClick={handleEditClick}
            className="w-full flex items-center justify-between p-4 rounded-xl glass hover:bg-white/5 transition-colors group border border-white/5"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-sm font-light">Account Preferences</span>
            </div>
            <span className="text-[10px] text-muted-foreground bg-white/5 px-2 py-1 rounded-md uppercase tracking-tighter">Edit</span>
          </button>
          
          <div className="p-4 rounded-xl glass space-y-4 border border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-light">Billing & Plan</span>
              </div>
              <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium">Active</span>
            </div>
            <div className="h-[1px] bg-white/5" />
            <button className="w-full flex items-center gap-3 text-red-400/80 hover:text-red-400 transition-colors pt-1">
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-light">Sign Out</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}