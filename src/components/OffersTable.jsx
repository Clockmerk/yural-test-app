import { useDeferredValue, useMemo, useState } from 'react';

import { ROLE, SORT } from '@/constants/search';
import { SORT_OPTIONS, TEXT } from '@/constants/ui';

import { formatPrice, formatStock } from '@/domain/format';
import { createOfferRows, queryOfferRows } from '@/domain/offerRows';

import { Badge, Empty, Input, ScrollArea, Select } from '@/ui';

/** Таблица предложений с локальным фильтром. Сбрасывается ключом при смене бренда. */
export default function OffersTable({ positions }) {
  const [text, setText] = useState('');
  const [sort, setSort] = useState(SORT.PRICE_ASC);

  const deferredText = useDeferredValue(text);
  const rows = useMemo(() => createOfferRows(positions), [positions]);
  const visible = useMemo(
    () => queryOfferRows(rows, { text: deferredText, sort }),
    [rows, deferredText, sort],
  );

  const handleChangeText = (event) => {
    setText(event.target.value);
  };

  const handleChangeSort = (value) => {
    setSort(value);
  };

  return (
    <div className="offers-panel">
      <div className="offers-panel__toolbar">
        <div className="row g-2">
          <div className="col-md-8">
            <Input
              value={text}
              placeholder={TEXT.filterPlaceholder}
              aria-label={TEXT.filterPlaceholder}
              onChange={handleChangeText}
            />
          </div>
          <div className="col-md-4">
            <Select
              options={SORT_OPTIONS}
              value={sort}
              aria-label={TEXT.sortLabel}
              onChange={handleChangeSort}
            />
          </div>
        </div>
      </div>
      <p className="offers-panel__meta">
        <Badge>
          {TEXT.found}: {visible.length}
        </Badge>
      </p>
      {visible.length === 0 ? (
        <div className="card-panel__head pt-0">
          <Empty>{TEXT.offersFilterEmpty}</Empty>
        </div>
      ) : (
        <ScrollArea className="scroll-area--table">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">{TEXT.name}</th>
                <th scope="col">{TEXT.brand}</th>
                <th scope="col">{TEXT.warehouse}</th>
                <th scope="col" className="text-end">
                  {TEXT.price}
                </th>
                <th scope="col" className="text-end">
                  {TEXT.stock}
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.id} className={row.role === ROLE.ORIGINAL ? 'is-original' : undefined}>
                  <th scope="row" className="fw-normal">
                    <span className="fw-semibold">{row.name}</span>
                    <span className="d-block small text-body-secondary mt-1">{row.number}</span>
                  </th>
                  <td>{row.brand}</td>
                  <td>{row.warehouse}</td>
                  <td className="text-end text-nowrap">{formatPrice(row.price)}</td>
                  <td className="text-end text-nowrap">{formatStock(row.stock)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      )}
    </div>
  );
}
