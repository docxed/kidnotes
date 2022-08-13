import { InMemoryCache } from "apollo-cache-inmemory"
import { HttpLink } from "apollo-link-http"

export default (ctx) => {
  const httpLink = new HttpLink({
    uri: process.env.NUXT_ENV_GRAPHQL_ENDPOINT,
    credentials: "include",
  })
  const link = httpLink
  const cache = new InMemoryCache()

  return {
    link,
    cache,
    defaultHttpLink: false,
  }
}
