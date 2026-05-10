/**
 * SSRF protection for the security audit endpoint.
 *
 * Blocks any URL that resolves to a private, loopback, link-local,
 * multicast, or cloud-metadata IP address before a fetch is made.
 * Defense-in-depth: the Python microservice runs its own SSRF check too.
 */

import { promises as dns } from "dns";
import { isIP } from "net";

// Cloud metadata IPs not covered by standard private-range checks
const BLOCKED_METADATA_IPS = new Set([
  "169.254.169.254", // AWS / GCP / Azure IMDS  (also link-local, caught below)
  "100.100.100.200", // Alibaba Cloud metadata
  "192.0.0.192",     // GCP internal metadata alias
]);

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "localhost.localdomain",
  "ip6-localhost",
  "ip6-loopback",
]);

function isPrivateIp(ip: string): boolean {
  if (BLOCKED_METADATA_IPS.has(ip)) return true;

  // IPv4 range checks
  if (isIP(ip) === 4) {
    const parts = ip.split(".").map(Number);
    const [a, b] = parts;
    if (a === 0) return true;                           // 0.0.0.0/8     — unspecified
    if (a === 10) return true;                          // 10.0.0.0/8    — RFC-1918
    if (a === 100 && b >= 64 && b <= 127) return true; // 100.64.0.0/10 — CGNAT
    if (a === 127) return true;                         // 127.0.0.0/8   — loopback
    if (a === 169 && b === 254) return true;            // 169.254.0.0/16 — link-local
    if (a === 172 && b >= 16 && b <= 31) return true;  // 172.16.0.0/12 — RFC-1918
    if (a === 192 && b === 0) return true;              // 192.0.0.0/24  — IETF protocol
    if (a === 192 && b === 168) return true;            // 192.168.0.0/16 — RFC-1918
    if (a >= 224 && a <= 239) return true;             // 224.0.0.0/4   — multicast
    if (a >= 240) return true;                         // 240.0.0.0/4   — reserved
    return false;
  }

  // IPv6 range checks
  const lower = ip.toLowerCase();
  if (lower === "::1") return true;                              // loopback
  if (lower === "::") return true;                               // unspecified
  if (lower.startsWith("fc") || lower.startsWith("fd")) return true; // ULA fc00::/7
  if (lower.startsWith("fe80")) return true;                     // link-local fe80::/10
  if (lower.startsWith("ff")) return true;                       // multicast ff00::/8

  return false;
}

/**
 * Returns true only if the URL is safe to use as an audit target.
 *
 * Rejects:
 *  - Non-http/https schemes
 *  - Hostnames that resolve to private / loopback / link-local / cloud-metadata IPs
 *  - Hostnames that fail DNS resolution (unknown target)
 *  - Direct private IPs in the URL
 */
export async function isSafeAuditUrl(url: string): Promise<boolean> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }

  if (!["http:", "https:"].includes(parsed.protocol)) return false;

  const hostname = parsed.hostname;
  if (!hostname) return false;
  if (BLOCKED_HOSTNAMES.has(hostname.toLowerCase())) return false;

  // If the URL contains a raw IP, check it directly without DNS lookup
  if (isIP(hostname) !== 0) {
    return !isPrivateIp(hostname);
  }

  // Resolve hostname — uses the same resolver Node.js fetch would use
  try {
    const { address } = await dns.lookup(hostname);
    return !isPrivateIp(address);
  } catch {
    return false; // Resolution failure → reject (unknown destination)
  }
}
