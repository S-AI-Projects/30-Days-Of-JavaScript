export function mergeConfig(defaults, overrides = {}) {
  const result = { ...defaults };
  for (const key of Object.keys(overrides)) {
    if (overrides[key] !== undefined) result[key] = overrides[key];
  }
  return result;
}
