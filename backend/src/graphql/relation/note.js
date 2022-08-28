import { UserTC } from "../../models/user"
import { NoteTC } from "../../models/note"

NoteTC.addRelation("user", {
  resolver: () => UserTC.getResolver("findById"),
  projection: { create: { by: true } },
  prepareArgs: {
    _id: (note) => note.create.by,
  },
})
