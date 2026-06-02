// Robust CORS configuration for production (Vercel) + local dev.
//
// Reads CORS_ORIGIN as a comma-separated list. Each entry can be:
//   • An exact origin:   https://app.example.com
//   • A wildcard host:   https://*.vercel.app    (matches every subdomain)
//   • The literal "*"    (allow all — disables credentials per CORS spec)
//
// Usage:
//   import { buildCorsOptions } from './common/cors';
//   app.enableCors(buildCorsOptions(process.env.CORS_ORIGIN));
//

type OriginCallback = (err: Error | null, allow?: boolean) => void;
type CustomOrigin = (origin: string | undefined, callback: OriginCallback) => void;

interface CorsOptions {
  origin: boolean | string | RegExp | (string | RegExp)[] | CustomOrigin;
  credentials?: boolean;
  methods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  maxAge?: number;
  optionsSuccessStatus?: number;
}

const DEFAULT_DEV_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://trading-managment.vercel.app'];

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Convert a pattern like "https://*.vercel.app" into a RegExp. */
function patternToRegex(pattern: string): RegExp {
  // Escape everything, then turn the escaped `\*` back into `.*`
  const escaped = escapeRegex(pattern).replace(/\\\*/g, '.*');
  return new RegExp(`^${escaped}$`);
}

export interface CorsConfig {
  origins: string[];
  allowAll: boolean;
  matchers: RegExp[];
}

export function parseCorsEnv(raw: string | undefined): CorsConfig {
  const list = (raw ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (list.length === 0) {
    return { origins: DEFAULT_DEV_ORIGINS, allowAll: false, matchers: [] };
  }
  if (list.includes('*')) {
    return { origins: ['*'], allowAll: true, matchers: [] };
  }

  const exact: string[] = [];
  const matchers: RegExp[] = [];
  for (const entry of list) {
    if (entry.includes('*')) matchers.push(patternToRegex(entry));
    else exact.push(entry);
  }
  return { origins: exact, allowAll: false, matchers };
}

export function buildCorsOptions(raw: string | undefined): CorsOptions {
  const cfg = parseCorsEnv(raw);

  // "*" with credentials is rejected by browsers. Reflect the request origin
  // instead so credentialed requests still work.
  const originFn: CustomOrigin = (origin, callback) => {
    // Server-to-server / curl / same-origin requests have no Origin header
    if (!origin) return callback(null, true);

    if (cfg.allowAll) return callback(null, true);

    if (cfg.origins.includes(origin)) return callback(null, true);
    if (cfg.matchers.some((re) => re.test(origin))) return callback(null, true);

    return callback(new Error(`CORS: origin ${origin} not allowed`), false);
  };

  return {
    origin: originFn,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Set-Cookie'],
    maxAge: 86_400, // cache preflight 24h
    optionsSuccessStatus: 204,
  };
}
