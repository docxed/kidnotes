<template>
  <div>
    <v-form
      ref="signinForm"
      v-model="validsigninForm"
      @submit.prevent="submitForm()"
      lazy-validation
    >
      <v-text-field
        :value="signinData.email"
        @change="update({ email: $event })"
        :rules="emailRules"
        label="อีเมล"
        class="mb-3"
      ></v-text-field>
      <v-text-field
        :value="signinData.password"
        @change="update({ password: $event })"
        :rules="passwordRules"
        type="password"
        label="รหัสผ่าน"
        class="mb-3"
      ></v-text-field>
      <div class="text-center">
        <v-btn type="submit" :disabled="!validsigninForm" :loading="signinLoading" class="mr-2"
          >ลงชื่อเข้าใช้</v-btn
        >
        <v-btn type="button" color="primary" :to="'/signup'">ลงทะเบียน</v-btn>
      </div>
    </v-form>
  </div>
</template>
<script>
export default {
  props: {
    signinData: {
      type: Object,
      required: true,
    },
    signinLoading: {
      type: Boolean,
      required: true,
    },
  },

  data: () => ({
    validsigninForm: false,
    password: "",
    emailRules: [
      (v) => !!v || "กรุณากรอกอีเมล",
      (v) => /^\S+@\S+\.\S+$/.test(v) || "กรุณากรอกอีเมลให้ถูกต้อง",
    ],
    passwordRules: [
      (v) => !!v || "กรุณากรอกรหัสผ่าน",
      (v) => v.length >= 6 || "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร",
    ],
  }),
  methods: {
    update(event) {
      this.$emit("update:signinData", { ...this.signinData, ...event })
    },
    submitForm() {
      if (this.$refs.signinForm.validate()) {
        this.$emit("onSubmitsignin", this.signinData)
      }
    },
  },
}
</script>
