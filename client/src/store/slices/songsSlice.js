import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import songService from '../../services/songService';
import { setMessage } from './uiSlice';

export const fetchSongs = createAsyncThunk(
  'songs/fetchSongs',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await songService.getSongs();
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch songs';
      dispatch(setMessage({ type: 'error', text: message }));
      return rejectWithValue(message);
    }
  }
);

export const fetchSongById = createAsyncThunk(
  'songs/fetchSongById',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await songService.getSongById(id);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch song';
      dispatch(setMessage({ type: 'error', text: message }));
      return rejectWithValue(message);
    }
  }
);

export const createSong = createAsyncThunk(
  'songs/createSong',
  async (songData, { dispatch, rejectWithValue }) => {
    try {
      const response = await songService.createSong(songData);
      dispatch(setMessage({ type: 'success', text: 'Song created successfully!' }));
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create song';
      dispatch(setMessage({ type: 'error', text: message }));
      return rejectWithValue(message);
    }
  }
);

export const updateSong = createAsyncThunk(
  'songs/updateSong',
  async ({ id, songData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await songService.updateSong(id, songData);
      dispatch(setMessage({ type: 'success', text: 'Song updated successfully!' }));
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update song';
      dispatch(setMessage({ type: 'error', text: message }));
      return rejectWithValue(message);
    }
  }
);

export const deleteSong = createAsyncThunk(
  'songs/deleteSong',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await songService.deleteSong(id);
      dispatch(setMessage({ type: 'success', text: 'Song deleted successfully!' }));
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete song';
      dispatch(setMessage({ type: 'error', text: message }));
      return rejectWithValue(message);
    }
  }
);

export const uploadSongAttachment = createAsyncThunk(
  'songs/uploadAttachment',
  async ({ songId, file }, { dispatch, rejectWithValue }) => {
    try {
      const response = await songService.uploadAttachment(songId, file);
      dispatch(setMessage({ type: 'success', text: 'File uploaded successfully!' }));
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to upload file';
      dispatch(setMessage({ type: 'error', text: message }));
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  songs: [],
  currentSong: null,
  loading: false,
  error: null,
};

const songsSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    clearCurrentSong: (state) => {
      state.currentSong = null;
    },
    resetSongsState: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Songs
      .addCase(fetchSongs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSongs.fulfilled, (state, action) => {
        state.loading = false;
        state.songs = action.payload;
      })
      .addCase(fetchSongs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Song By Id
      .addCase(fetchSongById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSongById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSong = action.payload;
      })
      .addCase(fetchSongById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Song
      .addCase(createSong.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSong.fulfilled, (state, action) => {
        state.loading = false;
        state.songs.push(action.payload);
      })
      .addCase(createSong.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Song
      .addCase(updateSong.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSong.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSong = action.payload;
        const index = state.songs.findIndex((song) => song.id === action.payload.id);
        if (index !== -1) {
          state.songs[index] = action.payload;
        }
      })
      .addCase(updateSong.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Song
      .addCase(deleteSong.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSong.fulfilled, (state, action) => {
        state.loading = false;
        state.songs = state.songs.filter((song) => song.id !== action.payload);
        if (state.currentSong && state.currentSong.id === action.payload) {
          state.currentSong = null;
        }
      })
      .addCase(deleteSong.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload Attachment
      .addCase(uploadSongAttachment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadSongAttachment.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentSong && state.currentSong.id === action.payload.songId) {
          state.currentSong.attachments = action.payload.attachments;
        }
      })
      .addCase(uploadSongAttachment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentSong, resetSongsState } = songsSlice.actions;

export const selectSongs = (state) => state.songs.songs;
export const selectCurrentSong = (state) => state.songs.currentSong;
export const selectSongsLoading = (state) => state.songs.loading;
export const selectSongsError = (state) => state.songs.error;

export default songsSlice.reducer;
