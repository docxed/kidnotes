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
</template>
<script>
export default {
  data: () => ({
    signinData: {
      email: "",
      password: "",
    },
    signinLoading: false,
  }),
  methods: {
    onSubmitSignin(event) {
      this.signinLoading = true
      console.log(event)
    },
  },
}
</script>
