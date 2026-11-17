import { describe, expect, it } from 'vitest';

import { ROLE, SORT } from '@/constants/search';

import { createOfferRows, queryOfferRows } from '@/domain/offerRows';

const positions = [
  {
    id: 'original:o',
    name: 'Фильтр',
    brand: 'ASAM',
    number: '01089',
    role: ROLE.ORIGINAL,
    stock: 4,
    warehouses: [
      { id: 'w1', code: 'МСК', price: 200, stock: 1 },
      { id: 'w2', code: 'СПБ', price: 100, stock: 3 },
    ],
  },
  {
    id: 'analog:b',
    name: 'Фильтр топливный',
    brand: 'SUFIX',
    number: 'SQ-1',
    role: ROLE.ANALOG,
    stock: 5,
    warehouses: [],
  },
];

const rows = createOfferRows(positions);

describe('createOfferRows', () => {
  it('разворачивает позицию в строки по складам, без складов — одна строка', () => {
    expect(rows.map((row) => row.id)).toEqual(['original:o:w1:0', 'original:o:w2:1', 'analog:b']);
    expect(rows[2]).toMatchObject({ price: null, stock: 5 });
  });
});

describe('queryOfferRows', () => {
  it('по остатку ставит нули и меньший остаток ниже, без приоритета оригинала', () => {
    const byStock = queryOfferRows(rows, { text: '', sort: SORT.STOCK_DESC });

    expect(byStock.map((row) => row.stock)).toEqual([5, 3, 1]);
  });

  it('сортирует по цене, строки без цены в конце', () => {
    const byPrice = queryOfferRows(rows, { text: '', sort: SORT.PRICE_ASC });

    expect(byPrice.map((row) => row.price)).toEqual([100, 200, null]);
  });

  it('фильтрует по бренду, артикулу и складу без учёта регистра', () => {
    expect(queryOfferRows(rows, { text: 'sufix', sort: SORT.PRICE_ASC })).toHaveLength(1);
    expect(queryOfferRows(rows, { text: 'спб', sort: SORT.PRICE_ASC })).toHaveLength(1);
    expect(queryOfferRows(rows, { text: 'нет такого', sort: SORT.PRICE_ASC })).toEqual([]);
  });
});
