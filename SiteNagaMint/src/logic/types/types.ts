
export type Sphere = {
  id: string
  name: string
  imgPath: string
}

export type Hero = {
  id: string
  name: string
  imgPath: string
}

export type User = {
  id: string
  name: string
  email: string
  referrerCode: string
  inviterCode: string
}

export interface Transaction {
  owner: User;
  operation: string;
  transactionID: string;
  currency: Currency;
  amount: number;
  txHash: string;
  status: string;
  createdAt: Date;
}

export interface Currency {
  id: string;
  name: string;
}

export interface DepositAddress {
  address: string;
  currency: Currency;
  info: any;
}
export interface PaymentDeposit {
  balance: string;
  currency: Currency;
}




