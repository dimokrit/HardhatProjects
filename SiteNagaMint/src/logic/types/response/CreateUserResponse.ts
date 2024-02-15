export interface CreateUserResponse {
  data: Data;
}

interface Data {
  createUser: CreateUser;
}

interface CreateUser {
  id: string;
}
