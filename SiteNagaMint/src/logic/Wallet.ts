import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WalletRepository } from '../api/WalletRepository';
import { Balance } from './types/response/GetUserBalanceResponse';
import { DepositAddress, PaymentDeposit, Transaction } from './types/types';

export type WalletState = {
  loadDepositsStatus: 'init' | 'loading' | 'success' | 'failed'
  loadTransactionsStatus: 'init' | 'loading' | 'success' | 'failed'
  loadBalancesStatus: 'init' | 'loading' | 'success' | 'failed'

  statusWallet: 'opened' | 'closed'
  activeWalletTab: 'spending' | 'wallet'

  currentWalletWindow: 'spending-wallet' | 'transfer' | 'choose-network' | 'qr-code-ton' | 'qr-code-trc20' | 'select-transfer' | 'settings' | 'support'
  previosWalletWindow: 'spending-wallet' | 'transfer' | 'choose-network' | 'qr-code-ton' | 'qr-code-trc20' | 'select-transfer' | 'settings' | 'support'

  depositAddresses: DepositAddress[]
  transactions: Transaction[]
  spendingTransactions: Transaction[]

  userBalances: Balance[]
  userPromoCode: string | null

  paymentDeposits: PaymentDeposit[]
  currentPaymentDeposit: PaymentDeposit | undefined
}

const initialState: WalletState = {
  loadDepositsStatus: 'init',
  loadTransactionsStatus: 'init',
  loadBalancesStatus: 'init',

  statusWallet: 'closed',
  activeWalletTab: 'wallet',

  currentWalletWindow: 'spending-wallet',
  previosWalletWindow: 'spending-wallet',

  depositAddresses: [],

  transactions: [],
  spendingTransactions: [],

  userBalances: [],
  userPromoCode: null,

  paymentDeposits: [],
  currentPaymentDeposit: undefined,

};

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,

  //sync
  reducers: {
    clearState: (state) => {
      return initialState
    },

    setPaymentDeposits: (state, action: PayloadAction<PaymentDeposit[]>) => {
      state.paymentDeposits = action.payload
    },
    setCurrentPaymentDeposit: (state, action: PayloadAction<PaymentDeposit | undefined>) => {
      state.currentPaymentDeposit = action.payload
    },

    setUserPromo: (state, action: PayloadAction<string | null>) => {
      state.userPromoCode = action.payload
    },
    setStatusWalet: (state, action: PayloadAction<'opened' | 'closed'>) => {
      state.statusWallet = action.payload
    },

    setActiveWaletTab: (state, action: PayloadAction<'spending' | 'wallet'>) => {
      state.activeWalletTab = action.payload
    },

    setCurrentWalletWindow: (state, action: PayloadAction<'spending-wallet' | 'transfer' | 'choose-network' | 'qr-code-ton' | 'qr-code-trc20' | 'select-transfer' | 'settings' | 'support'>) => {
      if (state.currentWalletWindow === 'choose-network') {
        state.previosWalletWindow = state.currentWalletWindow
      } else {
        state.previosWalletWindow = 'spending-wallet'
      }
      state.currentWalletWindow = action.payload
    },
  },

  // async
  extraReducers: (builder) => {
    builder

      //getWalletTransactions
      .addCase(getTransactionsByUserId.pending, (state) => {
        state.loadTransactionsStatus = 'loading'
      })
      .addCase(getTransactionsByUserId.fulfilled, (state, action) => {
        state.loadTransactionsStatus = 'success'
        state.transactions = action.payload
      })
      .addCase(getTransactionsByUserId.rejected, (state) => {
        state.loadTransactionsStatus = 'failed'
      })

      //getDepositAdressesByUserId
      .addCase(getDepositAdressesByUserId.pending, (state) => {
        state.loadDepositsStatus = 'loading'
      })
      .addCase(getDepositAdressesByUserId.fulfilled, (state, action) => {
        if (action.payload) {
          state.loadDepositsStatus = 'success'
          state.depositAddresses = action.payload
        } else {
          state.loadDepositsStatus = 'failed'
        }
      })
      .addCase(getDepositAdressesByUserId.rejected, (state) => {
        state.loadDepositsStatus = 'failed'
      })

      //getUserBalance
      .addCase(getUserBalance.pending, (state) => {
        state.loadBalancesStatus = 'loading'
      })
      .addCase(getUserBalance.fulfilled, (state, action) => {
        if (action.payload) {
          state.loadBalancesStatus = 'success'
          state.userBalances = action.payload
        } else {
          state.loadBalancesStatus = 'failed'
        }

      })
      .addCase(getUserBalance.rejected, (state) => {
        state.loadBalancesStatus = 'failed'
      })
  },
});

// async functions
const getTransactionsByUserId = createAsyncThunk(
  'wallet/getTransactionsByUserId',
  async (userId: string) => {
    const transaction = await WalletRepository.getTransactionsByUserId(userId);
    return transaction;
  }
);
const getDepositAdressesByUserId = createAsyncThunk(
  'wallet/getDepositAdressesByUserId',
  async (userId: string) => {
    const depositAddresses = await WalletRepository.getDepositAdressesByUserId(userId);
    return depositAddresses;
  }
);

const getUserBalance = createAsyncThunk(
  'wallet/getUserBalance',
  async () => {
    const balances = await WalletRepository.getUserBalance();
    return balances;
  }
);

export const asyncActions = { getTransactionsByUserId, getDepositAdressesByUserId, getUserBalance }
export const actions = { ...walletSlice.actions, ...asyncActions }

export default walletSlice.reducer
