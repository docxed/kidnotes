<template>
  <div>
    <v-form
      ref="profileForm"
      v-model="validProfileForm"
      @submit.prevent="submitForm()"
      lazy-validation
    >
      <v-text-field
        :value="profileData.email"
        :rules="[$rules.required]"
        label="อีเมล"
        class="mb-3"
        :disabled="disabledField.includes('email')"
      >
      </v-text-field>
      <v-text-field
        :value="profileData.name"
        @change="update({ name: $event })"
        :rules="[$rules.required]"
        label="ชื่อ"
        class="mb-3"
      >
      </v-text-field>
      <div class="text-center">
        <v-btn type="submit" dark :loading="profileFormLoading"
          ><v-icon left> mdi-pencil </v-icon>แก้ไข</v-btn
        >
      </div>
    </v-form>
  </div>
</template>
<script>
export default {
  props: {
    profileData: {
      type: Object,
      required: true,
    },
    profileFormLoading: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    disabledField: ["email"],
    validProfileForm: false,
  }),
  methods: {
    update(event) {
      this.$emit("update:profileData", { ...this.profileData, ...event })
    },
    submitForm() {
      if (this.$refs.profileForm.validate()) {
        this.$emit("onSubmitProfile", this.profileData)
      }
    },
  },
}
</script>
