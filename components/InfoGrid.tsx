import { MapPin, Wifi, Clock, Building2 } from "lucide-react";
import { countryFlag } from "@/lib/utils";
import type { IpLocation, IpNetwork } from "@/types/ip-info";

interface InfoGridProps {
  location: IpLocation;
  network: IpNetwork;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-slate-700/40 last:border-0">
      <span className="text-xs text-slate-500 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-slate-200 text-right font-medium">{value || "—"}</span>
    </div>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function InfoCard({ icon, title, children }: InfoCardProps) {
  return (
    <div className="flex flex-col rounded-2xl bg-slate-800/40 border border-slate-700/40 p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-slate-400">{icon}</span>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </h2>
      </div>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

export function InfoGrid({ location, network }: InfoGridProps) {
  const flag = countryFlag(location.countryCode);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl animate-fade-in">
      <InfoCard icon={<MapPin size={14} />} title="Location">
        <InfoRow label="Country" value={`${flag}  ${location.country}`} />
        <InfoRow label="City" value={location.city} />
        <InfoRow label="Region" value={location.region} />
        <InfoRow
          label="Timezone"
          value={location.timezone.replace("_", " ")}
        />
      </InfoCard>

      <InfoCard icon={<Building2 size={14} />} title="Network">
        <InfoRow label="ISP" value={network.isp} />
        <InfoRow label="Organization" value={network.org} />
        <InfoRow label="ASN" value={network.asn} />
        <InfoRow
          label="Local Time"
          value={
            location.timezone !== "—"
              ? new Intl.DateTimeFormat("en-US", {
                  timeZone: location.timezone,
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }).format(new Date())
              : "—"
          }
        />
      </InfoCard>
    </div>
  );
}
