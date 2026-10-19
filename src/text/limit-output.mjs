import { DEFAULT_LIMITS } from "../limits/default-limits.mjs";

export function limitOutput(value, configuredMaxLength) {
  const configured = configuredMaxLength ?? DEFAULT_LIMITS.maxString;
  const maxLength = Number.isFinite(configured)
    ? Math.max(0, Math.floor(configured))
    : DEFAULT_LIMITS.maxString;
  if (value.length <= maxLength) return value;

  const marker = "[TRUNCATED]";
  if (maxLength < marker.length) return maxLength === 0 ? "" : "…";
  return `${value.slice(0, maxLength - marker.length)}${marker}`;
}
