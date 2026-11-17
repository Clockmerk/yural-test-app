export const selectApiKey = (state) => state.search.apiKey;

export const selectSelectedBrand = (state) => state.search.selectedBrand;

export const selectSelectedId = (state) => state.search.selectedBrand?.goodsID ?? '';
