export interface ByTokenListItemResponse {
  data: Data;
}

export interface Data {
  buyTokenWaitList: BuyTokenList;
}

export interface BuyTokenList {
  isSuccess: boolean;
  error: string;
}
