"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, ShieldCheck, Music, Heart, Settings, Camera, LogOut, CreditCard, X, Zap, Check } from "lucide-react";
import { useMusic } from "@/contexts/music-context";
import { cn } from "@/lib/utils";

export function ProfileSection() {
  const { userProfile, likedSongIds, playlists } = useMusic();
  const [showSubscription, setShowSubscription] = useState(false);

  const handleEditClick = () => {
    window.dispatchEvent(new CustomEvent("open-profile"));
  };

  return (
    <div className="space-y-6 pt-20 pb-11 md:pt-4">
      {/* Subscription Membership Pop-up */}
      <AnimatePresence>
        {showSubscription && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSubscription(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-[#1a1a24] to-black border border-white/10 shadow-2xl"
            >
              <button 
                onClick={() => setShowSubscription(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-white/50 hover:text-white transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8 pt-10 text-center">
                <h2 className="text-xl font-bold tracking-tight text-white mb-8">
                  Subscribe For New Membership
                </h2>

                {/* WealthNest PRO Card */}
                <div className="relative mb-6 rounded-[2rem] bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-7 text-left shadow-lg group overflow-hidden">
                  <div className="absolute -top-4 -right-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <Zap className="w-32 h-32 fill-white" />
                  </div>
                  
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1 rounded-md bg-white/20">
                        <Zap className="w-3.5 h-3.5 text-white fill-white" />
                      </div>
                      <span className="text-xs font-bold text-white tracking-widest uppercase">WealthNest PRO</span>
                    </div>
                    
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-white">£35.99</span>
                      <span className="text-base text-white/40 line-through font-light">£42.99</span>
                    </div>
                  </div>
                </div>

                {/* Plan Details Card */}
                <div className="bg-white/[0.03] rounded-[2rem] p-6 border border-white/5 text-left mb-8">
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[11px] font-semibold text-white/60 uppercase tracking-widest">Monthly plan</span>
                    <span className="px-2.5 py-1 rounded-full bg-white text-black text-[9px] font-black uppercase">20% OFF</span>
                  </div>

                  <ul className="space-y-3.5">
                    {[
                      "All Free Features",
                      "Priority Support",
                      "Premium Content",
                      "Ad-free Experience"
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <Check className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-sm font-light text-white/70">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="w-full py-4 rounded-full bg-white text-black font-bold text-sm hover:bg-neutral-200 transition-all active:scale-[0.97] shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
                  Start monthly trial
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
          
          <div className="p-4 rounded-xl glass border border-white/5 flex flex-col">
            <button 
              onClick={() => setShowSubscription(true)}
              className="flex items-center justify-between hover:bg-white/5 transition-colors p-2 -m-2 rounded-lg group/billing mb-[14px]"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-muted-foreground group-hover/billing:text-foreground transition-colors" />
                <span className="text-sm font-light">Billing & Plan</span>
              </div>
              <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium">Active</span>
            </button>
            <div className="h-[1px] bg-white/5 mb-4" />
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent("sign-out"))}
              className="w-full flex items-center gap-3 text-red-400/80 hover:text-red-400 transition-colors pt-1"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-light">Sign Out</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}