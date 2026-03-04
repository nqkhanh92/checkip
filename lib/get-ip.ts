import { type NextRequest } from "next/server";

/**
 * Extract the real public IP from request headers.
 * Priority: CF-Connecting-IP > X-Real-IP > X-Forwarded-For > remoteAddress
 */
export function getIpFromRequest(req: NextRequest): string | null {
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    // "client, proxy1, proxy2" → take first
    const first = forwarded.split(",")[0].trim();
    if (first) return first;
  }

  return null;
}

/** Returns true if IP is a private/loopback address */
export function isPrivateIp(ip: string): boolean {
  return (
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("172.16.") ||
    ip.startsWith("172.17.") ||
    ip.startsWith("172.18.") ||
    ip.startsWith("172.19.") ||
    ip.startsWith("172.2") ||
    ip.startsWith("172.30.") ||
    ip.startsWith("172.31.") ||
    ip.startsWith("fc") ||
    ip.startsWith("fd")
  );
}

/** Detect IPv4 vs IPv6 */
export function detectIpVersion(ip: string): "IPv4" | "IPv6" {
  return ip.includes(":") ? "IPv6" : "IPv4";
}
