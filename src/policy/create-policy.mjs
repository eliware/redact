import { normalizePolicy } from './normalize-policy.mjs';

export function createPolicy(options = {}) {
  return Object.freeze(normalizePolicy(options));
}
