import { createServer } from "http"
import jsonwebtoken from "jsonwebtoken"
import cors from "cors"
import express from "express"
import cookieParser from "cookie-parser"
import { ApolloServer } from "apollo-server-express"
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core"

import "./mongoose-connect"
import schema from "./graphql"

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://studentbook-nuxt.herokuapp.com/", "http://localhost"]
      : true,
  credentials: true,
}
app.use(cors(corsOptions))
app.get("/", (req, res) => {
  res.status(200).send("Hello This is Kidnotes API")
})

const startApolloServer = async () => {
  const httpServer = createServer(app)
  const apolloServer = new ApolloServer({
    schema,
    introspection: true,
    plugins:
      process.env.NODE_ENV === "production"
        ? [ApolloServerPluginDrainHttpServer({ httpServer })]
        : [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            ApolloServerPluginLandingPageGraphQLPlayground(),
          ],
    context: ({ req }) => {
      const { cookies, headers } = req
      let token = null
      if (cookies?.cookies) {
        token = cookies.accessToken
      } else if (headers?.authorization?.split(" ")?.[0] === "Bearer") {
        token = headers.authorization.split(" ")[1]
      }
      if (token) {
        const payload = jsonwebtoken.verify(token, process.env.JWT_SECRET)
        return { userId: payload.userId }
      }
      return { userId: null }
    },
  })

  await apolloServer.start()
  apolloServer.applyMiddleware({
    app,
    path: "/graphql",
    cors: corsOptions,
  })
  const PORT = process.env.PORT || 3001
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`)
  })
}
startApolloServer()
module.exports = app
