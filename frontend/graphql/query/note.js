import gql from "graphql-tag"

export const NOTES_QUERY = gql`
  query {
    notes {
      _id
      content
      isImg
      type
      whoBad
      point
      status
      create
      createdAt
      user {
        _id
        email
        name
      }
    }
  }
`
