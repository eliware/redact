export function createReadonlySet(values) {
  const set = new Set(values);
  let view;
  view = Object.freeze({
    get size() {
      return set.size;
    },
    has(value) {
      return set.has(value);
    },
    entries() {
      return set.entries();
    },
    keys() {
      return set.keys();
    },
    values() {
      return set.values();
    },
    forEach(callback, thisArg) {
      if (typeof callback !== "function") throw new TypeError("callback must be a function");
      set.forEach((value) => Reflect.apply(callback, thisArg, [value, value, view]));
    },
    [Symbol.iterator]() {
      return set[Symbol.iterator]();
    },
  });
  return view;
}
