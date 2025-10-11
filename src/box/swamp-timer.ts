// Persistent, obfuscated localStorage timer for the swamp/box feature
// - First load: fixed 5 minutes
// - After that: random 3–5 minutes
// - Obfuscation: base64 + static token and simple checksum

const STORAGE_KEY = "__swamp_timer";
const SEEN_KEY = "__swamp_seen";
const TOKEN = "sWp_t0k3n_v1"; // not secret, just casual obfuscation

function base64Encode(input: string): string {
  try {
    // Browser-safe base64
    return btoa(unescape(encodeURIComponent(input)));
  } catch {
    return "";
  }
}

function base64Decode(input: string): string {
  try {
    return decodeURIComponent(escape(atob(input)));
  } catch {
    return "";
  }
}

function checksum(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function now(): number {
  return Date.now();
}

function minutes(ms: number): number {
  return Math.floor(ms / 60000);
}

function randomBetween(minMs: number, maxMs: number): number {
  const delta = maxMs - minMs;
  return minMs + Math.floor(Math.random() * (delta + 1));
}

function writeLocal(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

function readLocal(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function encodePayload(obj: Record<string, unknown>): string {
  const body = JSON.stringify(obj);
  const sig = checksum(body + TOKEN);
  const payload = JSON.stringify({ b: body, s: sig });
  return base64Encode(payload);
}

function decodePayload(encoded: string): Record<string, unknown> | null {
  const decoded = base64Decode(encoded);
  if (!decoded) return null;
  try {
    const parsed = JSON.parse(decoded);
    const body: string = parsed?.b;
    const sig: number = parsed?.s;
    if (typeof body !== "string" || typeof sig !== "number") return null;
    const valid = checksum(body + TOKEN) === sig;
    if (!valid) return null;
    return JSON.parse(body);
  } catch {
    return null;
  }
}

export type SwampTimerState = {
  nextAtMs: number; // epoch ms when next window should start
  seen: boolean; // whether the first-run 5m has already happened
};

// Public API
export const swampTimer = {
  // Initialize or read current state; schedules first-run if missing
  getState(): SwampTimerState {
    const existing = readLocal(STORAGE_KEY);
    if (existing) {
      const obj = decodePayload(existing) as SwampTimerState | null;
      if (obj && typeof obj.nextAtMs === "number" && typeof obj.seen === "boolean") {
        return obj;
      }
    }

    // New install or tampered: set first-run to 5 minutes
    const firstDelay = 1 * 60 * 1000; // 5m
    const state: SwampTimerState = { nextAtMs: now() + firstDelay, seen: false };
    swampTimer.setState(state);
    // Mark seen helper key (redundant signal)
    writeLocal(SEEN_KEY, "1");
    return state;
  },

  // Persist state
  setState(state: SwampTimerState): void {
    const encoded = encodePayload(state);
    writeLocal(STORAGE_KEY, encoded);
  },

  // After a window completes (e.g., user opened or time expired), schedule next 3–5 minutes
  scheduleNext(): SwampTimerState {
    const minMs = 3 * 60 * 1000;
    const maxMs = 5 * 60 * 1000;
    const state = swampTimer.getState();
    const delay = randomBetween(minMs, maxMs);
    const next: SwampTimerState = { nextAtMs: now() + delay, seen: true };
    swampTimer.setState(next);
    return next;
  },

  // Force fresh 5-minute timer only on NEW game entry (not refreshes)
  startFreshGameTimer(): SwampTimerState {
    const freshDelay = 1 * 60 * 1000; // 5 minutes from new game entry
    const freshState: SwampTimerState = { nextAtMs: now() + freshDelay, seen: false };
    swampTimer.setState(freshState);
    return freshState;
  },

  // Reset to 5-minute timer on page refresh (after user has seen boxes)
  resetOnRefresh(): SwampTimerState {
    const refreshDelay = 5 * 60 * 1000; // Always 5 minutes on refresh
    const refreshState: SwampTimerState = { nextAtMs: now() + refreshDelay, seen: true };
    swampTimer.setState(refreshState);
    return refreshState;
  },

  // Whether we are inside the visible window now. The design here is that visibility
  // starts when current time >= nextAtMs, and lasts for a fixed small window (e.g., 30s)
  isVisible(visibleWindowMs: number): boolean {
    const { nextAtMs } = swampTimer.getState();
    return now() >= nextAtMs && now() < nextAtMs + visibleWindowMs;
  },

  // How long (ms) until visibility should start (0 if already visible or overdue)
  msUntilVisible(): number {
    const { nextAtMs } = swampTimer.getState();
    return Math.max(0, nextAtMs - now());
  },
};

export default swampTimer;


