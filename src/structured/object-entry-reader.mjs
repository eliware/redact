export function readObjectEntries(value) {
  try {
    return Reflect.ownKeys(value).filter(key => typeof key === 'string' && Object.prototype.propertyIsEnumerable.call(value, key)).flatMap(key => {
      try { return [[key, value[key]]]; } catch { return []; }
    });
  } catch { return []; }
}
