import { BuyTokenDto, DtoIndividualRequestToken, DtoNonIndividualRequestTokens, GqlBody } from "../logic/types/request/RequestTypes";
import { BuyTokenList, ByTokenListItemResponse } from "../logic/types/response/ByTokenListItemResponse";
import { CreateIndividualRequestTokenResponse } from "../logic/types/response/CreateIndividualRequestTokenResponse";
import { CreateNonIndividualRequestTokenResponse } from "../logic/types/response/CreateNonIndividualRequestTokenResponse";
import { GetAggregatedTokenListResponse, UserTokenWaitListQty } from "../logic/types/response/GetAggregatedTokenListResponse";
import { GetIndividualRequestTokensResponse, IndividualRequestToken } from "../logic/types/response/GetIndividualRequestTokens";
import { GetNonIndividualRequestTokensResponse, NonIndividualRequestToken } from "../logic/types/response/GetNonIndividualRequestTokens";
import { GetTokenListResponse, TokenListItem } from "../logic/types/response/GetTokenListResponse";

import { ApiKeystone } from "./api_keystone";
import { Gql } from "./api_queries";

export class RequestTokenRepository {
  private static keystone = ApiKeystone;

  // get
  static async getIndividualRequestToken({ userId, expiredAt }: { userId: string, expiredAt: string }): Promise<IndividualRequestToken | undefined> {
    const query = Gql.getIndividualRequestTokens()
    const body: GqlBody = { operationName: "GetIndividualRequestTokens", variables: { userId, expiredAt }, query: query, }
    const res: GetIndividualRequestTokensResponse = await this.keystone.queryGraphql(body)
    return res.data.individualRequestTokens[0] || undefined
  }

  static async getNonIndividualRequestToken({ userId, expiredAt }: { userId: string, expiredAt: string }): Promise<NonIndividualRequestToken | undefined> {
    const query = Gql.getNonIndividualRequestTokens()
    const body: GqlBody = { operationName: "GetNonIndividualRequestTokens", variables: { userId, expiredAt }, query: query, }
    const res: GetNonIndividualRequestTokensResponse = await this.keystone.queryGraphql(body)
    return res.data.nonIndividualRequestTokens[0] || undefined
  }

  static async createIndividualRequestToken(data: DtoIndividualRequestToken): Promise<string | undefined> {
    const query = Gql.createIndividualRequestToken()
    const formdata = new FormData()

    const body: GqlBody = { operationName: 'CreateIndividualRequestToken', query: query, variables: { data } }

    const map = { '1': ['variables.data.proofOfResidence.upload'] }

    formdata.append('operations', JSON.stringify(body))
    formdata.append('map', JSON.stringify(map))
    formdata.append('1', data.proofOfResidence!)

    const res: CreateIndividualRequestTokenResponse = await this.keystone.queryGraphql(formdata)
    return res.data.createIndividualRequestToken?.id || undefined
  }

  static async createNonIndividualRequestToken(data: DtoNonIndividualRequestTokens): Promise<string | undefined> {
    const query = Gql.createNonIndividualRequestToken()
    const body: GqlBody = { operationName: "CreateNonIndividualRequestToken", variables: { data }, query: query, }
    const res: CreateNonIndividualRequestTokenResponse = await this.keystone.queryGraphql(body)
    return res.data.createNonIndividualRequestToken?.id || undefined
  }

  static async getTokenListItems(): Promise<TokenListItem[]> {
    const query = Gql.getTokenListItems()
    const body: GqlBody = { operationName: "GetTokenListItems", query: query }
    const response: GetTokenListResponse = await this.keystone.queryGraphql(body)
    return response.data.tokenWaitLists ?? []
  }

  static async getAggregatedTokenWaitList(): Promise<UserTokenWaitListQty> {
    const query = Gql.getAggregatedTokenList()
    const body: GqlBody = { operationName: "GetAggregatedTokenList", query: query }
    const response: GetAggregatedTokenListResponse = await this.keystone.queryGraphql(body)
    return response.data
  }

  static async buyTokenListItem({ tokenWaitListId, qty, tokenRequestId }: BuyTokenDto): Promise<BuyTokenList> {
    const query = Gql.buyTokenListItem()
    const body: GqlBody = { operationName: "BuyTokenListItem", query: query, variables: { tokenWaitListId, qty, tokenRequestId } }
    const response: ByTokenListItemResponse = await this.keystone.queryGraphql(body)
    return response.data.buyTokenWaitList
  }

  static async updateIndividualRequestToken(status: string, id: string): Promise<any> {
    const query = Gql.updateIndividualRequestToken()
    const body: GqlBody = { operationName: "UpdateIndividualRequestToken", query: query, variables: {data:{status}, id } }
    const response: ByTokenListItemResponse = await this.keystone.queryGraphql(body)
    return response.data;
  }
}