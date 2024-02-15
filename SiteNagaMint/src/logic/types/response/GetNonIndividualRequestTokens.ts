export interface GetNonIndividualRequestTokensResponse {
  data: Data;
}

export interface Data {
  nonIndividualRequestTokens: NonIndividualRequestToken[];
}

export interface NonIndividualRequestToken {
  id: string;
  status: string;
  cancelReason: string;
  expiredAt: string;
  planInvestUsdCount: number;
}
