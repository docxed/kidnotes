import gql from "graphql-tag"

export const ME_QUERY = gql`
  query {
    me {
      _id
      email
      name
    }
  }
`

export const USER_QUERY = gql`
  query ($id: MongoID!) {
    user(_id: $id) {
      _id
      email
      name
    }
  }
`
