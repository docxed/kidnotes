<template>
  <v-container fluid fill-height>
    <v-row no-gutters justify="center" align="center">
      <v-col cols="12" sm="5">
        <div class="my-auto mx-3 text-center">
          <h1>😇 บันทึกแต้มบุญ</h1>
        </div>
      </v-col>
      <v-col cols="12" sm="7">
        <div :class="{ 'mr-10': !$vuetify.breakpoint.xs }">
          <v-card class="my-10">
            <v-card-title>ลงชื่อเข้าใช้งาน</v-card-title>
            <v-card-text
              ><signin-form
                :signinData.sync="signinData"
                :signinLoading="signinLoading"
                @onSubmitSignin="onSubmitSignin($event)"
            /></v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapActions } from "vuex"
import { SIGNIN_MUTATION } from "~/graphql/mutation"
export default {
  middleware: ["isGuest"],
  head() {
    return {
      title: "ลงชื่อเข้าใช้งาน",
      meta: [
        {
          hid: "😇 บันทึกแต้มบุญ - ลงชื่อเข้าใช้งาน",
          name: "😇 บันทึกแต้มบุญ - ลงชื่อเข้าใช้งาน",
          content: "😇 บันทึกแต้มบุญ | ลงชื่อเข้าใช้งาน",
        },
      ],
    }
  },
  data: () => ({
    signinData: {
      email: "",
      password: "",
    },
    signinLoading: false,
  }),
  methods: {
    ...mapActions("messages", ["setMessage"]),

    onSubmitSignin(event) {
      this.signinLoading = true
      const { email, password } = event
      this.$apollo
        .mutate({
          mutation: SIGNIN_MUTATION,
          variables: {
            email: email,
            password: password,
          },
        })
        .then(async ({ data }) => {
          await this.$apolloHelpers.onLogin(data.signin.accessToken)
          this.$router.push("/")
        })
        .catch((error) => {
          this.signinLoading = false
          console.error(error)
          this.setMessage({
            title: error.message.split(":")[1],
            type: "ผิดพลาด",
            color: "error",
          })
        })
    },
  },
}
</script>
