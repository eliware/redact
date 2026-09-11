export function collectLiteralSecrets(configuredSecrets) {
  if (
    configuredSecrets != null &&
    (typeof configuredSecrets === "string" ||
      typeof configuredSecrets[Symbol.iterator] !== "function")
  )
    throw new TypeError("secrets must be iterable");
  const secrets = [];
  if (configuredSecrets != null)
    for (const secret of configuredSecrets) {
      if (typeof secret === "string" && secret.length > 0) secrets.push(secret);
      if (secrets.length === 100) break;
    }
  return secrets;
}
