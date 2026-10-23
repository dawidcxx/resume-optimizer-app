const SCRIPT_ID = "cf-turnstile-script";
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileTheme = "auto" | "light" | "dark";
type TurnstileSize = "normal" | "flexible" | "compact";
type TurnstileAppearance = "always" | "execute" | "interaction-only";
type TurnstileExecution = "render" | "execute";

export type TurnstileOptions = {
  sitekey: string;
  action?: string;
  theme?: TurnstileTheme;
  size?: TurnstileSize;
  appearance?: TurnstileAppearance;
  execution?: TurnstileExecution;
  language?: string;
  retry?: "auto" | "never";
  callback?: (token: string) => void;
  "error-callback"?: (errorCode?: string) => void;
  "expired-callback"?: () => void;
  "timeout-callback"?: () => void;
  "before-interactive-callback"?: () => void;
  "after-interactive-callback"?: () => void;
};

export type TurnstileApi = {
  render: (container: HTMLElement | string, options: TurnstileOptions) => string;
  execute: (widgetId?: string) => void;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let loadPromise: Promise<TurnstileApi> | null = null;

export function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) {
    return Promise.resolve(window.turnstile);
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    const script = existing ?? document.createElement("script");
    let settled = false;

    const timeout = window.setTimeout(() => {
      finish(new Error("Verification took too long to load. Please try again."));
    }, 10_000);

    const poll = window.setInterval(() => {
      if (window.turnstile) {
        finish();
      }
    }, 50);

    function cleanup(): void {
      window.clearTimeout(timeout);
      window.clearInterval(poll);
      script.removeEventListener("load", onLoad);
      script.removeEventListener("error", onError);
    }

    function finish(error?: Error): void {
      if (settled) return;
      settled = true;
      cleanup();

      if (!error && window.turnstile) {
        resolve(window.turnstile);
        return;
      }

      loadPromise = null;
      reject(error ?? new Error("Verification could not load. Please try again."));
    }

    function onLoad(): void {
      if (window.turnstile) {
        finish();
      }
    }

    function onError(): void {
      finish(new Error("Verification could not load. Please try again."));
    }

    script.addEventListener("load", onLoad);
    script.addEventListener("error", onError);

    if (!existing) {
      script.id = SCRIPT_ID;
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.head.append(script);
    } else if (window.turnstile) {
      finish();
    }
  });

  return loadPromise;
}
