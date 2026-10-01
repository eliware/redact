import { readHeaderEntries } from "./header-entry-reader.mjs";
import { redactHeaderEntries } from "./redact-header-entries.mjs";
import { buildHeaderOutput } from "./build-header-output.mjs";
import { normalizeHeaderNames } from "./header-name-normalizer.mjs";

export function redactHeaders(headers, options = {}) {
  const entries = readHeaderEntries(headers);
  const normalizedOptions = {
    ...options,
    normalizedHeaderNames: normalizeHeaderNames(options.headerNames),
  };
  return buildHeaderOutput(headers, redactHeaderEntries(entries, normalizedOptions));
}
