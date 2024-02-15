export interface CreateNonIndividualRequestTokenResponse {
  data: Data;
}

export interface Data {
  createNonIndividualRequestToken: CreateNonIndividualRequestToken;
}

export interface CreateNonIndividualRequestToken {
  id: string;
}
