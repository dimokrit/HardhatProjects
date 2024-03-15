import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Hero, Sphere, User } from './types/types';

export type PersonalState = {
  currentScreen: 'white-list' | 'chest' | 'hero' | 'sphere' | 'main' | 'glc-presale'
  currentVideoIndex: number

  showRedirectModal: boolean
  showGoButton: boolean;
  activeGoButton: boolean;
  redirectModal: {
    title: string,
    description: string,
  }

  userSettings: {
    sound: 'off' | 'on'
  }

  statusSound: 'on' | 'off'
  statusGate: 'opened' | 'closed'
  statusSphereInfo: 'opened' | 'closed'
  statusGetSphere: 'activated' | 'deactivated'

  activeChestTab: 'spheres' | 'rings'

  listHero: Hero[]
  currentHero: Hero

  listSphere: Sphere[]
  currentSphere: Sphere
}

const initialState: PersonalState = {
  currentScreen: 'main',
  currentVideoIndex: 1,

  showRedirectModal: false,
  showGoButton: true,
  activeGoButton: false,
  redirectModal: {
    title: '',
    description: '',
  },


  userSettings: {
    sound: 'off'
  },

  statusSound: 'off',
  statusGate: 'closed',

  statusSphereInfo: 'closed',
  statusGetSphere: 'deactivated',

  activeChestTab: 'spheres',

  currentSphere: { id: '2', name: 'Power sphere', imgPath: 'img/ebox-s2.png' },

  listSphere: [
    { id: '1', name: 'Energy sphere', imgPath: 'img/ebox-s1.png' },
    { id: '2', name: 'Power sphere', imgPath: 'img/ebox-s2.png' },
    { id: '3', name: 'Mana sphere', imgPath: 'img/ebox-s3.png' },
    { id: '4', name: 'Energy sphere', imgPath: 'img/ebox-s1.png' },
    { id: '5', name: 'Power sphere', imgPath: 'img/ebox-s2.png' },
    { id: '6', name: 'Mana sphere', imgPath: 'img/ebox-s3.png' },
  ],

  currentHero: { id: '2', name: 'Power sphere', imgPath: 'img/ebox-s2.png' },

  listHero: [
    { id: '1', name: 'Energy sphere', imgPath: 'img/ebox-s1.png' },
    { id: '2', name: 'Power sphere', imgPath: 'img/ebox-s2.png' },
    { id: '3', name: 'Mana sphere', imgPath: 'img/ebox-s3.png' },
    { id: '4', name: 'Energy sphere', imgPath: 'img/ebox-s1.png' },
    { id: '5', name: 'Power sphere', imgPath: 'img/ebox-s2.png' },
    { id: '6', name: 'Mana sphere', imgPath: 'img/ebox-s3.png' },
  ],
};

export const personalSlice1 = createSlice({
  name: 'personal',
  initialState,

  //sync
  reducers: {

    clearState: (state) => {
      return initialState
    },

    showGoButton: (state, action: PayloadAction<boolean>) => {
      state.showGoButton = action.payload
    },

    setActiveGoButton: (state, action: PayloadAction<boolean>) => {
      state.activeGoButton = action.payload
    },

    setShowRedirectModal: (state, action: PayloadAction<boolean>) => {
      state.showRedirectModal = action.payload
    },

    setRedirectModalTitle: (state, action: PayloadAction<{ title: string, description: string }>) => {
      state.redirectModal = {
        ...action.payload
      }
    },

    setCurrentVideoIndex: (state, action: PayloadAction<number>) => {
      state.currentVideoIndex = action.payload
    },

    setStatusGate: (state, action: PayloadAction<'opened' | 'closed'>) => {
      state.statusGate = action.payload
    },

    setStatusSound: (state, action: PayloadAction<'on' | 'off'>) => {
      state.statusSound = action.payload
      state.userSettings = { ...state.userSettings, sound: action.payload }
    },

    setSoundInUserSettings: (state, action: PayloadAction<'on' | 'off'>) => {
      state.userSettings = { ...state.userSettings, sound: action.payload }
    },

    setActiveChestTab: (state, action: PayloadAction<'spheres' | 'rings'>) => {
      state.activeChestTab = action.payload
    },

    setStatusSphereInfo: (state, action: PayloadAction<'opened' | 'closed'>) => {
      state.statusSphereInfo = action.payload
    },

    setStatusGetSphere: (state, action: PayloadAction<'activated' | 'deactivated'>) => {
      state.statusGetSphere = action.payload
    },

    setCurrentScreen: (state, action: PayloadAction<'white-list' | 'chest' | 'hero' | 'sphere' | 'main' | 'glc-presale'>) => {
      state.currentScreen = action.payload
    },

    setCurrentSphere: (state, action: PayloadAction<Sphere>) => {
      state.currentSphere = action.payload
    },


  },

  // async
  extraReducers: (builder) => {
  },
});

export const actions = personalSlice1.actions

export default personalSlice1.reducer
