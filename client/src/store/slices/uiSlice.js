import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: null,
  sidebar: {
    open: true,
  },
  theme: {
    mode: 'light',
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    toggleSidebar: (state) => {
      state.sidebar.open = !state.sidebar.open;
    },
    setSidebarOpen: (state, action) => {
      state.sidebar.open = action.payload;
    },
    toggleThemeMode: (state) => {
      state.theme.mode = state.theme.mode === 'light' ? 'dark' : 'light';
    },
  },
});

export const {
  setMessage,
  clearMessage,
  toggleSidebar,
  setSidebarOpen,
  toggleThemeMode,
} = uiSlice.actions;

export const selectMessage = (state) => state.ui.message;
export const selectSidebar = (state) => state.ui.sidebar;
export const selectThemeMode = (state) => state.ui.theme.mode;

export default uiSlice.reducer;
