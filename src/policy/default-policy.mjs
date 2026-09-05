import { DEFAULT_SENSITIVE_KEYS } from './default-key-names.mjs';
import { DEFAULT_REDACTION_MARKER } from '../markers/default-marker.mjs';

export const defaultPolicy = Object.freeze({
  keys: DEFAULT_SENSITIVE_KEYS,
  marker: DEFAULT_REDACTION_MARKER,
});
