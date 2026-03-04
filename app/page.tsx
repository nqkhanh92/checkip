"use client";

import { useEffect, useState, useCallback } from "react";
import { RefreshCw, Globe } from "lucide-react";
import { IpCard } from "@/components/IpCard";
import { InfoGrid } from "@/components/InfoGrid";
import { SecurityBadge } from "@/components/SecurityBadge";
import { IpSkeleton } from "@/components/IpSkeleton";
import type { IpInfo } from "@/types/ip-info";

type State =
  | { status: "loading" }
  | { status: "local" }
  | { status: "error" }
  | { status: "success"; data: IpInfo };

export default function HomePage() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [refreshing, setRefreshing] = useState(false);

  const fetchIp = useCallback(async () => {
    try {
      const res = await fetch("/api/ip", { cache: "no-store" });
      const json = await res.json();

      if (json.error === "local") {
        setState({ status: "local" });
        return;
      }

      setState({ status: "success", data: json as IpInfo });
    } catch {
      setState({ status: "error" });
    }
  }, []);

  useEffect(() => {
    fetchIp();
  }, [fetchIp]);

  async function handleRefresh() {
    setRefreshing(true);
    setState({ status: "loading" });
    await fetchIp();
    setRefreshing(false);
  }

  return (
    <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16 gap-10">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2 text-blue-400 mb-1">
          <Globe size={20} />
          <span className="text-sm font-medium tracking-wide uppercase">
            IP Address Lookup
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          What&apos;s My IP?
        </h1>
        <p className="text-slate-400 text-sm max-w-xs text-center">
          Your public IP address, location, and network info — detected automatically.
        </p>
      </div>

      {/* Main content */}
      {state.status === "loading" && <IpSkeleton />}

      {state.status === "local" && (
        <div className="flex flex-col items-center gap-3 text-center animate-fade-in">
          <p className="text-2xl">🏠</p>
          <p className="text-slate-300 font-medium">Local Network Detected</p>
          <p className="text-slate-500 text-sm max-w-xs">
            You&apos;re running on a private network. Deploy to a server to see your real public IP.
          </p>
        </div>
      )}

      {state.status === "error" && (
        <div className="flex flex-col items-center gap-3 text-center animate-fade-in">
          <p className="text-2xl">⚠️</p>
          <p className="text-slate-300 font-medium">Could not fetch IP info</p>
          <button
            onClick={handleRefresh}
            className="text-sm text-blue-400 hover:text-blue-300 underline underline-offset-4"
          >
            Try again
          </button>
        </div>
      )}

      {state.status === "success" && (
        <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
          <IpCard ip={state.data.ip} version={state.data.version} />
          <SecurityBadge security={state.data.security} />
          <InfoGrid location={state.data.location} network={state.data.network} />
        </div>
      )}

      {/* Refresh button */}
      {state.status !== "loading" && (
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-slate-200 border border-slate-700/50 hover:border-slate-600 bg-slate-800/30 hover:bg-slate-800/60 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      )}

      {/* Footer */}
      <footer className="absolute bottom-4 text-xs text-slate-600 text-center">
        IP data provided by{" "}
        <a
          href="https://ip-api.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-slate-400 underline underline-offset-2 transition-colors"
        >
          ip-api.com
        </a>
        {" "}· No data is stored or logged.
      </footer>
    </main>
  );
}
