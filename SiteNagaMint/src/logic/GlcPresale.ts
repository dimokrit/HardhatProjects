import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RequestTokenRepository } from '../api/RequestTokenRepository';
import { BuyTokenDto, DtoIndividualRequestToken, DtoNonIndividualRequestTokens } from './types/request/RequestTypes';
import { IndividualRequestToken } from './types/response/GetIndividualRequestTokens';
import { NonIndividualRequestToken } from './types/response/GetNonIndividualRequestTokens';
import { TokenListItem } from './types/response/GetTokenListResponse';
import { PaymentDeposit } from './types/types';

export type GlcPresaleState = {
  updateIndividualRequestTokenStatus: 'initial' | 'success' | 'failed' | 'loading',

  isLoading: boolean
  error: string

  activeTab: 'seedAngel' | 'presale1' | 'presale2' | 'launchpad'
  previousTab: 'seedAngel' | 'presale1' | 'presale2' | 'launchpad'

  tokenRequest: NonIndividualRequestToken | IndividualRequestToken | undefined
  userGlcTokenCount: number

  tokenItems: TokenListItem[]
  currentTokenItem: TokenListItem | undefined

  totalPrice: number
  availableAllocation: number,
}

const initialState: GlcPresaleState = {
  updateIndividualRequestTokenStatus: 'initial',
  isLoading: false,
  error: "",

  activeTab: 'seedAngel',
  previousTab: 'seedAngel',

  tokenRequest: undefined,
  userGlcTokenCount: 0,

  tokenItems: [],
  currentTokenItem: undefined,

  totalPrice: 0,
  availableAllocation: 0,
}

export const glcPresaleSlice = createSlice({
  name: 'glc-presale',
  initialState,

  //sync
  reducers: {
    clearState: (state) => {
      return initialState
    },
    setActiveTab: (state, action: PayloadAction<GlcPresaleState['activeTab']>) => {
      state.previousTab = state.activeTab;
      state.activeTab = action.payload;
    },
    setCurrentTokenListItem: (state, action: PayloadAction<TokenListItem>) => {
      state.currentTokenItem = action.payload
    },
    setTotalPrice: (state, action: PayloadAction<number>) => {
      state.totalPrice = action.payload ?? 0
    },
    setAvailableAllocation: (state, action: PayloadAction<number>) => {
      state.availableAllocation = action.payload ?? 0
    },
  },

  // async
  extraReducers: (builder) => {
    builder
      // getTokenRequest
      .addCase(getTokenRequest.pending, (state) => {
        pendingHandler(state)
      })
      .addCase(getTokenRequest.fulfilled, (state, action) => {
        fulfilledHandler(state, action)
        state.tokenRequest = action.payload
      })
      .addCase(getTokenRequest.rejected, (state) => {
        rejectedHandler(state, 'getTokenRequest error')
      })

      // createIndividualRequestToken
      .addCase(createIndividualRequestToken.pending, (state) => {
        pendingHandler(state)
      })
      .addCase(createIndividualRequestToken.fulfilled, (state, action) => {
        fulfilledHandler(state, action)
      })
      .addCase(createIndividualRequestToken.rejected, (state) => {
        rejectedHandler(state, 'createIndividualRequestToken error')
      })

      // createNonIndividualRequestToken
      .addCase(createNonIndividualRequestToken.pending, (state) => {
        pendingHandler(state)
      })
      .addCase(createNonIndividualRequestToken.fulfilled, (state, action) => {
        fulfilledHandler(state, action)
      })
      .addCase(createNonIndividualRequestToken.rejected, (state) => {
        rejectedHandler(state, 'createNonIndividualRequestToken error')
      })

      // getWhiteListItems
      .addCase(getTokenListItems.pending, (state) => {
        pendingHandler(state)
      })
      .addCase(getTokenListItems.fulfilled, (state, action) => {
        fulfilledHandler(state, action)
        state.tokenItems = action.payload
        state.currentTokenItem = action.payload[0] //! временно 
      })
      .addCase(getTokenListItems.rejected, (state) => {
        rejectedHandler(state, 'getTokenListItems error')
      })

      // getAggregatedWhiteList
      .addCase(getAggregatedTokenWaitList.pending, (state) => {
        pendingHandler(state)
      })
      .addCase(getAggregatedTokenWaitList.fulfilled, (state, action) => {
        const item = action.payload;
        fulfilledHandler(state, action)
        state.userGlcTokenCount = item?.tokenUserWaitListQty?.qty || 0
      })
      .addCase(getAggregatedTokenWaitList.rejected, (state) => {
        rejectedHandler(state, 'getAggregatedTokenWaitList error')
      })

      // update Individual Request Token
      .addCase(updateIndividualRequestToken.pending, (state) => {
        state.updateIndividualRequestTokenStatus = 'loading';
      })
      .addCase(updateIndividualRequestToken.fulfilled, (state, action) => {
        console.log(action.payload, '/updateIndividualRequestToken/')
        state.updateIndividualRequestTokenStatus = 'success';
      })
      .addCase(updateIndividualRequestToken.rejected, (state) => {
        rejectedHandler(state, 'updateIndividualRequestToken error')
        state.updateIndividualRequestTokenStatus = 'failed';
      })
  },
});

