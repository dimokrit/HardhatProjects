import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WhiteListRepository } from '../api/WhiteListRepository';
import { UserWaitList } from './types/response/GetNFTItemsResponse';
import { WhiteListItem } from './types/response/GetWhiteListResponse';
import { PaymentDeposit } from './types/types';

type FAQItem = {
  id: number
  title: string
  descriptions: string[]
  isActive: boolean,
}

export type WhiteListState = {
  loadDataStatus: 'init' | 'loading' | 'success' | 'failed'
  uploadDataStatus: 'init' | 'loading' | 'success' | 'failed'
  activeWindow: 'invest' | 'faq' | 'congratulation' | 'error'
  previousWindow: 'invest' | 'faq' | 'congratulation' | 'error'

  FAQList: FAQItem[]
  NFTItems: UserWaitList[]

  countGenesises: number | null
  countSpheres: number | null
  countNFTs: number | null

  waitListItems: WhiteListItem[]
  currentWaitListItem: WhiteListItem | null

  countOrdersWaitListItem: number | null
  totalPrice: number

  referrerCode: string | null
}

const initialState: WhiteListState = {
  loadDataStatus: 'init',
  uploadDataStatus: 'init',
  activeWindow: 'invest',
  previousWindow: 'invest',

  FAQList: [
    {
      id: 1, isActive: false,
      title: 'What is the White List?',
      descriptions: [
        `- The list of investors guaranteed to receive the allocation during the project's presale.`,
      ]
    },
    {
      id: 2, isActive: false,
      title: 'What are the Girand White List membership benefits?',
      descriptions: [
        '- Guaranteed possession of Girand NFT during the project’s presale.',
        '- Early access and special NFT presale conditions.',
        '- Project bonuses.',
        '- Early access to content, news, and events.',
      ],
    },
    {
      id: 3, isActive: false,
      title: 'Is the allocation limited?',
      descriptions: [
        '- Yes, it is limited for each project presale round.',
      ],
    },
    {
      id: 4, isActive: false,
      title: 'What is the purpose of the White List project?',
      descriptions: [
        '- Make the NFT distribution process efficient and fair.',
        '- Get community support.',
        '- Early access for investors.',
      ],
    },
    {
      id: 5, isActive: false,
      title: `What happens if I don't receive an NFT allocation?`,
      descriptions: [
        '- We guarantee you a full refund of your spent tokens.',
      ],
    },
    {
      id: 6, isActive: false,
      title: `Is it safe to become a member of the White List?`,
      descriptions: [
        '- Yes, the project ensures your confidentiality and the security of transactions.',
      ],
    },
    {
      id: 7, isActive: false,
      title: 'Where can I find the latest information on the project presale?',
      descriptions: [
        '- The information can be found in our social networks.',
        '- Also, you can subscribe to the project’s newsletter to get instant notifications.',
      ],
    },
    {
      id: 8, isActive: false,
      title: 'Can I transfer my White List Membership to another investor?',
      descriptions: [
        `- The White List Membership transfer is currently unavailable due to the presale's privacy.`,
      ],
    },
  ],

  NFTItems: [],
  countGenesises: null,
  countSpheres: null,
  countNFTs: null,

  waitListItems: [],
  currentWaitListItem: null,

  countOrdersWaitListItem: 0,
  totalPrice: 0,

  referrerCode: null
};

