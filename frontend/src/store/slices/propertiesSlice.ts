import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  status: string;
  featured: boolean;
  amenities: string[];
  agentId: string;
  agent?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  images: { id: string; imageUrl: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface PropertiesFilters {
  search: string;
  minPrice: string;
  maxPrice: string;
  selectedTypes: string[];
  selectedAmenities: string[];
  sortBy: string;
  status?: string;
}

interface PropertiesState {
  properties: Property[];
  featuredProperties: Property[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  filters: PropertiesFilters;
}

const initialFilters: PropertiesFilters = {
  search: '',
  minPrice: '',
  maxPrice: '',
  selectedTypes: [],
  selectedAmenities: [],
  sortBy: 'Newest Listings',
  status: '',
};

const initialState: PropertiesState = {
  properties: [],
  featuredProperties: [],
  loading: false,
  error: null,
  totalCount: 0,
  totalPages: 1,
  currentPage: 1,
  filters: initialFilters,
};

// Async Thunks
export const fetchProperties = createAsyncThunk(
  'properties/fetchProperties',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { properties: PropertiesState };
      const { filters, currentPage } = state.properties;
      const queryParams = new URLSearchParams();

      if (filters.search) queryParams.append('search', filters.search);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.status) queryParams.append('status', filters.status);
      queryParams.append('page', currentPage.toString());

      if (filters.selectedTypes.length > 0) {
        queryParams.append('type', filters.selectedTypes[0]);
      }

      const response = await api.get(`/properties?${queryParams.toString()}`);
      return response.data; // { properties, totalCount, totalPages }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch properties');
    }
  }
);

export const fetchFeaturedProperties = createAsyncThunk(
  'properties/fetchFeaturedProperties',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/properties?featured=true');
      return response.data.properties;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured properties');
    }
  }
);

const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.filters.search = action.payload;
      state.currentPage = 1;
    },
    setMinPrice(state, action: PayloadAction<string>) {
      state.filters.minPrice = action.payload;
      state.currentPage = 1;
    },
    setMaxPrice(state, action: PayloadAction<string>) {
      state.filters.maxPrice = action.payload;
      state.currentPage = 1;
    },
    toggleType(state, action: PayloadAction<string>) {
      const type = action.payload;
      state.filters.selectedTypes = state.filters.selectedTypes.includes(type)
        ? state.filters.selectedTypes.filter((t) => t !== type)
        : [type]; // Radio behaviour matching current codebase
      state.currentPage = 1;
    },
    toggleAmenity(state, action: PayloadAction<string>) {
      const amenity = action.payload;
      state.filters.selectedAmenities = state.filters.selectedAmenities.includes(amenity)
        ? state.filters.selectedAmenities.filter((a) => a !== amenity)
        : [...state.filters.selectedAmenities, amenity];
      state.currentPage = 1;
    },
    setSortBy(state, action: PayloadAction<string>) {
      state.filters.sortBy = action.payload;
      state.currentPage = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    resetFilters(state) {
      state.filters = initialFilters;
      state.currentPage = 1;
    },
    // Allows setting filters from URL query parameters (e.g. from Hero search)
    setUrlFilters(state, action: PayloadAction<Partial<PropertiesFilters>>) {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProperties
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload.properties;
        state.totalCount = action.payload.totalCount;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchFeaturedProperties
      .addCase(fetchFeaturedProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredProperties = action.payload;
      })
      .addCase(fetchFeaturedProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearch,
  setMinPrice,
  setMaxPrice,
  toggleType,
  toggleAmenity,
  setSortBy,
  setPage,
  resetFilters,
  setUrlFilters,
} = propertiesSlice.actions;

export default propertiesSlice.reducer;
