import { DEFAULT_SENSITIVE_KEYS } from './default-key-names.mjs';
import { DEFAULT_REDACTION_MARKER } from '../markers/default-marker.mjs';
import { readonlySet } from './readonly-set.mjs';

export const defaultPolicy = Object.freeze({
  keys: readonlySet(DEFAULT_SENSITIVE_KEYS),
  marker: DEFAULT_REDACTION_MARKER,
  circularMarker: '[CIRCULAR]',
  maxArray: 1000,
  maxDepth: 20,
  maxKeys: 1000,
  matchHeuristics: true,
  headerNames: Object.freeze(['authorization', 'cookie', 'set-cookie', 'proxy-authorization', 'x-api-key']),
});
