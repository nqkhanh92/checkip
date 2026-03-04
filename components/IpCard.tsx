"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface IpCardProps {
  ip: string;
  version: "IPv4" | "IPv6";
}

export function IpCard({ ip, version }: IpCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col items-center gap-3 animate-fade-in">
      <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">
        Your Public IP
      </p>

      <button
        onClick={handleCopy}
        className={cn(
          "group relative flex items-center gap-3 px-6 py-4 rounded-2xl",
          "bg-slate-800/60 border border-slate-700/50",
          "hover:bg-slate-700/60 hover:border-slate-600",
          "transition-all duration-200 cursor-pointer",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        )}
        title="Click to copy"
      >
        <span className="font-mono text-3xl md:text-4xl font-bold text-white tracking-tight">
          {ip}
        </span>
        <span
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
            copied
              ? "text-green-400"
              : "text-slate-400 group-hover:text-slate-200"
          )}
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </span>
      </button>

      {copied && (
        <span className="text-xs text-green-400 font-medium animate-fade-in">
          Copied to clipboard!
        </span>
      )}

      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse-slow" />
        {version}
      </span>
    </div>
  );
}
