import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Property } from './propertiesSlice';

interface ComparisonState {
  compareList: Property[];
  isOpen: boolean;
}

const initialState: ComparisonState = {
  compareList: [],
  isOpen: false,
};

const comparisonSlice = createSlice({
  name: 'comparison',
  initialState,
  reducers: {
    toggleCompare(state, action: PayloadAction<Property>) {
      const property = action.payload;
      const exists = state.compareList.find((p) => p.id === property.id);
      
      if (exists) {
        state.compareList = state.compareList.filter((p) => p.id !== property.id);
      } else {
        if (state.compareList.length >= 3) {
          // In Redux we can't easily display alert, so we can let components handle the warning,
          // or we can simply keep it max 3 here and do not add.
          return;
        }
        state.compareList.push(property);
      }
    },
    removeFromCompare(state, action: PayloadAction<string>) {
      state.compareList = state.compareList.filter((p) => p.id !== action.payload);
    },
    clearCompare(state) {
      state.compareList = [];
    },
    setIsOpen(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload;
    },
  },
});

export const { toggleCompare, removeFromCompare, clearCompare, setIsOpen } = comparisonSlice.actions;

export default comparisonSlice.reducer;
