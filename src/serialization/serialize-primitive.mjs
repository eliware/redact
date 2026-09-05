import { serializeBigInt } from './serialize-bigint.mjs';
import { serializeFunction } from './serialize-function.mjs';
import { serializeSymbol } from './serialize-symbol.mjs';
import { serializeUndefined } from './serialize-undefined.mjs';
import { enforceStringLimit } from '../limits/enforce-string-limit.mjs';

export function serializePrimitive(value, maxString) {
  if (value === null) return { handled: true, value: null };
  if (value === undefined) return { handled: true, value: serializeUndefined() };
  if (typeof value === 'string') return { handled: true, value: enforceStringLimit(value, maxString) };
  if (typeof value === 'bigint') return { handled: true, value: serializeBigInt(value) };
  if (typeof value === 'function') return { handled: true, value: serializeFunction(value) };
  if (typeof value === 'symbol') return { handled: true, value: serializeSymbol(value) };
  if (typeof value !== 'object') return { handled: true, value };
  return { handled: false, value: undefined };
}
