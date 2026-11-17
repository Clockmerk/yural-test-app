import { configureStore } from '@reduxjs/toolkit';

import { priceApi } from '@/store/priceApi';
import searchReducer from '@/store/searchSlice';

const store = configureStore({
  reducer: {
    search: searchReducer,
    [priceApi.reducerPath]: priceApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(priceApi.middleware),
});

export default store;
