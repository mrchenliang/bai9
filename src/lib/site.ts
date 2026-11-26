export function siteOrigin(): string {
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export const SITE_NAME = "Chinese Baijiu Museum";
export const SITE_NAME_ZH = "中国白酒博物馆";
export const SITE_TAGLINE = "The grain spirits China actually argues about.";
export const SITE_DESCRIPTION =
  "Chinese Baijiu Museum (酒) — a permanent editorial archive of China’s grain spirits: tier system, table signals, GB/T standards, and drinking passport.";
