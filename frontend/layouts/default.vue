<template>
  <v-app dark>
    <v-overlay :value="overlay">
      <v-card elevation="24" loading outlined light>
        <v-card-text> กำลังเชื่อมต่อ... </v-card-text>
      </v-card>
    </v-overlay>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
      <v-list>
        <div v-for="(item, i) in items" :key="i">
          <v-list-item
            v-if="item.isAuthenticated === 'skip' || item.isAuthenticated === isAuthenticated"
            :to="item.to"
            router
            exact
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <!-- Me -->
      <div v-if="isAuthenticated" class="mr-3">
        <v-menu offset-y rounded="rounded">
          <template v-slot:activator="{ on, attrs }">
            <v-chip class="ma-2" pill v-bind="attrs" v-on="on">
              {{ `😝 ${me.name}` }} <v-icon>mdi-menu-down</v-icon>
            </v-chip>
          </template>
          <v-list>
            <v-list-item @click="$router.push('/profile')">
              <v-list-item-title>ข้อมูลส่วนตัว</v-list-item-title>
            </v-list-item>
            <v-list-item @click="onLogout()">
              <v-list-item-title>ออกจากระบบ</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <!-- Theme -->
      <div>
        <v-tooltip v-if="!$vuetify.theme.dark" bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" color="info" small fab @click="changeTheme()">
              <v-icon class="mr-1">mdi-moon-waxing-crescent</v-icon>
            </v-btn>
          </template>
          <span>โหมดมืด เปิด</span>
        </v-tooltip>
        <v-tooltip v-else bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" color="info" small fab @click="changeTheme()">
              <v-icon color="yellow">mdi-white-balance-sunny</v-icon>
            </v-btn>
          </template>
          <span>โหมดมืด ปิด</span>
        </v-tooltip>
      </div>
    </v-app-bar>
    <v-main>
      <Nuxt />
      <message-snackbar
        v-for="(data, index) in getMessage"
        :key="`message-${data.title}`"
        :data="data"
        :index="index"
      />
      <layouts-loader />
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() + "  Akira S." }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import axios from "axios"
export default {
  name: "DefaultLayout",
  mounted() {
    this.onMeChange()
    const dark = localStorage.getItem("dark")
    if (dark) {
      this.$vuetify.theme.dark = JSON.parse(dark)
    }
    this.helloServer()
  },
  data: () => ({
    clipped: false,
    drawer: false,
    fixed: false,
    items: [
      {
        icon: "mdi-home",
        title: "หน้าแรก",
        to: "/",
        isAuthenticated: true,
      },
      {
        icon: "mdi-pencil-box",
        title: "บันทึกความดี/ความชั่ว",
        to: "/note",
        isAuthenticated: true,
      },
      {
        icon: "",
        title: "ลงชื่อเข้าใช้งาน",
        to: "/signin",
        isAuthenticated: false,
      },
      {
        icon: "",
        title: "ลงทะเบียนเข้าใช้งาน",
        to: "/signup",
        isAuthenticated: false,
      },
    ],
    miniVariant: false,
    right: true,
    rightDrawer: false,
    title: "😇 บันทึกแต้มบุญ",
    overlay: false,
  }),
  methods: {
    ...mapActions("messages", ["setMessage"]),

    helloServer() {
      this.overlay = true
      axios
        .get(`${process.env.NUXT_ENV_BASEURL}/`)
        .then((res) => {
          this.overlay = false
          this.setMessage({
            title: "เชื่อมต่อเซิร์ฟเวอร์สำเร็จ",
            type: "ดำเนินการ",
            color: "green",
          })
        })
        .catch((err) => {
          console.log(err)
          this.overlay = false
          this.setMessage({
            title: "เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ",
            type: "ดำเนินการ",
            color: "red",
          })
        })
    },
    changeTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      localStorage.setItem("dark", this.$vuetify.theme.dark)
    },
    onMeChange() {
      this.$store.dispatch("getMe")
    },
    async onLogout() {
      await this.$apolloHelpers.onLogout()
      this.$router.push("/signin")
    },
  },
  computed: {
    ...mapGetters("messages", ["getMessage"]),
    ...mapGetters({
      isAuthenticated: "isAuthenticated",
      me: "me",
    }),
  },
  watch: {
    $route(to, from) {
      this.onMeChange()
    },
  },
}
</script>
