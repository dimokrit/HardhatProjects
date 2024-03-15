import { Currency } from "../types";

export interface GetTokenListResponse {
  data: Data;
}

export interface Data {
  tokenWaitLists: TokenListItem[];
}

export interface TokenListItem {
  id: string;
  currency: Currency;
  name: string;
  price: number;
  priceUsd: number;
  qty: number;
  createdAt: Date;
  deletedAt: Date;
}