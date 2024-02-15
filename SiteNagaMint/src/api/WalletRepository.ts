import { GqlBody } from "../logic/types/request/RequestTypes";
import { GetDepositAdressesResponse } from "../logic/types/response/GetDepositAdressesResponse";
import { GetTransactionsResponse } from "../logic/types/response/GetTransactionsResponse";
import { Balance, GetUserBalanceResponse } from "../logic/types/response/GetUserBalanceResponse";

import { DepositAddress, Transaction } from "../logic/types/types";

import { ApiKeystone } from "./api_keystone";
import { Gql } from "./api_queries";

export class WalletRepository {
  static keystone = ApiKeystone;

  static async getTransactionsByUserId(userId: string): Promise<Transaction[]> {
    const query = Gql.getTransactionsByUserId()
    const body: GqlBody = { operationName: "GetTransactions", variables: { userId }, query: query }
    const response: GetTransactionsResponse = await this.keystone.queryGraphql(body)
    return response.data.transactions ?? []
  }

  static async getDepositAdressesByUserId(userId: string): Promise<DepositAddress[]> {
    const query = Gql.getDepositAdressesByUserId()
    const body: GqlBody = { operationName: "GetDepositAdresses", variables: { userId }, query: query }
    const response: GetDepositAdressesResponse = await this.keystone.queryGraphql(body)
    return response.data.depositAddresses ?? []
  }

  static async getUserBalance(): Promise<Balance[]> {
    const query = Gql.getUserBalance()
    const body: GqlBody = { operationName: "GetUserBalance", query: query }
    const response: GetUserBalanceResponse = await this.keystone.queryGraphql(body)
    return response.data.balance ?? []
  }
}
