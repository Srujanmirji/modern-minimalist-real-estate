import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';
import type { Property } from './propertiesSlice';

interface FavoritesState {
  favoriteIds: string[];
  favoritesList: Property[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  favoriteIds: [],
  favoritesList: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        const stored = localStorage.getItem('guest_favorites');
        if (stored) {
          return JSON.parse(stored) as Property[];
        }
        return [] as Property[];
      }
      const response = await api.get('/dashboard');
      const savedProperties = response.data.saved || [];
      return savedProperties as Property[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch favorites');
    }
  }
);

export const toggleFavoriteThunk = createAsyncThunk(
  'favorites/toggleFavorite',
  async (property: Property, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { property, isFavorite: false, isGuest: true };
      }
      const response = await api.post('/properties/favorite', { propertyId: property.id });
      // The response returns { isFavorite: boolean }
      return { property, isFavorite: response.data.isFavorite, isGuest: false };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle favorite');
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavoriteIds(state, action: PayloadAction<string[]>) {
      state.favoriteIds = action.payload;
    },
    clearFavorites(state) {
      state.favoriteIds = [];
      state.favoritesList = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchFavorites
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favoritesList = action.payload;
        state.favoriteIds = action.payload.map((p) => p.id);
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // toggleFavoriteThunk
      .addCase(toggleFavoriteThunk.fulfilled, (state, action) => {
        const { property, isFavorite, isGuest } = action.payload;
        if (isGuest) {
          const idx = state.favoriteIds.indexOf(property.id);
          if (idx >= 0) {
            state.favoriteIds = state.favoriteIds.filter((id) => id !== property.id);
            state.favoritesList = state.favoritesList.filter((p) => p.id !== property.id);
          } else {
            state.favoriteIds.push(property.id);
            state.favoritesList.push(property);
          }
          localStorage.setItem('guest_favorites', JSON.stringify(state.favoritesList));
          return;
        }
        if (isFavorite) {
          if (!state.favoriteIds.includes(property.id)) {
            state.favoriteIds.push(property.id);
            state.favoritesList.push(property);
          }
        } else {
          state.favoriteIds = state.favoriteIds.filter((id) => id !== property.id);
          state.favoritesList = state.favoritesList.filter((p) => p.id !== property.id);
        }
      });
  },
});

export const { setFavoriteIds, clearFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;
