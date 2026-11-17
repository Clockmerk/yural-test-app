/** Пустая строка, null и объект не проходят: иначе UI упадёт на методе строки. */
export function asText(value, fallback = '') {
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  return fallback;
}

/** Конечное число или null. Числовую строку с бэкенда тоже принимаем. */
export function asNumber(value) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value.trim().replace(',', '.'));
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

/** @param {unknown} value */
export function asCount(value) {
  return asNumber(value) ?? 0;
}
