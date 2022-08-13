<template>
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
</template>
<script>
export default {
  data: () => ({
    signupData: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
    signupLoading: false,
  }),
  methods: {
    onSubmitSignup(event) {
      this.signupLoading = true
      console.log(event)
    },
  },
}
</script>
