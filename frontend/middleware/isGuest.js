export default function ({ app, error, redirect, store, route, req }) {
  const hasToken = !!app.$apolloHelpers.getToken()
  if (hasToken) {
    return redirect("/")
  }
}
