import { describe, expect, it } from 'vitest';

import { asCount, asNumber, asText } from '@/utils/value';

describe('asText', () => {
  it('пропускает непустую строку и конечное число', () => {
    expect(asText('  ASAM ')).toBe('ASAM');
    expect(asText(42)).toBe('42');
  });

  it('возвращает запасное значение для мусора', () => {
    expect(asText(null, '—')).toBe('—');
    expect(asText({}, '—')).toBe('—');
    expect(asText('   ', '—')).toBe('—');
    expect(asText(Number.NaN, '—')).toBe('—');
  });
});

describe('asNumber / asCount', () => {
  it('разбирает числовую строку, в том числе с запятой', () => {
    expect(asNumber('100,5')).toBe(100.5);
    expect(asNumber(7)).toBe(7);
  });

  it('даёт null и 0 для нечисел', () => {
    expect(asNumber('abc')).toBeNull();
    expect(asNumber(undefined)).toBeNull();
    expect(asCount(null)).toBe(0);
  });
});
