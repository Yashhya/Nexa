import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isCartOpen: false,
    isAssistantOpen: false,
    isSearchOpen: false,
    isMobileMenuOpen: false,
    darkMode: true,
    notifications: [],
  },
  reducers: {
    toggleCart: (state) => { state.isCartOpen = !state.isCartOpen; },
    setCartOpen: (state, action) => { state.isCartOpen = action.payload; },
    toggleAssistant: (state) => { state.isAssistantOpen = !state.isAssistantOpen; },
    setAssistantOpen: (state, action) => { state.isAssistantOpen = action.payload; },
    toggleSearch: (state) => { state.isSearchOpen = !state.isSearchOpen; },
    toggleMobileMenu: (state) => { state.isMobileMenuOpen = !state.isMobileMenuOpen; },
    setMobileMenu: (state, action) => { state.isMobileMenuOpen = action.payload; },
    addNotification: (state, action) => {
      state.notifications.push({ id: Date.now(), ...action.payload });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
  }
});

export const {
  toggleCart, setCartOpen,
  toggleAssistant, setAssistantOpen,
  toggleSearch, toggleMobileMenu, setMobileMenu,
  addNotification, removeNotification
} = uiSlice.actions;
export default uiSlice.reducer;
