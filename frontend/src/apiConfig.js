// Dynamic API Base URL resolver
// Works seamlessly in:
// 1. Local Vite dev (port 5173 -> backend port 8080)
// 2. Local Wi-Fi party mode (192.168.x.x)
// 3. Cloud / Production deployment (relative /api/cinespy with SSL support)

export function getApiBase() {
  // If running in Vite development server (port 5173)
  if (window.location.port === '5173') {
    const protocol = window.location.protocol || 'http:';
    const host = window.location.hostname || 'localhost';
    return `${protocol}//${host}:8080/api/cinespy`;
  }
  // Production build: whether served by Spring Boot directly or reverse proxy
  return '/api/cinespy';
}

let cachedLanIp = null;

export async function fetchLanIp() {
  const currentHost = window.location.hostname;
  
  // If already on a domain or public IP or LAN IP, use current host
  const isLocalhost = currentHost === 'localhost' || currentHost === '127.0.0.1';
  if (!isLocalhost) {
    return currentHost;
  }

  if (cachedLanIp) return cachedLanIp;

  try {
    const res = await fetch(`${getApiBase()}/network-info`);
    if (res.ok) {
      const data = await res.json();
      if (data?.lanIp && data.lanIp !== 'localhost') {
        cachedLanIp = data.lanIp;
        return data.lanIp;
      }
    }
  } catch (err) {
    console.warn('Network info fetch error:', err);
  }
  return currentHost;
}

