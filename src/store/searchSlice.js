import { createSlice } from '@reduxjs/toolkit';

import { TEST_API_KEY } from '@/constants/api';

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    apiKey: TEST_API_KEY,
    selectedBrand: null,
  },
  reducers: {
    setApiKey(state, action) {
      state.apiKey = action.payload;
    },
    chooseBrand(state, action) {
      state.selectedBrand = action.payload;
    },
    clearSelectedBrand(state) {
      state.selectedBrand = null;
    },
  },
});

export const { setApiKey, chooseBrand, clearSelectedBrand } = searchSlice.actions;

export default searchSlice.reducer;
