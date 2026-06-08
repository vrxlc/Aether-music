"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Music, Chrome, Github, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0D0D11]">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-black" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-[400px] p-8 flex flex-col items-center text-center"
      >
        <div className="mb-8">
          <div className="w-16 h-16 rounded-2xl glass-strong flex items-center justify-center mb-4 mx-auto ring-1 ring-white/10">
            <span className="text-2xl tracking-[0.2em] text-foreground font-light">A</span>
          </div>
          <h1 className="text-3xl font-light tracking-tight text-foreground">Log in to Aether</h1>
        </div>

        <div className="w-full space-y-3 mb-8">
          <Button variant="outline" className="w-full rounded-full py-6 border-white/10 bg-white/5 hover:bg-white/10 flex gap-3 text-sm font-medium">
            <Chrome className="w-5 h-5" />
            Continue with Google
          </Button>
          <Button variant="outline" className="w-full rounded-full py-6 border-white/10 bg-white/5 hover:bg-white/10 flex gap-3 text-sm font-medium">
            <Github className="w-5 h-5" />
            Continue with GitHub
          </Button>
          <Button variant="outline" className="w-full rounded-full py-6 border-white/10 bg-white/5 hover:bg-white/10 flex gap-3 text-sm font-medium">
            <Apple className="w-5 h-5" />
            Continue with Apple
          </Button>
        </div>

        <div className="w-full h-[1px] bg-white/5 mb-8 relative">
          <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0D0D11] px-4 text-[10px] text-muted-foreground uppercase tracking-widest">
            or
          </span>
        </div>

        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div className="space-y-2 text-left">
            <label className="text-xs font-medium text-foreground ml-1">Username</label>
            <Input 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username" 
              className="rounded-lg bg-white/5 border-white/10 focus:ring-primary/50"
            />
          </div>
          <div className="space-y-2 text-left">
            <label className="text-xs font-medium text-foreground ml-1">Email</label>
            <Input 
              required 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com" 
              className="rounded-lg bg-white/5 border-white/10 focus:ring-primary/50"
            />
          </div>
          <div className="space-y-2 text-left">
            <label className="text-xs font-medium text-foreground ml-1">Password</label>
            <Input 
              required 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" 
              className="rounded-lg bg-white/5 border-white/10 focus:ring-primary/50"
            />
          </div>

          <Button 
            disabled={isLoading}
            className="w-full rounded-full py-6 bg-primary text-primary-foreground font-bold text-base mt-4 transition-all active:scale-95"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <button className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors font-light">
          Forgot your password?
        </button>
      </motion.div>
    </div>
  );
}