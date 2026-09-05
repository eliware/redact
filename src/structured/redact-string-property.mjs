export function redactStringProperty(value, policy) {
  return typeof value === 'string' ? policy.marker : value;
}
