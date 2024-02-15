import { GqlBody } from "../logic/types/request/RequestTypes";
import { BuyWhiteList, ByWhiteListItemResponse } from "../logic/types/response/ByWhiteListItemResponse";
import { GetAggregatedWhiteListResponse, UserWaitListQty } from "../logic/types/response/GetAggregatedWhiteListResponse";
import { GetNFTItemsResponse, UserWaitList } from "../logic/types/response/GetNFTItemsResponse";
import { GetWhiteListResponse, WhiteListItem } from "../logic/types/response/GetWhiteListResponse";
import { ApiKeystone } from "./api_keystone";
import { Gql } from "./api_queries";

export class WhiteListRepository {
  static keystone = ApiKeystone;

  static async buyWhiteListItem({ waitListId, qty }: { waitListId: string, qty: number }): Promise<BuyWhiteList> {
    const query = Gql.buyWhiteListItem()
    const body: GqlBody = { operationName: "BuyWhiteListItem", query: query, variables: { waitListId, qty } }
    const response: ByWhiteListItemResponse = await this.keystone.queryGraphql(body)
    return response.data.buyWaitList
  }

  static async getWhiteListItems(): Promise<WhiteListItem[]> {
    const query = Gql.getWhiteListItems()
    const body: GqlBody = { operationName: "GetWhiteListItems", query: query }
    const response: GetWhiteListResponse = await this.keystone.queryGraphql(body)
    return response.data.waitLists ?? []
  }

  static async getNFTItems(): Promise<UserWaitList[]> {
    const query = Gql.getNFTItems()
    const body: GqlBody = { operationName: "GetNFTItems", query: query }
    const response: GetNFTItemsResponse = await this.keystone.queryGraphql(body)
    return response.data.userWaitLists ?? []
  }
  
  static async getAggregatedWhiteList(): Promise<UserWaitListQty> {
    const query = Gql.getAggregatedWhiteList()
    const body: GqlBody = { operationName: "GetAggregatedWhiteList", query: query }
    const response: GetAggregatedWhiteListResponse = await this.keystone.queryGraphql(body)
    return response.data
  }
}
