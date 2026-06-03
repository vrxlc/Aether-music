"use client";

import { useMusic } from "@/contexts/music-context";
import { motion } from "framer-motion";

const colorThemes = {
  sage: {
    primary: "rgba(168, 181, 160, 0.15)",
    secondary: "rgba(143, 160, 133, 0.1)",
    tertiary: "rgba(201, 212, 192, 0.08)",
  },
  warm: {
    primary: "rgba(212, 201, 160, 0.15)",
    secondary: "rgba(201, 180, 140, 0.1)",
    tertiary: "rgba(220, 200, 170, 0.08)",
  },
  cool: {
    primary: "rgba(160, 181, 201, 0.15)",
    secondary: "rgba(140, 165, 190, 0.1)",
    tertiary: "rgba(170, 190, 210, 0.08)",
  },
  prismatic: {
    primary: "rgba(192, 168, 181, 0.15)",
    secondary: "rgba(168, 181, 192, 0.1)",
    tertiary: "rgba(181, 192, 168, 0.08)",
  },
};

export function DynamicBackground() {
  const { currentTrack } = useMusic();
  const theme = currentTrack?.colorTheme || "sage";
  const colors = colorThemes[theme];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base dark canvas */}
      <div className="absolute inset-0 bg-[#0D0D11]" />
      
      {/* Animated gradient orbs */}
      <motion.div
        key={`orb1-${theme}`}
        className="absolute w-[800px] h-[800px] rounded-full blur-[120px] animate-gradient-shift"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{
          background: colors.primary,
          top: "-20%",
          right: "-10%",
        }}
      />
      <motion.div
        key={`orb2-${theme}`}
        className="absolute w-[600px] h-[600px] rounded-full blur-[100px] animate-gradient-shift"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        style={{
          background: colors.secondary,
          bottom: "-10%",
          left: "-5%",
          animationDelay: "-3s",
        }}
      />
      <motion.div
        key={`orb3-${theme}`}
        className="absolute w-[400px] h-[400px] rounded-full blur-[80px] animate-gradient-shift"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.4 }}
        style={{
          background: colors.tertiary,
          top: "40%",
          left: "30%",
          animationDelay: "-5s",
        }}
      />

      {/* Subtle grain texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
