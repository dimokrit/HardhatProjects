export type LoginData = {
  email: string,
  password: string,
}

export type GqlBody = {
  operationName: string;
  variables?: Object;
  query: string;
}
export type BuyTokenDto = {
  tokenWaitListId: string, 
  qty: number, 
  tokenRequestId: string
}

export interface DtoNonIndividualRequestTokens {
  user: { connect: { id: string } };
  nameOfApplicant: string;
  dateOfIncorporation: string;
  placeOfIncorporation: string;
  dateOfCommencementOfbusiness: string;
  registrationNo: string;
  companyStatus: string;
  addressForCorrespondence: string;
  state: string;
  country: string;
  zipCode: string;
  officeNumber: string;
  mobileNumber: string;
  validEmailAddress: string;
  nameOfRepresentative: string;
  planInvestUsdCount: number;
}

export interface DtoIndividualRequestToken {
  user: { connect: { id: string } };
  surname: string;
  firstname: string;
  middlename: string;
  gender: string;
  civilStatus: string;
  dateOfBirth: string;
  age: string;
  placeOfBirth: string;
  presentAddress: string;
  state: string;
  country: string;
  zipCode: string;
  idNumber: string;
  validEmailAddress: string;
  mobileNumber: string;
  telegramAccount: string;
  planInvestUsdCount: number;
  proofOfResidence: File | null
}