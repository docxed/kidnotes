import gql from "graphql-tag"

export const CREATE_NOTE_MUTATION = gql`
  mutation ($record: CreateOneNoteInput!) {
    createNote(record: $record) {
      recordId
    }
  }
`

export const UPDATE_NOTE_MUTATION = gql`
  mutation ($id: MongoID!, $record: UpdateByIdNoteInput!) {
    updateNote(_id: $id, record: $record) {
      recordId
    }
  }
`

export const DELETE_NOTE_MUTATION = gql`
  mutation ($id: MongoID!) {
    deleteNote(_id: $id) {
      recordId
    }
  }
`

export const NOTIFY_MUTATION = gql`
  mutation ($message: String!, $stickerPackageId: String, $stickerId: String) {
    notify(message: $message, stickerPackageId: $stickerPackageId, stickerId: $stickerId) {
      status
    }
  }
`
