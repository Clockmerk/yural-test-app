import { EMPTY_GOODS_ID } from '@/constants/api';
import { ROLE } from '@/constants/search';
import { TEXT } from '@/constants/ui';

import { asList, uniqueBy } from '@/utils/list';
import { asCount, asNumber, asText } from '@/utils/value';

function readGoodsId(good) {
  return asText(good?.goodsID);
}

/**
 * Пустой поиск API отдаёт запись с нулевым goodsID. Без goodsID позицию не выбрать
 * и не отрендерить ключом, поэтому такие записи тоже отсекаем.
 * @param {unknown} good
 * @returns {boolean}
 */
function isFilledGood(good) {
  if (!good || typeof good !== 'object') {
    return false;
  }

  const goodsID = readGoodsId(good);
  const hasIdentity = Boolean(asText(good.brand) || asText(good.name) || asText(good.number));

  return hasIdentity && goodsID !== '' && goodsID !== EMPTY_GOODS_ID;
}

/** Только заполненные записи, без повторов goodsID. */
function pickGoods(goods) {
  return uniqueBy(asList(goods).filter(isFilledGood), readGoodsId);
}

/**
 * @param {object} good
 * @returns {{ goodsID: string, brand: string, name: string, number: string }}
 */
function createBrandOption(good) {
  return {
    goodsID: readGoodsId(good),
    brand: asText(good.brand),
    name: asText(good.name),
    number: asText(good.number),
  };
}

/**
 * @param {unknown} warehouse
 * @returns {{ id: string, code: string, price: number|null, stock: number } | null}
 */
function createWarehouse(warehouse) {
  if (!warehouse || typeof warehouse !== 'object') {
    return null;
  }

  return {
    id: asText(warehouse.id),
    code: asText(warehouse.code, TEXT.dash),
    price: asNumber(warehouse.price),
    stock: asCount(warehouse.stock),
  };
}

/**
 * @param {object} good
 * @param {'original'|'analog'} role
 */
function createPosition(good, role) {
  const warehouses = asList(good.warehouses).map(createWarehouse).filter(Boolean);
  const stock =
    warehouses.length > 0
      ? warehouses.reduce((sum, warehouse) => sum + warehouse.stock, 0)
      : asCount(good.count);

  return {
    id: `${role}:${readGoodsId(good)}`,
    name: asText(good.name, TEXT.unnamed),
    brand: asText(good.brand, TEXT.dash),
    number: asText(good.number, TEXT.dash),
    role,
    stock,
    warehouses,
  };
}

/**
 * Производители из ответа поиска по артикулу.
 * @param {unknown} goods
 */
export function createBrandOptions(goods) {
  return pickGoods(goods).map(createBrandOption);
}

/**
 * Оригинал первым, затем аналоги без повторов и без самого оригинала. Пустой/битый ответ → [].
 * @param {unknown} goods
 */
export function createPositions(goods) {
  const [original] = pickGoods(goods);

  if (!original) {
    return [];
  }

  const originalId = readGoodsId(original);
  const analogues = pickGoods(original.analogues).filter(
    (good) => readGoodsId(good) !== originalId,
  );

  return [
    createPosition(original, ROLE.ORIGINAL),
    ...analogues.map((good) => createPosition(good, ROLE.ANALOG)),
  ];
}
