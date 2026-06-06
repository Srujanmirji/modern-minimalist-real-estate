import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export interface Booking {
  id: string;
  userId: string;
  propertyId: string;
  date: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
  createdAt: string;
  property?: {
    id: string;
    title: string;
    location: string;
    images?: Array<{ imageUrl: string }>;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

interface BookingsState {
  bookingsList: Booking[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingsState = {
  bookingsList: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/bookings');
      return response.data as Booking[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

export const createBookingThunk = createAsyncThunk(
  'bookings/createBooking',
  async (
    payload: { propertyId: string; date: string; time: string; notes?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('/bookings', payload);
      return response.data; // Newly created booking
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create booking');
    }
  }
);

export const updateBookingStatusThunk = createAsyncThunk(
  'bookings/updateBookingStatus',
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/bookings/${id}/status`, { status });
      return response.data; // Updated booking object
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update booking status');
    }
  }
);

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearBookings(state) {
      state.bookingsList = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchBookings
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingsList = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // createBookingThunk
      .addCase(createBookingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBookingThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingsList.push(action.payload);
      })
      .addCase(createBookingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // updateBookingStatusThunk
      .addCase(updateBookingStatusThunk.fulfilled, (state, action) => {
        const updated = action.payload;
        state.bookingsList = state.bookingsList.map((b) => (b.id === updated.id ? updated : b));
      });
  },
});

export const { clearBookings } = bookingsSlice.actions;

export default bookingsSlice.reducer;
