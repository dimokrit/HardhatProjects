import { GqlBody, LoginData } from "../logic/types/request/RequestTypes";

import { CreateUserResponse } from "../logic/types/response/CreateUserResponse";
import { GetAuthenticatedUserResponse } from "../logic/types/response/GetAuthenticatedUserResponse";
import { LoginUserResponse } from "../logic/types/response/LoginUserResponse";
import { LogoutUserResponse } from "../logic/types/response/LogoutUserResponse";
import { SendURLTokenResponse } from "../logic/types/response/SendUrlTokenResponse";
import { UpdateUserPromoResponse } from "../logic/types/response/UpdateUserPromoResponse";

import { User } from "../logic/types/types";

import { ApiKeystone } from "./api_keystone";
import { Gql } from "./api_queries";

export class UserRepository {
  private static keystone = ApiKeystone;

  // create
  static async createUser(email: string): Promise<String | null> {
    const query = Gql.createUser()
    const body: GqlBody = { operationName: "CreateUser", variables: { data: { email, name: email } }, query: query, }
    const res: CreateUserResponse = await this.keystone.queryGraphql(body)
    return res.data.createUser.id
  }

  // login
  static async loginUser({ email, password }: LoginData): Promise<User | null> {
    const query = Gql.loginUser()
    const body: GqlBody = { operationName: "LoginUser", variables: { email, password }, query: query, }
    const res: LoginUserResponse = await this.keystone.queryGraphql(body)
    return res.data.authenticateUserWithPassword.item
  }

  // logout
  static async logoutUser(): Promise<boolean> {
    const query = Gql.logoutUser()
    const body: GqlBody = { operationName: "LogoutUser", variables: {}, query: query, }
    const res: LogoutUserResponse = await this.keystone.queryGraphql(body)
    return res.data.endSession
  }

  // get authenticated user
  static async getAuthenticatedUser(): Promise<User | null> {
    const query = Gql.getAuthenticatedUser()
    const body: GqlBody = { operationName: "GetAuthenticatedUser", variables: {}, query: query, }
    const res: GetAuthenticatedUserResponse = await this.keystone.queryGraphql(body)
    return res.data.authenticatedItem
  }

  // get update user promo
  static async updateUserPromo({ promo }: { promo: string }): Promise<boolean> {
    const query = Gql.updateUserPromo()
    const body: GqlBody = { operationName: "UpdateUserPromo", query: query, variables: { promocode: promo } }
    const res: UpdateUserPromoResponse = await this.keystone.queryGraphql(body)
    return res.data.setPromo.isSuccess || false
  }

  static async resetPassword({ email }: { email: string }): Promise<boolean | string> {
    const queryString = `auth/reset-password/send-url-token/${email}`;
    const res: SendURLTokenResponse = await this.keystone.queryExpress({ queryString });
    return res.error ? res.error : res.sendUrlToken;
  }
}