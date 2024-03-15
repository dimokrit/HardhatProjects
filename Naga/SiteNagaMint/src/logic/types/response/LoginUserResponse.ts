import { User } from "../types";

export interface LoginUserResponse {
  data: Data;
}

interface Data {
  authenticateUserWithPassword: AuthenticateUserWithPassword;
}

interface AuthenticateUserWithPassword {
  sessionToken: string;
  item: User;
}

