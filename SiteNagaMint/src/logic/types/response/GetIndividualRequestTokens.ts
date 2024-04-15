export interface GetIndividualRequestTokensResponse {
  data: Data;
}

export interface Data {
  individualRequestTokens: IndividualRequestToken[];
}

export interface IndividualRequestToken {
  id: string;
  status: string;
  cancelReason: string;
  expiredAt:string;
  planInvestUsdCount:number;
}
