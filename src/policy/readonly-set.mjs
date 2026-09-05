export function readonlySet(values) {
  const set = new Set(values);
  return new Proxy(set, {
    get(target, property) {
      if (property === 'add' || property === 'delete' || property === 'clear') return () => { throw new TypeError('This set is readonly'); };
      const value = Reflect.get(target, property, target);
      return typeof value === 'function' ? value.bind(target) : value;
    },
  });
}
