import { DEFAULT_LIMITS } from "./default-limits.mjs";

export function normalizeTraversalLimits(options = {}) {
  const limits = { ...DEFAULT_LIMITS, ...options };
  for (const name of ["maxDepth", "maxKeys", "maxArray"]) {
    const value = options[name];
    limits[name] = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : DEFAULT_LIMITS[name];
  }
  return limits;
}
