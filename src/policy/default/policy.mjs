import { DEFAULT_SENSITIVE_KEYS } from "./key-names.mjs";
import { DEFAULT_REDACTION_MARKER } from "../../markers/default-marker.mjs";
import { createReadonlySet } from "../create/readonly-set.mjs";

export const defaultPolicy = Object.freeze({
  keys: createReadonlySet(DEFAULT_SENSITIVE_KEYS),
  marker: DEFAULT_REDACTION_MARKER,
});
