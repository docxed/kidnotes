<template>
  <div>
    <v-form
      ref="signupForm"
      v-model="validSignupForm"
      @submit.prevent="submitForm()"
      lazy-validation
    >
      <v-text-field
        :value="signupData.email"
        @change="update({ email: $event })"
        :rules="emailRules"
        label="อีเมล"
        class="mb-3"
      ></v-text-field>
      <v-text-field
        :value="signupData.name"
        @change="update({ name: $event })"
        :rules="nameRules"
        label="ชื่อ"
        class="mb-3"
      ></v-text-field>
      <v-text-field
        :value="signupData.password"
        @change="update({ password: $event })"
        :rules="passwordRules"
        type="password"
        label="รหัสผ่าน"
        class="mb-3"
      ></v-text-field>
      <v-text-field
        :value="signupData.confirmPassword"
        @change="update({ confirmPassword: $event })"
        :rules="confirmPasswordRules"
        :error-messages="formConfirmPassword"
        type="password"
        label="ยืนยันรหัสผ่าน"
        class="mb-3"
      ></v-text-field>
      <div class="text-center">
        <v-btn type="submit" :disabled="!validSignupForm" :loading="signupLoading" color="primary"
          >ลงทะเบียน</v-btn
        >
      </div>
    </v-form>
  </div>
</template>
<script>
export default {
  props: {
    signupData: {
      type: Object,
      required: true,
    },
    signupLoading: {
      type: Boolean,
      required: true,
    },
  },

  data: () => ({
    validSignupForm: false,
    password: "",
    emailRules: [
      (v) => !!v || "กรุณากรอกอีเมล",
      (v) => /^\S+@\S+\.\S+$/.test(v) || "กรุณากรอกอีเมลให้ถูกต้อง",
    ],
    nameRules: [(v) => !!v || "กรุณากรอกชื่อ"],
    passwordRules: [
      (v) => !!v || "กรุณากรอกรหัสผ่าน",
      (v) => v.length >= 6 || "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร",
    ],
    confirmPasswordRules: [(v) => !!v || "กรุณากรอกยืนยันรหัสผ่าน"],
    formConfirmPassword: "",
  }),
  methods: {
    update(event) {
      const { password, confirmPassword } = event
      if (password || confirmPassword) {
        this.$nextTick(() => {
          this.formConfirmPassword = ""
        })
      }
      this.$emit("update:signupData", { ...this.signupData, ...event })
    },
    submitForm() {
      if (this.$refs.signupForm.validate()) {
        if (this.signupData.password !== this.signupData.confirmPassword) {
          this.formConfirmPassword = "รหัสผ่านไม่ตรงกัน"
          return
        } else {
          this.$emit("onSubmitSignup", this.signupData)
        }
      }
    },
  },
}
</script>
