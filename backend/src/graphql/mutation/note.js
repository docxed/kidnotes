import { schemaComposer } from "graphql-compose"
import { NoteModel, NoteTC } from "../../models/note"
import axios from "axios"

export const createNote = NoteTC.getResolver("createOne")
export const updateNote = NoteTC.getResolver("updateById")
export const deleteNote = NoteTC.getResolver("removeById")

const NotifyPayloadOTC = schemaComposer.createObjectTC({
  name: "NotifyPayload",
  fields: {
    status: "String",
  },
})

export const notify = NoteTC.schemaComposer.createResolver({
  name: "notifyCreateNote",
  kind: "mutation",
  type: NotifyPayloadOTC,
  args: {
    message: "String!",
    stickerPackageId: "String",
    stickerId: "String",
  },
  resolve: async ({ args, context }) => {
    const { message, stickerPackageId, stickerId } = args
    axios({
      method: "post",
      url: `https://${process.env.LINE_NOTIFY_HOST}/api/notify`,
      headers: {
        Authorization: `Bearer ${process.env.LINE_NOTIFY_TOKEN}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Access-Control-Allow-Origin": "*",
      },
      data: `message=${message}&stickerPackageId=${stickerPackageId}&stickerId=${stickerId}`,
    })
      .then((response) => {
        return {
          status: "ok",
        }
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
})
