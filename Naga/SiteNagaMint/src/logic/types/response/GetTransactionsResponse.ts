import { Transaction } from "../types";

export interface GetTransactionsResponse {
  data: Data;
}

interface Data {
  transactions: Transaction[];
}