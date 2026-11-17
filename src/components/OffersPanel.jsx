import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { skipToken } from '@reduxjs/toolkit/query/react';

import { TEXT } from '@/constants/ui';

import { formatBrandTitle } from '@/domain/format';

import { useGetOffersQuery } from '@/store/priceApi';
import { getQueryError, getQueryStatus } from '@/store/queryStatus';
import { selectSelectedBrand } from '@/store/selectors';

import { useBrandSearch } from '@/hooks/useBrandSearch';

import { revealIfBelowFold } from '@/utils/dom';

import OffersTable from '@/components/OffersTable';
import StatusMessage from '@/components/StatusMessage';

import { Card } from '@/ui';

export default function OffersPanel() {
  const cardRef = useRef(null);

  const { request } = useBrandSearch();
  const selectedBrand = useSelector(selectSelectedBrand);
  const selectedId = selectedBrand?.goodsID;
  const offersQuery = useGetOffersQuery(
    selectedBrand && request
      ? { key: request.key, number: selectedBrand.number, brand: selectedBrand.brand }
      : skipToken,
  );
  const positions = offersQuery.currentData ?? [];

  useEffect(() => {
    if (selectedId) {
      revealIfBelowFold(cardRef.current);
    }
  }, [selectedId]);

  return (
    <Card ref={cardRef} id="offers" step="2" title={TEXT.stepOffers} meta="">
      <div className="card-panel">
        <div className="card-panel__head">
          {selectedBrand ? (
            <p className="fw-semibold mb-3">{formatBrandTitle(selectedBrand)}</p>
          ) : null}
          <StatusMessage
            status={getQueryStatus(offersQuery, Boolean(selectedBrand && request))}
            error={getQueryError(offersQuery.error, TEXT.offersFailed)}
            loadingText={TEXT.offersLoading}
            idleText={TEXT.offersIdle}
            emptyText={TEXT.offersEmpty}
            isEmpty={positions.length === 0}
          />
        </div>
        {positions.length > 0 && <OffersTable key={selectedId} positions={positions} />}
      </div>
    </Card>
  );
}
