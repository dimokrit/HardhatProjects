import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import mainReducer from './logic/MainLanding';
import personalReducer from './logic/Personal';
import userReducer from './logic/User';
import walletReducer from './logic/Wallet';
import waitListReducer from './logic/WhiteList';
import glcPresaleReducer from './logic/GlcPresale';
import nagaMintReducer from './logic/NagaMint';

export const store = configureStore({
  reducer: {
    "main-landing": mainReducer,
    "personal": personalReducer,
    "wallet": walletReducer,
    "user": userReducer,
    "wait-list": waitListReducer,
    "glc-presale": glcPresaleReducer,
    "naga-mint": nagaMintReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
