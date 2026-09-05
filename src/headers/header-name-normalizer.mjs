import { readonlySet } from '../policy/readonly-set.mjs';

const DEFAULT_HEADER_NAMES = ['authorization', 'cookie', 'set-cookie', 'proxy-authorization', 'x-api-key'];

export function normalizeHeaderNames(headerNames) {
  if (headerNames != null && (typeof headerNames === 'string' || typeof headerNames[Symbol.iterator] !== 'function')) throw new TypeError('headerNames must be iterable');
  const names = headerNames == null ? DEFAULT_HEADER_NAMES : [...DEFAULT_HEADER_NAMES, ...headerNames];
  return readonlySet(new Set(names.map(value => String(value).toLowerCase())));
}
