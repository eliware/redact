export function createSerializeContext(policy, limits, serialize) {
  const seen = new WeakSet();
  return {
    child(value, depth) {
      return serialize(value, policy, limits, seen, depth);
    },
    seen,
  };
}
