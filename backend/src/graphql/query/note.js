import { NoteModel, NoteTC } from "../../models/note"

export const notes = NoteTC.getResolver("findMany")
export const note = NoteTC.getResolver("findOne")
