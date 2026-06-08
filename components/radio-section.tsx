"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Radio, Play, Pause, Globe, Signal, Volume2, ChevronDown } from "lucide-react";
import { useMusic, RadioStation } from "@/contexts/music-context";
import { cn } from "@/lib/utils";

const regionColors = {
  UK: "from-blue-500/20 to-red-500/20",
  Europe: "from-blue-500/20 to-yellow-500/20",
  Asia: "from-red-500/20 to-yellow-500/20",
  Americas: "from-red-500/20 to-blue-500/20",
};

const regionFlags = {
  UK: "https://flagcdn.com/w80/gb.png",
  Europe: "https://flagcdn.com/w80/eu.png",
  Asia: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=80&h=80&fit=crop",
  Americas: "https://flagcdn.com/w80/us.png",
};

export function RadioSection() {
  const { radioStations, currentRadio, isPlaying, playRadio, stopRadio, togglePlay, isRadioMode } = useMusic();
  const [selectedRegion, setSelectedRegion] = useState<"all" | "UK" | "Europe" | "Asia" | "Americas">("all");

  const regions = ["all", "UK", "Europe", "Asia", "Americas"] as const;

  const filteredStations = selectedRegion === "all" 
    ? radioStations 
    : radioStations.filter(s => s.region === selectedRegion);

  const groupedByRegion = filteredStations.reduce((acc, station) => {
    if (!acc[station.region]) {
      acc[station.region] = [];
    }
    acc[station.region].push(station);
    return acc;
  }, {} as Record<string, RadioStation[]>);

  const handleStationClick = (station: RadioStation) => {
    if (currentRadio?.id === station.id && isRadioMode) {
      if (isPlaying) {
        togglePlay();
      } else {
        togglePlay();
      }
    } else {
      playRadio(station);
    }
  };

  return (
<div className="space-y-10 pt-19 sm:pt-0 pb-[37px]">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden glass-strong">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-purple-500/10" />
        
        <div className="relative p-8">
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-red-500/30 to-purple-500/30 flex items-center justify-center">
              <Radio className="w-16 h-16 text-foreground/50" />
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Signal className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="text-xs tracking-[0.2em] text-red-400">LIVE</span>
              </div>
              <h1 className="text-4xl font-light tracking-tight text-foreground mb-3">
                World Radio
              </h1>
              <p className="text-muted-foreground">
                {radioStations.length} stations • UK to Asia live streams
              </p>
            </div>
          </div>

          {/* Now Playing */}
          {currentRadio && isRadioMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 glass rounded-xl flex items-center gap-4"
            >
              <div className="relative">
                <img
                  src={currentRadio.logo}
                  alt={currentRadio.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                {isPlaying && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{currentRadio.name}</p>
                <p className="text-xs text-muted-foreground">{currentRadio.country} • {currentRadio.genre}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Signal className="w-3 h-3 text-red-400" />
                  <span className="text-[10px] text-red-400">LIVE NOW</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="p-3 rounded-full bg-primary hover:bg-primary/80 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-primary-foreground" />
                  ) : (
                    <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
                  )}
                </button>
                <button
                  onClick={stopRadio}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors text-muted-foreground"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Region Filter */}
      <section>
        <div className="flex items-center justify-between gap-4 mb-[-18px]">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs tracking-[0.2em] text-muted-foreground"></span>
          </div>

          {/* Region dropdown */}
          <div className="flex items-center relative">
            <label className="sr-only">Region</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value as typeof selectedRegion)}
              className={cn(
                "ml-auto px-4 py-2 pr-10 rounded-xl glass-strong text-[10px] tracking-[0.2em] uppercase text-foreground/80 outline-none cursor-pointer appearance-none",
                "border border-white/10 hover:bg-white/10 transition-colors min-w-[140px] text-center"
              )}
            >
              {regions.map((region) => (
                <option key={region} value={region} className="bg-[#1A1A1F] text-foreground">
                  {region === "all" ? "All Regions" : region}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Stations by Region */}
      {Object.entries(groupedByRegion).map(([region, stations]) => (
        <section key={region}>
          <div className="flex items-center gap-3 mb-[-35px]">
            <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center overflow-hidden", regionColors[region as keyof typeof regionColors])}>
              <img 
                src={regionFlags[region as keyof typeof regionFlags]} 
                alt={region}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-lg font-light text-foreground">{region}</h2>
            <span className="text-xs text-muted-foreground">({stations.length} stations)</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {stations.map((station, index) => {
              const isActive = currentRadio?.id === station.id && isRadioMode;
              
              return (
                <motion.button
                  key={station.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleStationClick(station)}
                  className={cn(
                    "relative p-4 rounded-2xl text-left transition-all group",
                    isActive
                      ? "glass-strong ring-1 ring-primary/30"
                      : "glass hover:bg-white/5"
                  )}
                >
                  {/* Live indicator */}
                  <div className="absolute top-3 right-3 flex items-center gap-1">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      isActive && isPlaying ? "bg-red-500 animate-pulse" : "bg-green-500"
                    )} />
                    <span className="text-[10px] text-muted-foreground">LIVE</span>
                  </div>

                  {/* Station Logo */}
                  <div className="relative mb-4">
                    <img
                      src={station.logo}
                      alt={station.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    
                    {/* Play overlay */}
                    <div className={cn(
                      "absolute inset-0 flex items-center justify-center rounded-xl transition-opacity",
                      isActive ? "opacity-100 bg-black/40" : "opacity-0 group-hover:opacity-100 bg-black/40"
                    )}>
                      {isActive && isPlaying ? (
                        <Pause className="w-6 h-6 text-white" />
                      ) : (
                        <Play className="w-6 h-6 text-white ml-0.5" />
                      )}
                    </div>
                  </div>

                  {/* Station Info */}
                  <h3 className={cn(
                    "text-sm font-medium truncate transition-colors",
                    isActive ? "text-primary" : "text-foreground"
                  )}>
                    {station.name}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {station.country}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">
                    {station.genre}
                  </p>

                  {/* Sound waves animation */}
                  {isActive && isPlaying && (
                    <div className="absolute bottom-4 right-4 flex items-end gap-[2px]">
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-[2px] bg-primary rounded-full"
                          animate={{ height: [3, 12, 3] }}
                          transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
