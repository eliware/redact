import { DEFAULT_LIMITS } from "../limits/default-limits.mjs";
import { collectLiteralSecrets } from "../text/collect-literal-secrets.mjs";
import { normalizePolicy } from "../policy/normalize-policy.mjs";
import { normalizeSerializationLimits } from "./serialization-limits.mjs";

export function normalizeSerializationOptions(options = {}) {
  const policy = normalizePolicy(options);
  const limits = {
    ...normalizeSerializationLimits(options, DEFAULT_LIMITS),
    secrets: collectLiteralSecrets(options.secrets),
  };
  return { policy, limits };
}
