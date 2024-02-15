import { Currency } from "../types";

export interface GetDepositAdressesResponse {
  data: Data;
}

interface Data {
  depositAddresses: DepositAddress[];
}

interface DepositAddress {
  address: string;
  currency: Currency;
  info: any;
}

