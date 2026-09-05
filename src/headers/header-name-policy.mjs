const DEFAULT_SENSITIVE_HEADER_NAMES = new Set(['authorization', 'cookie', 'set-cookie', 'proxy-authorization', 'x-api-key']);

export function isSensitiveHeaderName(name, options = {}) {
  const names = options.normalizedHeaderNames ?? DEFAULT_SENSITIVE_HEADER_NAMES;
  return names.has(String(name).toLowerCase()) || options.matchHeuristics !== false && /token|secret|password|api[-_]?key/i.test(String(name));
}
