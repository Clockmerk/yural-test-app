import { describe, expect, it } from 'vitest';

import { EMPTY_GOODS_ID } from '@/constants/api';
import { ROLE } from '@/constants/search';
import { TEXT } from '@/constants/ui';

import { createBrandOptions, createPositions } from '@/domain/position';

describe('createBrandOptions', () => {
  it('отсекает пустую запись, запись без goodsID и повторы', () => {
    const goods = [
      { goodsID: EMPTY_GOODS_ID, brand: 'X' },
      { brand: 'NoId' },
      { goodsID: 'a', brand: 'ASAM', name: 'Фильтр', number: '01089' },
      { goodsID: 'a', brand: 'ASAM дубль' },
      null,
      'мусор',
    ];

    expect(createBrandOptions(goods)).toEqual([
      { goodsID: 'a', brand: 'ASAM', name: 'Фильтр', number: '01089' },
    ]);
  });

  it('не падает на ответе не-массиве', () => {
    expect(createBrandOptions(undefined)).toEqual([]);
    expect(createBrandOptions({ goods: [] })).toEqual([]);
  });
});

describe('createPositions', () => {
  it('ставит оригинал первым и убирает из аналогов повторы и сам оригинал', () => {
    const positions = createPositions([
      {
        goodsID: 'o',
        brand: 'ASAM',
        number: '01089',
        warehouses: [{ id: 'w1', code: 'МСК', price: '100,5', stock: '3' }],
        analogues: [
          { goodsID: 'o', brand: 'ASAM' },
          { goodsID: 'b', brand: 'SUFIX', count: 2 },
          { goodsID: 'b', brand: 'SUFIX' },
        ],
      },
    ]);

    expect(positions.map((position) => [position.id, position.role])).toEqual([
      ['original:o', ROLE.ORIGINAL],
      ['analog:b', ROLE.ANALOG],
    ]);
    expect(positions[0].warehouses).toEqual([{ id: 'w1', code: 'МСК', price: 100.5, stock: 3 }]);
    expect(positions[1].stock).toBe(2);
  });

  it('подставляет запасные значения вместо битых полей', () => {
    const [position] = createPositions([
      { goodsID: 1, number: 42, name: null, brand: {}, warehouses: [null, { price: 'abc' }] },
    ]);

    expect(position).toMatchObject({ name: TEXT.unnamed, brand: TEXT.dash, number: '42' });
    expect(position.warehouses).toEqual([{ id: '', code: TEXT.dash, price: null, stock: 0 }]);
  });

  it('возвращает пустой список на пустой ответ', () => {
    expect(createPositions([])).toEqual([]);
    expect(createPositions(null)).toEqual([]);
  });
});
