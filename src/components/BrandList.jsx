import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { skipToken } from '@reduxjs/toolkit/query/react';

import { TEXT } from '@/constants/ui';

import { useGetBrandsQuery } from '@/store/priceApi';
import { getQueryError, getQueryStatus } from '@/store/queryStatus';
import { chooseBrand } from '@/store/searchSlice';
import { selectSelectedId } from '@/store/selectors';

import { useBrandSearch } from '@/hooks/useBrandSearch';

import BrandButton from '@/components/BrandButton';
import StatusMessage from '@/components/StatusMessage';

import { Card, List } from '@/ui';

export default function BrandList() {
  const dispatch = useDispatch();

  const { request } = useBrandSearch();
  const brandsQuery = useGetBrandsQuery(request ?? skipToken);
  const brands = brandsQuery.currentData ?? [];
  const selectedId = useSelector(selectSelectedId);

  const onSelectBrand = useCallback(
    (brand) => {
      if (brand.goodsID !== selectedId) {
        dispatch(chooseBrand(brand));
      }
    },
    [dispatch, selectedId],
  );

  return (
    <Card id="brands" step="1" title={TEXT.stepBrands} meta={request?.number ?? ''}>
      <div className="card-panel">
        <div className="card-panel__head">
          <StatusMessage
            status={getQueryStatus(brandsQuery, Boolean(request))}
            error={getQueryError(brandsQuery.error, TEXT.brandsFailed)}
            loadingText={TEXT.brandsLoading}
            idleText={TEXT.brandsIdle}
            emptyText={TEXT.brandsEmpty}
            isEmpty={brands.length === 0}
          />
        </div>
        {brands.length > 0 && (
          <List>
            {brands.map((brand) => (
              <BrandButton
                key={brand.goodsID}
                brand={brand}
                isSelected={brand.goodsID === selectedId}
                onSelect={onSelectBrand}
              />
            ))}
          </List>
        )}
      </div>
    </Card>
  );
}
