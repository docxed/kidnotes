import { composeWithMongoose } from "graphql-compose-mongoose"
import { model, Schema } from "mongoose"

const NoteSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    isImg: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    whoBad: {
      type: String,
      default: "",
    },
    point: {
      type: Number,
      default: 0,
    },
    status: {
      type: Boolean,
      default: "false",
    },
    create: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export const NoteModel = model("Note", NoteSchema)
export const NoteTC = composeWithMongoose(NoteModel)
