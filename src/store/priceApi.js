import { createApi } from '@reduxjs/toolkit/query/react';

import { TEXT } from '@/constants/ui';

import { fetchGoods } from '@/api/priceClient';

import { createBrandOptions, createPositions } from '@/domain/position';

/** Ошибки сети уже превращены в текст в `priceClient`. Отмену RTK Query обрабатывает сам. */
async function priceBaseQuery(args, api) {
  try {
    const data = await fetchGoods({ ...args, signal: api.signal });
    return { data };
  } catch (error) {
    if (error?.name === 'AbortError' || api.signal.aborted) {
      if (api.queryCacheKey) {
        api.dispatch({
          type: 'priceApi/queries/removeQueryResult',
          payload: { queryCacheKey: api.queryCacheKey },
        });
      }
      return { error: { name: 'AbortError' } };
    }

    return { error: { message: error?.message || TEXT.networkError } };
  }
}

export const priceApi = createApi({
  reducerPath: 'priceApi',
  baseQuery: priceBaseQuery,
  refetchOnMountOrArgChange: true,
  endpoints: (build) => ({
    getBrands: build.query({
      query: ({ key, number }) => ({ key, number }),
      transformResponse: createBrandOptions,
    }),
    getOffers: build.query({
      query: ({ key, number, brand }) => ({ key, number, brand, withAnalogues: true }),
      transformResponse: createPositions,
    }),
  }),
});

export const { useGetBrandsQuery, useGetOffersQuery } = priceApi;
