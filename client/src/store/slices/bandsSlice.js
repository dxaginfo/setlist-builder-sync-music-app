import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bandService from '../../services/bandService';
import { setMessage } from './uiSlice';

export const fetchBands = createAsyncThunk(
  'bands/fetchBands',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await bandService.getBands();
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch bands';
      dispatch(setMessage({ type: 'error', text: message }));
      return rejectWithValue(message);
    }
  }
);

export const fetchBandById = createAsyncThunk(
  'bands/fetchBandById',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await bandService.getBandById(id);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch band';
      dispatch(setMessage({ type: 'error', text: message }));
      return rejectWithValue(message);
    }
  }
);

export const createBand = createAsyncThunk(
  'bands/createBand',
  async (bandData, { dispatch, rejectWithValue }) => {
    try {
      const response = await bandService.createBand(bandData);
      dispatch(setMessage({ type: 'success', text: 'Band created successfully!' }));
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create band';
      dispatch(setMessage({ type: 'error', text: message }));
      return rejectWithValue(message);
    }
  }
);

export const updateBand = createAsyncThunk(
  'bands/updateBand',
  async ({ id, bandData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await bandService.updateBand(id, bandData);
      dispatch(setMessage({ type: 'success', text: 'Band updated successfully!' }));
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update band';
      dispatch(setMessage({ type: 'error', text: message }));
      return rejectWithValue(message);
    }
  }
);

export const deleteBand = createAsyncThunk(
  'bands/deleteBand',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await bandService.deleteBand(id);
      dispatch(setMessage({ type: 'success', text: 'Band deleted successfully!' }));
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete band';
      dispatch(setMessage({ type: 'error', text: message }));
      return rejectWithValue(message);
    }
  }
);

export const addBandMember = createAsyncThunk(
  'bands/addBandMember',
  async ({ bandId, memberData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await bandService.addBandMember(bandId, memberData);
      dispatch(setMessage({ type: 'success', text: 'Member added successfully!' }));
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to add member';
      dispatch(setMessage({ type: 'error', text: message }));
      return rejectWithValue(message);
    }
  }
);

export const removeBandMember = createAsyncThunk(
  'bands/removeBandMember',
  async ({ bandId, memberId }, { dispatch, rejectWithValue }) => {
    try {
      await bandService.removeBandMember(bandId, memberId);
      dispatch(setMessage({ type: 'success', text: 'Member removed successfully!' }));
      return { bandId, memberId };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to remove member';
      dispatch(setMessage({ type: 'error', text: message }));
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  bands: [],
  currentBand: null,
  loading: false,
  error: null,
};

const bandsSlice = createSlice({
  name: 'bands',
  initialState,
  reducers: {
    clearCurrentBand: (state) => {
      state.currentBand = null;
    },
    resetBandsState: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Bands
      .addCase(fetchBands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBands.fulfilled, (state, action) => {
        state.loading = false;
        state.bands = action.payload;
      })
      .addCase(fetchBands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Band By Id
      .addCase(fetchBandById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBandById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBand = action.payload;
      })
      .addCase(fetchBandById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Band
      .addCase(createBand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBand.fulfilled, (state, action) => {
        state.loading = false;
        state.bands.push(action.payload);
      })
      .addCase(createBand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Band
      .addCase(updateBand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBand.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBand = action.payload;
        const index = state.bands.findIndex((band) => band.id === action.payload.id);
        if (index !== -1) {
          state.bands[index] = action.payload;
        }
      })
      .addCase(updateBand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Band
      .addCase(deleteBand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBand.fulfilled, (state, action) => {
        state.loading = false;
        state.bands = state.bands.filter((band) => band.id !== action.payload);
        if (state.currentBand && state.currentBand.id === action.payload) {
          state.currentBand = null;
        }
      })
      .addCase(deleteBand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Band Member
      .addCase(addBandMember.fulfilled, (state, action) => {
        if (state.currentBand && state.currentBand.id === action.payload.id) {
          state.currentBand = action.payload;
        }
      })
      // Remove Band Member
      .addCase(removeBandMember.fulfilled, (state, action) => {
        if (state.currentBand && state.currentBand.id === action.payload.bandId) {
          state.currentBand.members = state.currentBand.members.filter(
            (member) => member.id !== action.payload.memberId
          );
        }
      });
  },
});

export const { clearCurrentBand, resetBandsState } = bandsSlice.actions;

export const selectBands = (state) => state.bands.bands;
export const selectCurrentBand = (state) => state.bands.currentBand;
export const selectBandsLoading = (state) => state.bands.loading;
export const selectBandsError = (state) => state.bands.error;

export default bandsSlice.reducer;
