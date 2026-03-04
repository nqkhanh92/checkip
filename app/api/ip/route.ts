import { type NextRequest, NextResponse } from "next/server";
import { getIpFromRequest, isPrivateIp, detectIpVersion } from "@/lib/get-ip";
import { type IpApiResponse, type IpInfo } from "@/types/ip-info";

// Simple in-memory cache: ip → { data, cachedAt }
const cache = new Map<string, { data: IpInfo; cachedAt: number }>();
const CACHE_TTL_MS = 60_000; // 60 seconds

export async function GET(req: NextRequest) {
  const ip = getIpFromRequest(req);

  // Fallback for local dev
  const resolvedIp = ip ?? "8.8.8.8";

  if (isPrivateIp(resolvedIp)) {
    return NextResponse.json(
      { error: "local", message: "Running on a local network — no public IP detected." },
      { status: 200 }
    );
  }

  // Check cache
  const cached = cache.get(resolvedIp);
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
    return NextResponse.json(cached.data);
  }

  try {
    const fields = "status,country,countryCode,city,regionName,timezone,lat,lon,isp,org,as,proxy,hosting";
    const geoRes = await fetch(
      `http://ip-api.com/json/${resolvedIp}?fields=${fields}&lang=en`,
      { next: { revalidate: 60 } }
    );

    if (!geoRes.ok) throw new Error("ip-api.com request failed");

    const geo: IpApiResponse = await geoRes.json();

    const info: IpInfo = {
      ip: resolvedIp,
      version: detectIpVersion(resolvedIp),
      location: {
        country: geo.status === "success" ? geo.country : "Unknown",
        countryCode: geo.status === "success" ? geo.countryCode : "",
        city: geo.status === "success" ? geo.city : "Unknown",
        region: geo.status === "success" ? geo.regionName : "Unknown",
        timezone: geo.status === "success" ? geo.timezone : "Unknown",
        lat: geo.lat ?? 0,
        lon: geo.lon ?? 0,
      },
      network: {
        isp: geo.status === "success" ? geo.isp : "Unknown",
        org: geo.status === "success" ? geo.org : "Unknown",
        asn: geo.status === "success" ? geo.as : "Unknown",
      },
      security: {
        isProxy: geo.proxy ?? false,
        isVpn: geo.proxy ?? false, // ip-api free combines proxy+vpn
        isTor: geo.hosting ?? false,
      },
    };

    cache.set(resolvedIp, { data: info, cachedAt: Date.now() });

    return NextResponse.json(info);
  } catch {
    // Return IP with empty geo if enrichment fails
    const fallback: IpInfo = {
      ip: resolvedIp,
      version: detectIpVersion(resolvedIp),
      location: { country: "—", countryCode: "", city: "—", region: "—", timezone: "—", lat: 0, lon: 0 },
      network: { isp: "—", org: "—", asn: "—" },
      security: { isProxy: false, isVpn: false, isTor: false },
    };
    return NextResponse.json(fallback);
  }
}
