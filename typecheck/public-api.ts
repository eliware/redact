import {
  createPolicy,
  defaultPolicy,
  redactErrorDetails,
  redactErrorMessage,
  redactHeaders,
  redactText,
  redactValue,
  replaceLiteralSecret,
  safeErrorValue,
  safeSerialize,
} from "@eliware/redact";
import type { SafeSerializedValue } from "@eliware/redact";
import type { RedactedHeaders, RedactedValue } from "@eliware/redact";

const policy = createPolicy({
  keys: ["token"],
  matchHeuristics: false,
  headerNames: ["authorization"],
  maxArray: 10,
  maxDepth: 5,
  maxKeys: 10,
});

void defaultPolicy.maxDepth;
void defaultPolicy.maxArray;
void defaultPolicy.maxKeys;
void defaultPolicy.matchHeuristics;
void defaultPolicy.headerNames;
void policy.maxDepth;
const redactedValue: RedactedValue = redactValue({ token: "secret", safe: true });
if (typeof redactedValue === "object" && redactedValue !== null && !Array.isArray(redactedValue))
  void redactedValue.safe;
const redactedHeaders: RedactedHeaders = redactHeaders({ authorization: "secret" }, policy);
if (!Array.isArray(redactedHeaders)) void redactedHeaders.authorization;
safeSerialize({ token: "secret" }, { ...policy, maxString: 20 });
safeSerialize({ value: "known-secret" }, { secrets: ["known-secret"] });
const typedResult: SafeSerializedValue = safeSerialize({ token: "secret" });
if (typeof typedResult === "object" && typedResult !== null && !Array.isArray(typedResult))
  void typedResult.token;
redactText("token=secret", { secrets: ["secret"], maxString: 20 });
replaceLiteralSecret("secret", "secret");
redactErrorMessage(new Error("secret"), { secrets: ["secret"] });
redactErrorDetails(new Error("secret"), policy);
safeErrorValue(new Error("secret"), policy);
