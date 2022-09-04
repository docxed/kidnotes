<template>
  <v-data-table
    :headers="headers"
    :items="noteData"
    :search="search"
    class="elevation-1"
    child-flex
    :loading="noteIsLoading"
    loading-text="กำลังโหลดข้อมูลบันทึก...โปรดรอสักครู่"
    no-data-text="ไม่พบข้อมูลบันทึก"
    sort-by="createdAt"
    :sort-desc="sortDesc"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-spacer />
        <v-text-field
          color="grey darken-4"
          v-model="search"
          append-icon="mdi-magnify"
          label="ค้นหา"
          single-line
          hide-details
        />
      </v-toolbar>
    </template>
    <template v-slot:[`item.type`]="{ item }">
      {{ typeItems[item.type].title }}
    </template>
    <template v-slot:[`item.status`]="{ item }">
      <v-chip
        class="ma-2"
        :color="item.point > 0 ? 'green' : 'red'"
        text-color="white"
        v-if="item.status"
        >{{ item.point }} แต้ม</v-chip
      >
      <v-chip class="ma-2" v-else>รอตรวจสอบ</v-chip>
    </template>
    <template v-slot:[`item.createdAt`]="{ item }">
      {{
        $momentFormat({
          date: formatDateToFill(item.createdAt),
          format: "วันที่ DD/MM/YYYY เวลา HH:mm น.",
        })
      }}
    </template>
  </v-data-table>
</template>
<script>
export default {
  props: {
    me: {
      type: Object,
      default: () => {},
    },
    noteData: {
      type: Array,
      required: true,
    },
    noteIsLoading: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    search: "",
    sortDesc: true,
    typeItems: {
      bad: {
        title: "ความชั่ว 👿",
      },
      good: {
        title: "ความดี 😇",
      },
    },
  }),
  computed: {
    headers() {
      return [
        { text: "รายละเอียด", value: "content" },
        { text: "ประเภท", value: "type" },
        { text: "สถานะ", value: "status" },
        { text: "วันที่บันทึก", value: "createdAt" },
        { text: "โดย", value: "user.name" },
      ]
    },
  },
  methods: {
    formatDateToFill(date) {
      return date
        ? this.$moment(new Date(date.seconds ? date.seconds * 1000 : date)).toDate()
        : null
    },
    permissionEdit(item) {
      let flag = false
      if (this.me) {
        if (this.me.email === "akira.ajeyb@gmail.com") {
          flag = true
        } else if (item.user.email === this.me.email) {
          if (item.status) {
            flag = false
          } else {
            flag = true
          }
        }
      }
      return flag
    },
  },
}
</script>
