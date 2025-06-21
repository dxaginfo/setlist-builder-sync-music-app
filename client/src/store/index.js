import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import setlistsReducer from './slices/setlistsSlice';
import songsReducer from './slices/songsSlice';
import bandsReducer from './slices/bandsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    setlists: setlistsReducer,
    songs: songsReducer,
    bands: bandsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
