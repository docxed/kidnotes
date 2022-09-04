<template>
  <v-container class="mt-10">
    <v-row class="mb-3">
      <v-col>
        <v-row class="mb-3">
          <v-col>
            <h2>แดชบอร์ด</h2>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row class="mb-2 mx-2">
      <v-select
        color="grey darken-4"
        item-color="grey darken-4"
        :value="selected"
        :items="whoItems"
        @change="update({ who: $event })"
        item-text="title"
        item-value="value"
        label="ผู้เล่น"
        prepend-icon="mdi-account"
        hide-details
        dense
        outlined
        class="mb-5"
      />
    </v-row>

    <v-row class="mb-5 mx-2">
      <v-dialog ref="dialog" v-model="modal" :return-value.sync="date" persistent width="290px">
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            color="grey darken-4"
            v-model="date"
            label="ประจำเดือน"
            prepend-icon="mdi-calendar"
            hint="กรุณาเลือกเดือน"
            readonly
            v-bind="attrs"
            dense
            outlined
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="date" type="month" scrollable>
          <v-spacer></v-spacer>
          <v-btn text color="grey darken-4" @click="modal = false"> ยกเลิก </v-btn>
          <v-btn text color="grey darken-4" @click="$refs.dialog.save(date)"> ตกลง </v-btn>
        </v-date-picker>
      </v-dialog>
    </v-row>

    <v-row class="text-center mb-5">
      <v-col cols="4" class="my-auto">
        <div style="font-size: 1em">แต้มบุญ 😇</div>
        <div style="font-size: 2em">{{ goodPoints }}</div>
      </v-col>
      <v-col cols="4" class="my-auto"
        ><div class="grey--text text--darken-2" :style="`font-size: ${isMobile ? 1.3 : 2}em`">
          แต้มที่ทำได้
        </div>
        <div style="font-size: 3em">{{ allPoints }}</div>
      </v-col>
      <v-col cols="4" class="my-auto">
        <div style="font-size: 1em">แต้มบาป 👿</div>
        <div style="font-size: 2em">{{ badPoints }}</div>
      </v-col>
    </v-row>

    <v-row class="ml-5">
      <v-container class="px-0" fluid>
        <v-switch v-model="isDisplayGood" label="แสดงความดี"></v-switch>
      </v-container>
    </v-row>
    <v-container fluid class="d-flex">
      <v-card width="100vw">
        <!-- Note Table -->
        <dashboard-table :me="me" :noteData="allDisplayNotes" :noteIsLoading="displayIsLoading" />
      </v-card>
    </v-container>
  </v-container>
</template>

<script>
import { NOTES_QUERY } from "~/graphql/query"
import { mapGetters } from "vuex"
export default {
  middleware: ["isAuth"],
  head() {
    return {
      title: "ลงทะเบียนเข้าใช้งาน",
      meta: [
        {
          hid: "😇 บันทึกแต้มบุญ - หน้าแรก",
          name: "😇 บันทึกแต้มบุญ - หน้าแรก",
          content: "😇 บันทึกแต้มบุญ | หน้าแรก",
        },
      ],
    }
  },
  async mounted() {
    this.isMobile = this.$vuetify.breakpoint.xsOnly ? true : false
    this.fetchNotes()
    if (this.me) this.setSelected(this.me)
  },
  created() {},
  data: () => ({
    date: new Date().toISOString().substr(0, 7),
    menu: false,
    modal: false,
    who: "",
    whoEmail: {
      ["ongsaztx1@gmail.com"]: {
        id: "630b018bf2395cdec06288b8",
      },
      ["aunya.phat0@gmail.com"]: {
        id: "630b0200f2395cdec06288c0",
      },
    },
    whoId: {
      ["630b018bf2395cdec06288b8"]: {
        email: "ongsaztx1@gmail.com",
      },
      ["630b0200f2395cdec06288c0"]: {
        email: "aunya.phat0@gmail.com",
      },
    },
    isMobile: false,
    selected: {},
    whoItems: [
      {
        title: "องศา",
        value: "630b018bf2395cdec06288b8",
      },
      {
        title: "น้องอัญ",
        value: "630b0200f2395cdec06288c0",
      },
    ],
    isDisplayGood: true,
    allDisplayNotes: [],
    allNoteData: [],
    noteIsLoading: false,
    allPoints: 0,
    goodPoints: 0,
    badPoints: 0,
    displayIsLoading: false,
  }),
  computed: {
    ...mapGetters({
      isAuthenticated: "isAuthenticated",
      me: "me",
    }),
  },
  watch: {
    me(newVal, oldVal) {
      if (newVal !== oldVal) this.setSelected(this.me)
    },
    who(newVal, oldVal) {
      if (newVal !== oldVal) this.getPoints()
    },
    isDisplayGood(newVal, oldVal) {
      if (newVal !== oldVal) this.getPoints()
    },
    date(newVal, oldVal) {
      if (newVal !== oldVal) this.getPoints()
    },
  },
  methods: {
    async getPoints() {
      if (this.allNoteData.length === 0) await this.fetchNotes()
      if (this.allNoteData.length > 0) {
        this.displayIsLoading = true
        const notesData = this.allNoteData.filter(
          (note) =>
            note.status &&
            (note.create.by === this.who ||
              (note.whoBad && this.whoEmail[note.whoBad].id === this.who)) &&
            new Date(note.createdAt).toISOString().substr(0, 7) === this.date
        )
        this.allPoints = 0
        this.goodPoints = 0
        this.badPoints = 0
        this.allDisplayNotes = []
        notesData.forEach((note) => {
          if (note.type === "good" && note.create.by === this.who) {
            this.goodPoints += note.point
            if (this.isDisplayGood) this.allDisplayNotes.push(note)
          } else if (note.type === "bad" && this.who === this.whoEmail[note.whoBad].id) {
            this.badPoints -= note.point
            if (!this.isDisplayGood) this.allDisplayNotes.push(note)
          }
        })
        this.allPoints = this.goodPoints - this.badPoints
        this.displayIsLoading = false
      }
    },
    update(event) {
      const { who } = event
      this.who = who
    },
    setSelected(val) {
      const { email } = val
      this.selected =
        email === "ongsaztx1@gmail.com"
          ? {
              title: "องศา",
              value: "630b018bf2395cdec06288b8",
            }
          : {
              title: "น้องอัญ",
              value: "630b0200f2395cdec06288c0",
            }
      this.who = this.selected.value
    },
    async fetchNotes() {
      this.$loader(true)
      this.noteIsLoading = true
      await this.$apollo
        .query({
          query: NOTES_QUERY,
          fetchPolicy: "no-cache",
        })
        .then(({ data }) => {
          this.allNoteData = []
          this.allNoteData = data.notes
          this.noteIsLoading = false
          this.$loader(false)
        })
        .catch((err) => {
          this.noteIsLoading = false
          this.$loader(false)
        })
    },
  },
}
</script>
