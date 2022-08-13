<template>
  <v-container fluid fill-height>
    <v-row no-gutters justify="center" align="center">
      <v-col cols="12" md="7">
        <v-card>
          <v-card-title> ข้อมูลส่วนตัว</v-card-title>
          <v-card-text>
            <profile-form
              :profileData.sync="profileData"
              :profileFormLoading="profileFormLoading"
              @onSubmitProfile="onSubmitProfile($event)"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { USER_QUERY } from "~/graphql/query"
import { UPDATE_ME_MUTATION } from "~/graphql/mutation"
import { mapGetters, mapActions } from "vuex"
export default {
  middleware: ["isAuth"],
  head() {
    return {
      title: "ข้อมูลส่วนตัว",
      meta: [
        {
          hid: "😇 บันทึกแต้มบุญ - ข้อมูลส่วนตัว",
          name: "😇 บันทึกแต้มบุญ - ข้อมูลส่วนตัว",
          content: "😇 บันทึกแต้มบุญ | ข้อมูลส่วนตัว",
        },
      ],
    }
  },
  mounted() {
    if (this.me) this.getProfileData()
  },
  data: () => ({
    profileData: {
      _id: "",
      email: "",
      name: "",
    },
    profileFormLoading: false,
  }),
  methods: {
    ...mapActions("messages", ["setMessage"]),

    getProfileData() {
      this.$loader(true)
      this.$apollo
        .query({
          query: USER_QUERY,
          variables: {
            id: this.me.userId,
          },
        })
        .then((response) => {
          for (let key in this.profileData) {
            this.profileData[key] = response.data.user[key]
          }
          this.$loader(false)
        })
        .catch((error) => {
          console.error(error)
          this.$loader(false)
        })
    },
    onSubmitProfile(event) {
      this.profileFormLoading = true
      console.log(event)
      const { _id, name } = event
      this.$apollo
        .mutate({
          mutation: UPDATE_ME_MUTATION,
          variables: {
            id: _id,
            record: {
              name: name,
            },
          },
        })
        .then(async (response) => {
          this.profileFormLoading = false
          this.setMessage({
            title: "บันทึกข้อมูลสำเร็จ",
            type: "ดำเนินการ",
            color: "green",
          })
          this.setMessage({
            title: "ออกจากระบบ",
            type: "ดำเนินการ",
            color: "green",
          })
          await this.$apolloHelpers.onLogout()
          this.$router.push("/signin")
        })
        .catch((error) => {
          this.profileFormLoading = false
          console.error(error)
          this.setMessage({
            title: error.message.split(":")[1],
            type: "ผิดพลาด",
            color: "error",
          })
        })
    },
  },
  computed: {
    ...mapGetters({
      isAuthenticated: "isAuthenticated",
      me: "me",
    }),
  },
  watch: {
    me(newVal, oldVal) {
      if (newVal !== oldVal) this.getProfileData()
    },
  },
}
</script>
