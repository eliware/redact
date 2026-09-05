const DEFAULT_SENSITIVE_HEADER_NAMES = new Set(['authorization', 'cookie', 'set-cookie', 'proxy-authorization', 'x-api-key']);

export function isSensitiveHeaderName(name, options = {}) {
  const names = options.headerNames ?? DEFAULT_SENSITIVE_HEADER_NAMES;
  return new Set([...names].map(value => String(value).toLowerCase())).has(String(name).toLowerCase()) || /token|secret|password|api[-_]?key/i.test(String(name));
}
