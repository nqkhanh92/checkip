import { ShieldAlert, ShieldCheck, EyeOff } from "lucide-react";
import type { IpSecurity } from "@/types/ip-info";

interface SecurityBadgeProps {
  security: IpSecurity;
}

export function SecurityBadge({ security }: SecurityBadgeProps) {
  const { isProxy, isVpn, isTor } = security;
  const hasIssue = isProxy || isVpn || isTor;

  if (!hasIssue) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium animate-fade-in">
        <ShieldCheck size={13} />
        No VPN / Proxy / Tor detected
      </div>
    );
  }

  const labels: string[] = [];
  if (isTor) labels.push("Tor");
  if (isVpn) labels.push("VPN");
  if (isProxy && !isVpn) labels.push("Proxy");

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium animate-fade-in">
      {isTor ? <EyeOff size={13} /> : <ShieldAlert size={13} />}
      {labels.join(" / ")} Detected
    </div>
  );
}