export const waitListSlice = createSlice({
  name: 'wait-list',
  initialState,

  //sync
  reducers: {
    clearState: (state) => {
      return initialState
    },
    setCurrentWaitListItem: (state, action: PayloadAction<WhiteListItem>) => {
      state.currentWaitListItem = action.payload
    },
    setWhiteListItemCount: (state, action: PayloadAction<number>) => {
      state.countOrdersWaitListItem = action.payload ?? 0
    },
    setTotalPrice: (state, action: PayloadAction<number>) => {
      state.totalPrice = action.payload ?? 0
    },
    setActiveWindow: (state, action: PayloadAction<'invest' | 'faq' | 'congratulation' | 'error'>) => {
      state.activeWindow = action.payload
    },
    setPreviousWindow: (state, action: PayloadAction<'invest' | 'faq' | 'congratulation' | 'error'>) => {
      state.previousWindow = action.payload
    },
    setUploadDataStatus: (state, action: PayloadAction<'init' | 'loading' | 'success' | 'failed'>) => {
      state.uploadDataStatus = action.payload
    },
    setActiveFAQItem: (state, action: PayloadAction<number>) => {
      state.FAQList.forEach(e =>
        e.id === action.payload ?
          (e.isActive ? e.isActive = false : e.isActive = true) : e.isActive = false
      )
    },
  },

  // async
  extraReducers: (builder) => {
    builder
      // buyWhiteListItem
      .addCase(buyWhiteListItem.pending, (state) => {
        state.uploadDataStatus = 'loading'
      })
      .addCase(buyWhiteListItem.fulfilled, (state, action) => {
        action.payload.isSuccess ? state.uploadDataStatus = 'success' : state.uploadDataStatus = 'failed'
        state.referrerCode = action.payload.referrerCode
      })
      .addCase(buyWhiteListItem.rejected, (state) => {
        state.uploadDataStatus = 'failed'
      })

      // getWhiteListItems
      .addCase(getWhiteListItems.pending, (state) => {
        state.loadDataStatus = 'loading'
      })
      .addCase(getWhiteListItems.fulfilled, (state, action) => {
        state.loadDataStatus = 'success'
        state.waitListItems = action.payload
        state.currentWaitListItem = action.payload[0] //! временно 
      })
      .addCase(getWhiteListItems.rejected, (state) => {
        state.loadDataStatus = 'failed'
      })

      // getNFTItems
      .addCase(getNFTItems.pending, (state) => {
        state.loadDataStatus = 'loading'
      })
      .addCase(getNFTItems.fulfilled, (state, action) => {
        state.loadDataStatus = 'success'
        state.NFTItems = action.payload
      })
      .addCase(getNFTItems.rejected, (state) => {
        state.loadDataStatus = 'failed'
      })

      // getAggregatedWhiteList
      .addCase(getAggregatedWhiteList.pending, (state) => {
        state.loadDataStatus = 'loading'
      })
      .addCase(getAggregatedWhiteList.fulfilled, (state, action) => {
        const item = action.payload;
        state.loadDataStatus = 'success'

        state.countSpheres = item?.userWaitListQty?.sphereQty || null
        state.countGenesises = Math.floor(item?.userWaitListQty?.qty / 3) || null
        state.countNFTs = item?.userWaitListQty?.qty || null
      })
      .addCase(getAggregatedWhiteList.rejected, (state) => {
        state.loadDataStatus = 'failed'
      })
  },
});

// async functions
const buyWhiteListItem = createAsyncThunk(
  'wait-list/buyWhiteListItem',
  async ({ waitListId, qty }: { waitListId: string, qty: number }) => {
    const data = await WhiteListRepository.buyWhiteListItem({ waitListId, qty });
    return data;
  }
);

const getWhiteListItems = createAsyncThunk(
  'wait-list/getWhiteListItems',
  async () => {
    const waitListItems = await WhiteListRepository.getWhiteListItems();
    return waitListItems;
  }
);

const getNFTItems = createAsyncThunk(
  'wait-list/getNFTItems',
  async () => {
    const NFTItems = await WhiteListRepository.getNFTItems();
    return NFTItems;
  }
);

const getAggregatedWhiteList = createAsyncThunk(
  'wait-list/getAggregatedWhiteList',
  async () => {
    const item = await WhiteListRepository.getAggregatedWhiteList();
    return item;
  }
);

export const asyncActions = { buyWhiteListItem, getWhiteListItems, getNFTItems, getAggregatedWhiteList }
export const actions = { ...waitListSlice.actions, ...asyncActions }

export default waitListSlice.reducer
