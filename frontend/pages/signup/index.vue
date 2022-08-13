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
            <v-card-title>ลงทะเบียนเข้าใช้งาน</v-card-title>
            <v-card-text
              ><signup-form
                :signupData.sync="signupData"
                :signupLoading="signupLoading"
                @onSubmitSignup="onSubmitSignup($event)"
            /></v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapActions } from "vuex"
import { SIGNUP_MUTATION } from "~/graphql/mutation"
export default {
  middleware: ["isGuest"],
  head() {
    return {
      title: "ลงทะเบียนเข้าใช้งาน",
      meta: [
        {
          hid: "😇 บันทึกแต้มบุญ - ลงทะเบียนเข้าใช้งาน",
          name: "😇 บันทึกแต้มบุญ - ลงทะเบียนเข้าใช้งาน",
          content: "😇 บันทึกแต้มบุญ | ลงทะเบียนเข้าใช้งาน",
        },
      ],
    }
  },
  data: () => ({
    signupData: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
    signupLoading: false,
    i: 0,
  }),
  methods: {
    ...mapActions("messages", ["setMessage"]),

    onSubmitSignup(event) {
      this.signupLoading = true
      const { email, name, password } = event
      this.$apollo
        .mutate({
          mutation: SIGNUP_MUTATION,
          variables: {
            email: email,
            name: name,
            password: password,
          },
        })
        .then(({ data }) => {
          this.signupLoading = false
          this.$router.push("/signin")
        })
        .catch((error) => {
          this.signupLoading = false
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