// Thunks
const getTokenRequest = createAsyncThunk('glc-presale/getIndividualRequestTokens',
  async ({ userId, expiredAt }: { userId: string, expiredAt: string }) => {
    const getIndividualRequestToken = RequestTokenRepository.getIndividualRequestToken({ userId, expiredAt })
    const getNonindividualRequestToken = RequestTokenRepository.getNonIndividualRequestToken({ userId, expiredAt })

    const tokenRequest = await Promise.all([getIndividualRequestToken, getNonindividualRequestToken])
    const validTokenRequest = tokenRequest.find(tokenRequest => tokenRequest !== undefined)

    return validTokenRequest
  }
)

const createIndividualRequestToken = createAsyncThunk('glc-presale/createIndividualRequestToken',
  async (data: DtoIndividualRequestToken) => {
    const individualRequestToken = await RequestTokenRepository.createIndividualRequestToken(data)
    return individualRequestToken
  }
)

const createNonIndividualRequestToken = createAsyncThunk('glc-presale/createNonIndividualRequestToken',
  async (data: DtoNonIndividualRequestTokens) => {
    const individualRequestToken = await RequestTokenRepository.createNonIndividualRequestToken(data)
    return individualRequestToken
  }
)

const getTokenListItems = createAsyncThunk('glc-presale/tokenWaitListItems',
  async () => {
    const tokenListItems = await RequestTokenRepository.getTokenListItems();
    return tokenListItems;
  }
);

const getAggregatedTokenWaitList = createAsyncThunk('glc-presale/getAggregatedTokenWaitList',
  async () => {
    const aggregatedTokenWaitList = await RequestTokenRepository.getAggregatedTokenWaitList();
    return aggregatedTokenWaitList;
  }
);

const buyTokenListItem = createAsyncThunk('glc-presale/buyTokenListItem',
  async ({ tokenWaitListId, qty, tokenRequestId }: BuyTokenDto) => {
    const data = await RequestTokenRepository.buyTokenListItem({ tokenWaitListId, qty, tokenRequestId });
    return data;
  }
);

const updateIndividualRequestToken = createAsyncThunk('glc-presale/updateIndividualRequestToken',
  async ({stat, id}: {stat: string, id: string}) => {
    const data = await RequestTokenRepository.updateIndividualRequestToken(stat, id);
    return data;
  }
);

// Helpers
const pendingHandler = (state: any) => {
  state.isLoading = true
}

const fulfilledHandler = (state: any, action: any) => {
  state.isLoading = false
  state.error = ''
}

const rejectedHandler = (state: any, error: string) => {
  state.isLoading = false
  state.error = error
}


export const asyncActions = {
  getTokenRequest,
  createIndividualRequestToken,
  createNonIndividualRequestToken,
  getTokenListItems,
  getAggregatedTokenWaitList,
  buyTokenListItem,
  updateIndividualRequestToken
}

export const actions = { ...glcPresaleSlice.actions, ...asyncActions }

export default glcPresaleSlice.reducer
