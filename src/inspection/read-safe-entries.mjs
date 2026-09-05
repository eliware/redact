export function readSafeEntries(value) {
  try {
    return Reflect.ownKeys(value).filter(key => typeof key === 'string').flatMap(key => {
      try {
        const descriptor = Object.getOwnPropertyDescriptor(value, key);
        return descriptor?.enumerable && 'value' in descriptor ? [[key, descriptor.value]] : [];
      } catch { return []; }
    });
  } catch { return []; }
}
