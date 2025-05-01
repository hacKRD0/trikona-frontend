// src/redux/slices/directorySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DirectoryState {
  filters: Record<string, string[]>;
}

const initialState: DirectoryState = {
  filters: {},
};

const directorySlice = createSlice({
  name: 'directory',
  initialState,
  reducers: {
    setFilter(
      state,
      action: PayloadAction<{ filterId: string; values: string[] }>
    ) {
      const { filterId, values } = action.payload;
      if (values.length > 0) {
        state.filters[filterId] = values;
      } else {
        delete state.filters[filterId];
      }
    },
    clearFilter(state, action: PayloadAction<string>) {
      delete state.filters[action.payload];
    },
    clearAllFilters(state) {
      state.filters = {};
    },
  },
});

export const { setFilter, clearFilter, clearAllFilters } =
  directorySlice.actions;
export default directorySlice.reducer;
