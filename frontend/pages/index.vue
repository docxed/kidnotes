<template>
  <v-row justify="center" align="center"> </v-row>
</template>

<script>
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
  mounted() {
    this.helloServer()
  },
  name: "IndexPage",
  data: () => ({}),
  methods: {
    helloServer() {},
  },
}
</script>
