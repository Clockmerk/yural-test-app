import { ROLE, SORT } from '@/constants/search';
import { TEXT } from '@/constants/ui';

function compareByPrice(left, right) {
  const leftPrice = left.price ?? Number.POSITIVE_INFINITY;
  const rightPrice = right.price ?? Number.POSITIVE_INFINITY;

  return leftPrice - rightPrice || right.stock - left.stock;
}

function compareByStock(left, right) {
  return right.stock - left.stock || compareByPrice(left, right);
}

function createRow(position, { id, warehouse, price, stock }) {
  return {
    id,
    name: position.name,
    number: position.number,
    brand: position.brand,
    role: position.role,
    warehouse,
    price,
    stock,
    search: [position.name, position.brand, position.number, warehouse].join(' ').toLowerCase(),
  };
}

/**
 * Позиция → строки по складам. Без складов остаётся одна строка.
 * @param {object} position
 */
function expandPosition(position) {
  if (!position.warehouses.length) {
    return [
      createRow(position, {
        id: position.id,
        warehouse: TEXT.dash,
        price: null,
        stock: position.stock,
      }),
    ];
  }

  return position.warehouses.map((warehouse, index) =>
    createRow(position, {
      id: `${position.id}:${warehouse.id}:${index}`,
      warehouse: warehouse.code,
      price: warehouse.price,
      stock: warehouse.stock,
    }),
  );
}

/**
 * Строки таблицы предложений. Позиции уже нормализованы в `domain/position`.
 * @param {object[]} positions
 */
export function createOfferRows(positions) {
  return positions.flatMap(expandPosition);
}

/**
 * Локальный фильтр и сортировка без нового запроса.
 * По цене оригинал остаётся выше аналогов, по остатку сортируется весь список.
 * @param {ReturnType<typeof createOfferRows>} rows
 * @param {{ text: string, sort: string }} query
 */
export function queryOfferRows(rows, { text, sort }) {
  const needle = text.trim().toLowerCase();
  const matched = needle ? rows.filter((row) => row.search.includes(needle)) : [...rows];

  if (sort === SORT.STOCK_DESC) {
    return matched.sort(compareByStock);
  }

  const original = matched.filter((row) => row.role === ROLE.ORIGINAL);
  const analogs = matched.filter((row) => row.role !== ROLE.ORIGINAL);

  original.sort(compareByPrice);
  analogs.sort(compareByPrice);

  return original.concat(analogs);
}
