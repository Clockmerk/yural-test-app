/** @param {unknown} value */
export function asList(value) {
  return Array.isArray(value) ? value : [];
}

/**
 * Первое вхождение каждого ключа, порядок сохраняется.
 * @template T
 * @param {T[]} items
 * @param {(item: T) => unknown} getKey
 * @returns {T[]}
 */
export function uniqueBy(items, getKey) {
  const seen = new Set();

  return items.filter((item) => {
    const key = getKey(item);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}
