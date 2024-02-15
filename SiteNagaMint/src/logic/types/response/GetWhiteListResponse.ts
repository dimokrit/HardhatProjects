import { Currency } from "../types";

export interface GetWhiteListResponse {
  data: Data;
}

export interface Data {
  waitLists: WhiteListItem[];
}

export interface WhiteListItem {
  id: string;
  currency: Currency;
  name: string;
  price: number;
  priceUsd: number;
  qty: number;
  createdAt: Date;
  deletedAt: Date;
}