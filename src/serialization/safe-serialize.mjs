import { DEFAULT_LIMITS } from "../limits/default-limits.mjs";
import { normalizePolicy } from "../policy/normalize-policy.mjs";
import { normalizeSerializationLimits } from "./serialization-limits.mjs";
import { serializeDispatch } from "./serialize-dispatch.mjs";
import { createSerializeContext } from "./serialize-context.mjs";

export function safeSerialize(value, options = {}) {
  const policy = normalizePolicy(options);
  const limits = normalizeSerializationLimits(options, DEFAULT_LIMITS);
  const context = createSerializeContext(policy, limits, serializeDispatch);
  return serializeDispatch(
    value,
    policy,
    limits,
    context.seen,
    0,
    serializeDispatch,
  );
}
