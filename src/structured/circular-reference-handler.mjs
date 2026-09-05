export function circularReferenceValue(policy) {
  return policy.circularMarker ?? '[CIRCULAR]';
}
