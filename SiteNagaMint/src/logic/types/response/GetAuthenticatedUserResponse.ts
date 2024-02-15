import { User } from "../types";

export interface GetAuthenticatedUserResponse {
    data: Data;
}

interface Data {
    authenticatedItem: User;
}

