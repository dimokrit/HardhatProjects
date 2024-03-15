import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type MainState = {
  showLoginModal: boolean;
  showVideoModal: boolean;
  showMainLoader: boolean;
  showMobileNavbar: boolean;
  showInfoMessage: boolean;

  infoMessage: string;
}

const initialState: MainState = {
  showMobileNavbar: false,
  showLoginModal: false,
  showVideoModal: false,
  showMainLoader: true,
  showInfoMessage: false,

  infoMessage: '',
};

export const mainSlice = createSlice({
  name: 'main-landing',
  initialState,

  //sync
  reducers: {

    clearState: (state) => {
      return initialState
    },
    showMobileNavbar: (state, action: PayloadAction<boolean>) => {
      state.showMobileNavbar = action.payload
    },
    showLoginModal: (state, action: PayloadAction<boolean>) => {
      state.showLoginModal = action.payload
    },
    showVideoModal: (state, action: PayloadAction<boolean>) => {
      state.showVideoModal = action.payload
    },
    showMainLoader: (state, action: PayloadAction<boolean>) => {
      state.showMainLoader = action.payload
    },
    showInfoMessage: (state, action: PayloadAction<boolean>) => {
      state.showInfoMessage = action.payload
    },
    setInfoMessage: (state, action: PayloadAction<string>) => {
      state.infoMessage = action.payload
    },
  },

});

export const actions = mainSlice.actions

export default mainSlice.reducer
