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
      state.filters[action.payload.filterId] = action.payload.values;
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
