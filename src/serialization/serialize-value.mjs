import { serializePrimitive } from './serialize-primitive.mjs';

export function serializeValue(value, options = {}) {
  return serializePrimitive(value, options.maxString ?? 10000);
}
