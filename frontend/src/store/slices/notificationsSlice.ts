import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface NotificationsState {
  notificationsList: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  notificationsList: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/notifications');
      return response.data as NotificationItem[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const markAsReadThunk = createAsyncThunk(
  'notifications/markAsRead',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/notifications/${id}/read`);
      return response.data; // Updated notification object
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark notification as read');
    }
  }
);

export const markAllAsReadThunk = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.patch('/notifications/mark-all-read');
      return response.data; // { count: number } or array
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all notifications as read');
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearNotifications(state) {
      state.notificationsList = [];
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchNotifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notificationsList = action.payload;
        state.unreadCount = action.payload.filter((n) => !n.read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // markAsReadThunk
      .addCase(markAsReadThunk.fulfilled, (state, action) => {
        const updated = action.payload;
        state.notificationsList = state.notificationsList.map((n) =>
          n.id === updated.id ? updated : n
        );
        state.unreadCount = state.notificationsList.filter((n) => !n.read).length;
      })
      // markAllAsReadThunk
      .addCase(markAllAsReadThunk.fulfilled, (state) => {
        state.notificationsList = state.notificationsList.map((n) => ({ ...n, read: true }));
        state.unreadCount = 0;
      });
  },
});

export const { clearNotifications } = notificationsSlice.actions;

export default notificationsSlice.reducer;
