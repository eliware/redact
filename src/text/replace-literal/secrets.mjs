import { matchSecretRanges } from "./matches.mjs";

export function replaceLiteralSecrets(value, secrets, marker = "[REDACTED]") {
  const text = String(value ?? "");
  const secretValues = typeof secrets === "string" ? [secrets] : [...(secrets ?? [])];
  const ranges = matchSecretRanges(text, secretValues.map(String).filter(Boolean));
  if (ranges.length === 0) return text;

  let output = "";
  let cursor = 0;
  for (const [start, end] of ranges) {
    output += text.slice(cursor, start) + marker;
    cursor = end;
  }
  return output + text.slice(cursor);
}
