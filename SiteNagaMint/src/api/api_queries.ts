export class Gql {
  static createUser = (): string => {
    return `
      mutation CreateUser($data: UserCreateInput!) {
        createUser(data: $data){
            id
        }
      }
    `
  }

  static loginUser = (): string => {
    return `
      mutation LoginUser($email: String!, $password: String!) {
        authenticateUserWithPassword (email: $email, password: $password) {
          ... on UserAuthenticationWithPasswordSuccess {
            sessionToken
            item {
              id
              name
              email
              referrerCode
              inviterCode
            }
          }
          ... on UserAuthenticationWithPasswordFailure {
            message
          }
        }
      }
    `
  }

  static logoutUser = (): string => {
    return `
      mutation LogoutUser{
        endSession
      }
    `
  }

  static getAuthenticatedUser = (): string => {
    return `
      query GetAuthenticatedUser {
        authenticatedItem {
          ... on User {
            id
            name
            email
            referrerCode
            inviterCode
          }
        }
      }
    `
  }

  static getTransactionsByUserId = (): string => {
    return `
      query GetTransactions($userId: ID) {
        transactions(where: { owner: { id: { equals: $userId } } }, orderBy: { createdAt: desc }) {
          owner {
            id
            name
            email
          }
          operation
          transactionId
          currency {
            id
            name
          }
          amount
          txHash
          status
          createdAt
        }
      }
    `
  }

  static getDepositAdressesByUserId = (): string => {
    return `
      query GetDepositAdresses($userId: ID){
        depositAddresses(where: { user: { id: { equals: $userId } } }) {
          address
          currency {
            id
            name
          }
          info
        }
      }
    `
  }

  static buyWhiteListItem = (): string => {
    return `
      mutation BuyWhiteListItem($waitListId: ID!, $qty: Int!) {
        buyWaitList(waitListId: $waitListId, qty: $qty) {
          isSuccess
          referrerCode
          error
        }
      }
    `
  }

  static getWhiteListItems = (): string => {
    return `
      query GetWhiteListItems {
        waitLists {
          id
          currency {
            id
            name
          }
          name
          price
          priceUsd
          qty
          createdAt
          deletedAt
        }
      }
    `
  }

  static getTokenListItems = (): string => {
    return `
      query GetTokenListItems {
        tokenWaitLists {
          id
          currency {
            id
            name
          }
          name
          price
          priceUsd
          qty
          createdAt
          deletedAt
        }
      }
    `
  }

  static getUserBalance = (): string => {
    return `
      query GetUserBalance {
        balance {
          balance
          currency
        }
      }
    `
  }

  static updateUserPromo = (): string => {
    return `
      mutation UpdateUserPromo($promocode:String!) {
        setPromo(promocode:$promocode) {
          isSuccess
          error
        }
      }
    `
  }

  static updateIndividualRequestToken = (): string => {
    return `
    mutation UpdateIndividualRequestToken($data: IndividualRequestTokenUpdateInput!, $id: ID!) {
        updateIndividualRequestToken(where: {id: $id}, data: $data) {
          id
          user {
            id
          }
          status
      }
    }
    
    `
  }

  static getNFTItems = (): string => {
    return `
      query GetNFTItems {
        userWaitLists {
          id
          qty
          price
          cost
          currency {
            name
          }
          owner {
            id
            name
            email
            referrerCode
            inviterCode
          }
        }
      }
    `
  }

  static getAggregatedWhiteList = (): string => {
    return `
      query GetAggregatedWhiteList {
        userWaitListQty {
          qty
          sphereQty
        }
      }
    `
  }

  static getAggregatedTokenList = (): string => {
    return `
      query GetAggregatedTokenList {
        tokenUserWaitListQty {
          qty
        }
      }
    `
  }

  static getPages = (): string => {
    return `
      query GetPages{
        pages (where:{status: {equals: "published"}}){
          id
          title
          titleRu
          category
          categoryRu
          publishedAt
          status
          content{
            document
          }
          contentRu{
            document
          }
        }
      }
    `
  }

  static getIndividualRequestTokens = (): string => {
    return `
      query GetIndividualRequestTokens($userId: ID, $expiredAt: DateTime) {
        individualRequestTokens(where:  {
          AND: [
            { user: { id: { equals: $userId } }, },
            { NOT: { status: { equals: cancelled } } },
            { expiredAt: { gt: $expiredAt } }
          ]
        }) {
          id
          status
          cancelReason
          expiredAt
          planInvestUsdCount
        }
      }
    `
  }

  static getNonIndividualRequestTokens = (): string => {
    return `
      query GetNonIndividualRequestTokens($userId: ID, $expiredAt: DateTime) {
        nonIndividualRequestTokens(where: {
          AND: [
            { user: { id: { equals: $userId } }, },
            { NOT: { status: { equals: cancelled } } },
            { expiredAt: { gt: $expiredAt } }
          ]
        }) {
          id
          status
          cancelReason
          expiredAt
          planInvestUsdCount
        }
      }
    `
  }

  static createNonIndividualRequestToken = (): string => {
    return `
      mutation CreateNonIndividualRequestToken($data: NonIndividualRequestTokenCreateInput!) {
        createNonIndividualRequestToken(data: $data) {
          id
        }
      }
    `
  }

  static createIndividualRequestToken = (): string => {
    return `
      mutation CreateIndividualRequestToken($data: IndividualRequestTokenCreateInput!) {
        createIndividualRequestToken(data: $data) {
          id
        }
      }
    `
  }

  static buyTokenListItem = (): string => {
    return `
      mutation BuyTokenListItem($tokenWaitListId: ID!, $qty: Int!, $tokenRequestId: String!) {
        buyTokenWaitList(tokenWaitListId: $tokenWaitListId, qty: $qty, tokenRequestId: $tokenRequestId) {
          isSuccess
          error
        }
      }
    `
  }

}