import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import setlistService from '../../services/setlistService';
import { setMessage } from './uiSlice';

export const fetchSetlists = createAsyncThunk(
  'setlists/fetchSetlists',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await setlistService.getSetlists();
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch setlists';
      dispatch(setMessage({ type: 'error', text: message }));
      return rejectWithValue(message);
    }
  }
);

export const fetchSetlistById = createAsyncThunk(
  'setlists/fetchSetlistById',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await setlistService.getSetlistById(id);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch setlist';
      dispatch(setMessage({ type: 'error', text: message }));
      return rejectWithValue(message);
    }
  }
);

export const createSetlist = createAsyncThunk(
  'setlists/createSetlist',
  async (setlistData, { dispatch, rejectWithValue }) => {
    try {
      const response = await setlistService.createSetlist(setlistData);
      dispatch(setMessage({ type: 'success', text: 'Setlist created successfully!' }));
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create setlist';
      dispatch(setMessage({ type: 'error', text: message }));
      return rejectWithValue(message);
    }
  }
);

export const updateSetlist = createAsyncThunk(
  'setlists/updateSetlist',
  async ({ id, setlistData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await setlistService.updateSetlist(id, setlistData);
      dispatch(setMessage({ type: 'success', text: 'Setlist updated successfully!' }));
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update setlist';
      dispatch(setMessage({ type: 'error', text: message }));
      return rejectWithValue(message);
    }
  }
);

export const deleteSetlist = createAsyncThunk(
  'setlists/deleteSetlist',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await setlistService.deleteSetlist(id);
      dispatch(setMessage({ type: 'success', text: 'Setlist deleted successfully!' }));
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete setlist';
      dispatch(setMessage({ type: 'error', text: message }));
      return rejectWithValue(message);
    }
  }
);

export const reorderSetlistItems = createAsyncThunk(
  'setlists/reorderSetlistItems',
  async ({ setlistId, itemIds }, { dispatch, rejectWithValue }) => {
    try {
      const response = await setlistService.reorderSetlistItems(setlistId, itemIds);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to reorder setlist';
      dispatch(setMessage({ type: 'error', text: message }));
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  setlists: [],
  currentSetlist: null,
  loading: false,
  error: null,
};

const setlistsSlice = createSlice({
  name: 'setlists',
  initialState,
  reducers: {
    clearCurrentSetlist: (state) => {
      state.currentSetlist = null;
    },
    resetSetlistsState: (state) => {
      state.error = null;
    },
    localUpdateSetlistOrder: (state, action) => {
      if (state.currentSetlist) {
        // Update order locally for a smoother UX before API call completes
        state.currentSetlist.items = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Setlists
      .addCase(fetchSetlists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSetlists.fulfilled, (state, action) => {
        state.loading = false;
        state.setlists = action.payload;
      })
      .addCase(fetchSetlists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Setlist By Id
      .addCase(fetchSetlistById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSetlistById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSetlist = action.payload;
      })
      .addCase(fetchSetlistById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Setlist
      .addCase(createSetlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSetlist.fulfilled, (state, action) => {
        state.loading = false;
        state.setlists.push(action.payload);
      })
      .addCase(createSetlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Setlist
      .addCase(updateSetlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSetlist.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSetlist = action.payload;
        const index = state.setlists.findIndex((setlist) => setlist.id === action.payload.id);
        if (index !== -1) {
          state.setlists[index] = action.payload;
        }
      })
      .addCase(updateSetlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Setlist
      .addCase(deleteSetlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSetlist.fulfilled, (state, action) => {
        state.loading = false;
        state.setlists = state.setlists.filter((setlist) => setlist.id !== action.payload);
        if (state.currentSetlist && state.currentSetlist.id === action.payload) {
          state.currentSetlist = null;
        }
      })
      .addCase(deleteSetlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Reorder Setlist Items
      .addCase(reorderSetlistItems.fulfilled, (state, action) => {
        if (state.currentSetlist && state.currentSetlist.id === action.payload.id) {
          state.currentSetlist = action.payload;
        }
      });
  },
});

export const { clearCurrentSetlist, resetSetlistsState, localUpdateSetlistOrder } = setlistsSlice.actions;

export const selectSetlists = (state) => state.setlists.setlists;
export const selectCurrentSetlist = (state) => state.setlists.currentSetlist;
export const selectSetlistsLoading = (state) => state.setlists.loading;
export const selectSetlistsError = (state) => state.setlists.error;

export default setlistsSlice.reducer;
