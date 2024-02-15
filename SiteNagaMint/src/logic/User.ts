import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserRepository } from '../api/UserRepository';
import { LoginData } from './types/request/RequestTypes';
import { User } from './types/types';

export type UserState = {
  activeLoginTab: 'singIn' | 'singUp' | 'forgotPass';

  loginStatus: 'success' | 'initial' | 'loading' | 'failed';
  authStatus: 'success' | 'initial' | 'loading' | 'failed';
  logoutStatus: 'success' | 'initial' | 'loading' | 'failed';
  createUserStatus: 'success' | 'initial' | 'loading' | 'failed';
  uploadDataStatus: 'success' | 'initial' | 'loading' | 'failed';
  resetPasswordStatus: 'success' | 'initial' | 'loading' | 'failed';

  passwordHasSend: boolean;
  currentUser: User | null;
}

const initialState: UserState = {
  activeLoginTab: 'singIn',

  loginStatus: 'initial',
  authStatus: 'initial',
  logoutStatus: 'initial',
  createUserStatus: 'initial',
  uploadDataStatus: 'initial',
  resetPasswordStatus: 'initial',

  passwordHasSend: false,
  currentUser: null
};

export const mainSlice = createSlice({
  name: 'user',
  initialState,

  //sync
  reducers: {
    clearState: (state) => {
      return initialState
    },

    setCreateUserStatus: (state, action: PayloadAction<'success' | 'initial' | 'loading' | 'failed'>) => {
      state.createUserStatus = action.payload
    },
    setUploadDataStatus: (state, action: PayloadAction<'success' | 'initial' | 'loading' | 'failed'>) => {
      state.uploadDataStatus = action.payload
    },
    setLoginStatus: (state, action: PayloadAction<'success' | 'initial' | 'loading' | 'failed'>) => {
      state.loginStatus = action.payload
    },
    setResetPasswordStatus: (state, action: PayloadAction<'success' | 'initial' | 'loading' | 'failed'>) => {
      state.resetPasswordStatus = action.payload
    },
    setPaswordHasSend: (state, action: PayloadAction<boolean>) => {
      state.passwordHasSend = action.payload
    },

    setActiveLoginTab: (state, action: PayloadAction<'singIn' | 'singUp' | 'forgotPass'>) => {
      state.activeLoginTab = action.payload
      state.passwordHasSend = false;
    },
  },

  // async
  extraReducers: (builder) => {
    builder
      // create user
      .addCase(createUser.pending, (state) => {
        state.createUserStatus = 'loading';
      })
      .addCase(createUser.fulfilled, (state, action) => {
        action.payload ? state.createUserStatus = 'success' : state.createUserStatus = 'failed';
        state.passwordHasSend = !!action.payload;
      })
      .addCase(createUser.rejected, (state) => {
        state.createUserStatus = 'failed';
      })

      //login user
      .addCase(loginUser.pending, (state) => {
        state.loginStatus = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        if (!action.payload) {
          state.loginStatus = 'failed';
          state.currentUser = action.payload;
        } else {
          state.loginStatus = 'success';
          state.currentUser = action.payload;
        }
      })
      .addCase(loginUser.rejected, (state) => {
        state.loginStatus = 'failed';
      })

      //logout user
      .addCase(logoutUser.pending, (state) => {
        state.logoutStatus = 'loading';
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.logoutStatus = 'success';
      })
      .addCase(logoutUser.rejected, (state) => {
        state.logoutStatus = 'failed';
      })

      // get current user
      .addCase(getAuthenticatedUser.pending, (state) => {
        state.authStatus = 'loading';
      })
      .addCase(getAuthenticatedUser.fulfilled, (state, action) => {
        if (!action.payload) {
          state.authStatus = 'failed';
          state.currentUser = action.payload;
        } else {
          state.authStatus = 'success';
          state.currentUser = action.payload;
        }
      })
      .addCase(getAuthenticatedUser.rejected, (state) => {
        state.authStatus = 'failed';
      })

      // get update user promo code
      .addCase(updateUserPromo.pending, (state) => {
        state.uploadDataStatus = 'loading';
      })
      .addCase(updateUserPromo.fulfilled, (state, action) => {
        const isUpdated = action.payload
        if (isUpdated) {
          state.uploadDataStatus = 'success';
        } else {
          state.uploadDataStatus = 'failed';
        }

      })
      .addCase(updateUserPromo.rejected, (state) => {
        state.uploadDataStatus = 'failed';
      })

      // reset password
      .addCase(resetPassword.pending, (state) => {
        state.resetPasswordStatus = 'loading';
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        const isSendResetUrlToEmail = action.payload
        state.resetPasswordStatus = isSendResetUrlToEmail === true ? 'success' : 'failed';
      })
      .addCase(resetPassword.rejected, (state) => {
        state.resetPasswordStatus = 'failed';
      })
  },
});

// async functions
const createUser = createAsyncThunk('user/createUser',
  async ({ email }: { email: string }) => {
    const userID = await UserRepository.createUser(email);
    return userID
  }
);

const loginUser = createAsyncThunk('user/loginUser',
  async ({ email, password }: LoginData) => {
    const user = await UserRepository.loginUser({ email: email, password });
    return user
  }
);

const logoutUser = createAsyncThunk('user/logoutUser',
  async () => {
    const user = await UserRepository.logoutUser();
    return user
  }
);

const getAuthenticatedUser = createAsyncThunk('user/getAuthenticatedUser',
  async () => {
    const user = await UserRepository.getAuthenticatedUser();
    return user
  }
);

const updateUserPromo = createAsyncThunk('user/updateUserPromo',
  async ({ promo }: { promo: string }) => {
    const isUpdated = await UserRepository.updateUserPromo({ promo });
    return isUpdated
  }
);

const resetPassword = createAsyncThunk('user/resetPassword',
  async ({ email }: { email: string }) => {
    const isSendResetUrlToEmail = await UserRepository.resetPassword({ email });
    return isSendResetUrlToEmail;
  }
);

// export data to ui component
export const asyncActions = { createUser, loginUser, logoutUser, getAuthenticatedUser, updateUserPromo, resetPassword }
export const actions = { ...mainSlice.actions, ...asyncActions }

// export to main store
export default mainSlice.reducer
