import type { RuntimeConfig } from "@resume-optimzer-app/common";

declare global {
  interface Window {
    __APP_CONFIG__?: RuntimeConfig;
  }
}

function fromPrelude(key: `VITE_${string}`): string | undefined {
  return window.__APP_CONFIG__?.[key];
}

function getViteConfig(key: `VITE_${string}`): string {
  const value = fromPrelude(key);
  if (!value) {
    throw new Error(`Missing runtime config: ${key}`);
  }
  return value;
}

export const configService = {
  get turnstileSiteKey(): string {
    return getViteConfig("VITE_TURNSTILE_SITE_KEY").trim();
  },
  get(key: `VITE_${string}`): string {
    return getViteConfig(key);
  },
};
