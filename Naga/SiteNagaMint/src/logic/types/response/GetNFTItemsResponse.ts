import { Currency, User } from "../types";

export interface GetNFTItemsResponse {
  data: Data;
}

export interface Data {
  userWaitLists: UserWaitList[];
}

export interface UserWaitList {
  id: string;
  qty: number;
  price: number;
  cost: number;
  currency: Currency;
  owner: User
}
