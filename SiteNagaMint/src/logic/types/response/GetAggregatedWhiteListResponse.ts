export interface GetAggregatedWhiteListResponse {
  data: UserWaitListQty;
}

export interface UserWaitListQty {
  userWaitListQty: { qty: number, sphereQty: number };
}
