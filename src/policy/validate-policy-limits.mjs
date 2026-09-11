export function validatePolicyLimits(options, defaults) {
  for (const name of ["maxArray", "maxDepth", "maxKeys"]) {
    const value = options[name] ?? defaults[name];
    if (!Number.isInteger(value) || value < 0)
      throw new TypeError(`${name} must be a non-negative integer`);
  }
}
