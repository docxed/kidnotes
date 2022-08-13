import { schemaComposer } from "graphql-compose"
import { UserModel, UserTC } from "../../models/user"
import { generateUserToken } from "../../lib/generateUserToken"

export const updateMe = UserTC.getResolver("updateById")

export const signup = UserTC.schemaComposer.createResolver({
  name: "signup",
  kind: "mutation",
  type: UserTC,
  args: {
    email: "String!",
    name: "String!",
    password: "String!",
  },
  resolve: async ({ args, context }) => {
    const { email, name, password } = args
    const user = await UserModel.findOne({ email })
    if (user) {
      throw new Error("อีเมลซ้ำในระบบ")
    }
    const createNewUser = await UserModel.create({
      email,
      name,
      password,
    })
    return createNewUser
  },
})

const SignInPayloadOTC = schemaComposer.createObjectTC({
  name: "SignInPayload",
  fields: {
    _id: "MongoID",
    email: "String",
    name: "String",
    accessToken: "String",
  },
})

export const signin = UserTC.schemaComposer.createResolver({
  name: "signin",
  kind: "mutation",
  type: SignInPayloadOTC,
  args: {
    email: "String!",
    password: "String!",
  },
  resolve: async ({ args, context }) => {
    const { email, password } = args
    const user = await UserModel.findOne({ email })
    if (!user) {
      throw new Error("ไม่พบอีเมลนี้ในระบบ")
    }
    const validPassword = await user.verifyPassword(password)
    if (!validPassword) {
      throw new Error("รหัสผ่านผิด")
    }
    const token = generateUserToken(user)
    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      accessToken: token,
    }
  },
})
