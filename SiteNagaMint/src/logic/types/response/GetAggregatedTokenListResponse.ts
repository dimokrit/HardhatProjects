export interface GetAggregatedTokenListResponse {
  data: UserTokenWaitListQty;
}

export interface UserTokenWaitListQty {
  tokenUserWaitListQty: { qty: number };
}
