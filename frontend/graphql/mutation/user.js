import gql from "graphql-tag"

export const UPDATE_ME_MUTATION = gql`
  mutation ($id: MongoID!, $record: UpdateByIdUserInput!) {
    updateMe(_id: $id, record: $record) {
      recordId
    }
  }
`

export const SIGNUP_MUTATION = gql`
  mutation ($email: String!, $name: String!, $password: String!) {
    signup(email: $email, name: $name, password: $password) {
      _id
    }
  }
`

export const SIGNIN_MUTATION = gql`
  mutation ($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      _id
      email
      name
      accessToken
    }
  }
`
