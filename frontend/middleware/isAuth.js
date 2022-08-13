export default function ({ app, error, redirect, store, route, req }) {
  const hasToken = !!app.$apolloHelpers.getToken()
  if (!hasToken) {
    console.error({ statusCode: 401, message: "Unauthorized" })
    return redirect("/signin")
  }
}
