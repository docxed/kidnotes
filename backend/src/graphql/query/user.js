import { schemaComposer } from "graphql-compose"
import { UserModel, UserTC } from "../../models/user"

export const users = UserTC.getResolver("findMany")
export const user = UserTC.getResolver("findById")
export const me = UserTC.schemaComposer.createResolver({
  name: "me",
  kind: "query",
  type: UserTC,
  resolve: async ({ context }) => {
    const user = await UserModel.findById(context.userId)
    if (!user) {
      throw new Error("User not found")
    }
    return user
  },
})
