export interface GetUserBalanceResponse {
  data: Data;
}

export interface Data {
  balance: Balance[];
}

export interface Balance {
  balance?: string;
  currency: string;
}
