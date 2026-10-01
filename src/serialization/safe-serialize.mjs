import { normalizeSerializationOptions } from "./normalize-serialization-options.mjs";
import { serializeDispatch } from "./serialize-dispatch.mjs";
import { createSerializeContext } from "./serialize-context.mjs";

export function safeSerialize(value, options = {}) {
  const { policy, limits } = normalizeSerializationOptions(options);
  const context = createSerializeContext(policy, limits, serializeDispatch);
  return serializeDispatch(value, policy, limits, context.seen, 0, serializeDispatch);
}
