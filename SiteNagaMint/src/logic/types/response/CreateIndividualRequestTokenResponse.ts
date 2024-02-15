export interface CreateIndividualRequestTokenResponse {
  data: Data;
}

export interface Data {
  createIndividualRequestToken: CreateIndividualRequestToken;
}

export interface CreateIndividualRequestToken {
  id: string;
}
