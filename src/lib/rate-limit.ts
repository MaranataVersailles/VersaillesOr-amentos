type RateLimitInfo = {
  count: number;
  blockedUntil: number | null;
};

// Use globalThis to persist the map across Fast Refresh in dev mode
const globalScope = globalThis as unknown as {
  __rateLimitMap?: Map<string, RateLimitInfo>;
};

if (!globalScope.__rateLimitMap) {
  globalScope.__rateLimitMap = new Map<string, RateLimitInfo>();
}

export const rateLimitMap = globalScope.__rateLimitMap;

const MAX_FAILURES = 5;
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutos

export function getRateLimitStatus(ip: string): { blocked: boolean; message?: string } {
  const now = Date.now();
  const info = rateLimitMap.get(ip);

  if (info && info.blockedUntil && info.blockedUntil > now) {
    const remainingMinutes = Math.ceil((info.blockedUntil - now) / 60000);
    return {
      blocked: true,
      message: `Muitas tentativas. Bloqueado. Tente novamente em ${remainingMinutes} min.`,
    };
  }

  // Se o tempo passou, remove o bloqueio
  if (info && info.blockedUntil && info.blockedUntil <= now) {
    rateLimitMap.delete(ip);
  }

  return { blocked: false };
}

export function registerFailedLogin(ip: string): { blocked: boolean; message?: string } {
  const now = Date.now();
  const info = rateLimitMap.get(ip) || { count: 0, blockedUntil: null };

  info.count += 1;

  if (info.count >= MAX_FAILURES) {
    info.blockedUntil = now + BLOCK_DURATION_MS;
    rateLimitMap.set(ip, info);
    console.warn(`🚨 [SEGURANÇA] IP Bloqueado por força bruta: ${ip}`);
    return {
      blocked: true,
      message: `Muitas tentativas. Bloqueado. Tente novamente em 15 min.`,
    };
  }

  console.log(`⚠️ [SEGURANÇA] Tentativa falha de login do IP: ${ip} (Tentativa ${info.count}/${MAX_FAILURES})`);
  rateLimitMap.set(ip, info);
  return { blocked: false };
}


export function resetLoginAttempts(ip: string) {
  rateLimitMap.delete(ip);
}
