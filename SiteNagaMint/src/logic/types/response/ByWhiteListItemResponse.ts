export interface ByWhiteListItemResponse {
  data: Data;
}

export interface Data {
  buyWaitList: BuyWhiteList;
}

export interface BuyWhiteList {
  isSuccess: boolean;
  referrerCode: string;
  error: string;
}
