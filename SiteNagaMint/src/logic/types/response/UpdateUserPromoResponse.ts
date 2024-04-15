export interface UpdateUserPromoResponse {
  data: Data;
}

export interface Data {
  setPromo: SetPromo;
}

export interface SetPromo {
  isSuccess: boolean;
  error: string;
}

