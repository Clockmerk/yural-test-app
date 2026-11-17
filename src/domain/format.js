import { TEXT } from '@/constants/ui';

const priceFormat = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 2,
});

/** @param {number|null} value */
export function formatPrice(value) {
  return value === null ? TEXT.dash : priceFormat.format(value);
}

/** @param {number} value */
export function formatStock(value) {
  return `${value} ${TEXT.stockUnit}`;
}

/** @param {{ brand: string, name: string }} brand */
export function formatBrandTitle(brand) {
  return [brand.brand, brand.name].filter(Boolean).join(' · ');
}
