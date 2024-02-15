import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type NagaMintState = {
  showLoginModal: boolean;
}

const initialState: NagaMintState = {
  showLoginModal: false,
};

export const nagaSlice = createSlice({
  name: 'naga-mint',
  initialState,

  //sync
  reducers: {
    clearState: (state) => {
      return initialState
    },
    showLoginModal: (state, action: PayloadAction<boolean>) => {
      state.showLoginModal = action.payload
    },
  },

});

export const actions = nagaSlice.actions

export default nagaSlice.reducer
