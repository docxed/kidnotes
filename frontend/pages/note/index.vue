<template>
  <v-container class="mt-10">
    <v-row class="mb-3">
      <v-col>
        <v-row class="mb-3">
          <v-col>
            <h2>บันทึกความดี/ความชั่ว</h2>
          </v-col>
        </v-row>
        <v-btn depressed color="primary" @click="openDialogCreate()"
          ><v-icon left> mdi-plus </v-icon>บันทึกความดี/ความชั่ว</v-btn
        >
        <v-btn :small="isMobile" icon @click="fetchNotes()" class="ml-2">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-container fluid class="d-flex">
      <v-card width="100vw">
        <!-- Note Table -->
        <note-table
          :me="me"
          :noteData="allNoteData"
          :noteIsLoading="noteIsLoading"
          @updateItem="updateItem($event)"
          @deleteItem="openConfirmDialog($event)"
        />
      </v-card>
    </v-container>

    <!-- Create Note Form -->
    <dialog-form formTitle="เพิ่มบันทึกความดี/ความชั่ว" v-model="dialogCreate">
      <note-form
        ref="createForm"
        :noteData.sync="noteData"
        :errNoteMessage="errNoteMessage"
        :createNoteIsLoading="createNoteIsLoading"
        @submitNote="createNote()"
      />
    </dialog-form>

    <!-- Update Note Form -->
    <dialog-form formTitle="แก้ไขคูปอง" v-model="dialogUpdate">
      <note-form
        ref="updateForm"
        :me="me"
        :noteData.sync="noteUpdate"
        :errNoteMessage="errNoteMessage"
        :createNoteIsLoading="createNoteIsLoading"
        @submitNote="updateNote()"
        isUpdating
      />
    </dialog-form>

    <!-- Note Confirm Dialog -->
    <dialog-confirm
      v-model="dialogConfirm"
      :title="confirmTitle"
      :name="confirmName"
      :color="confirmColor"
      @close="closeConfirm()"
      @submit="submitConfirm(toStatus, confirmId)"
    />
  </v-container>
</template>
<script>
import {
  CREATE_NOTE_MUTATION,
  UPDATE_NOTE_MUTATION,
  DELETE_NOTE_MUTATION,
  NOTIFY_MUTATION,
} from "~/graphql/mutation"
import { NOTES_QUERY } from "~/graphql/query"
import { mapGetters, mapActions } from "vuex"

export default {
  head() {
    return {
      title: "บันทึกความดี/ความชั่ว",
      meta: [
        {
          hid: "😇 บันทึกแต้มบุญ - บันทึกความดี/ความชั่ว",
          name: "😇 บันทึกแต้มบุญ - บันทึกความดี/ความชั่ว",
          content: "😇 บันทึกแต้มบุญ | บันทึกความดี/ความชั่ว",
        },
      ],
    }
  },
  mounted() {
    this.isMobile = this.$vuetify.breakpoint.xsOnly ? true : false
    this.fetchNotes()
  },
  created() {},
  data: () => ({
    dialogConfirm: false,
    confirmTitle: "",
    confirmName: "",
    confirmColor: "",
    toStatus: "",
    confirmId: "",
    isMobile: false,
    dialogCreate: false,
    noteData: {},
    noteDataDefault: {
      content: "",
      isImg: false,
      type: "good",
      whoBad: "",
      point: 0,
      status: false,
    },
    errNoteMessage: "",
    createNoteIsLoading: false, // noteIsLoading
    allNoteData: [],
    noteIsLoading: false,
    noteUpdate: {},
    dialogUpdate: false,
  }),
  computed: {
    ...mapGetters({
      isAuthenticated: "isAuthenticated",
      me: "me",
    }),
  },
  watch: {
    dialogConfirm(val) {
      val || this.closeConfirm()
    },
    dialogCreate(val) {
      val || this.closeCreate()
    },
  },
  methods: {
    ...mapActions("messages", ["setMessage"]),

    notify(payloadData) {
      const { message, stickerPackageId, stickerId } = payloadData
      this.$apollo
        .mutate({
          mutation: NOTIFY_MUTATION,
          variables: {
            message,
            stickerPackageId,
            stickerId,
          },
        })
        .then(({ data }) => {
          
          this.setMessage({
            title: "ส่งการแจ้งเตือน LINE สำเร็จ",
            type: "ดำเนินการ",
            color: "green",
          })
        })
        .catch((error) => {
          this.setMessage({
            title: "ส่งการแจ้งเตือน LINE ไม่สำเร็จ",
            type: "ล้มเหลว",
            color: "red",
          })
        })
    },
    fetchNotes() {
      this.noteIsLoading = true
      this.$apollo
        .query({
          query: NOTES_QUERY,
          fetchPolicy: "no-cache",
        })
        .then(({ data }) => {
          this.allNoteData = []
          this.allNoteData = data.notes
        })
      this.noteIsLoading = false
    },
    updateNote() {
      this.createNoteIsLoading = true
      const { _id, content, isImg, type, whoBad, point, status, user } = this.noteUpdate
      this.$apollo
        .mutate({
          mutation: UPDATE_NOTE_MUTATION,
          variables: {
            id: _id,
            record: {
              content,
              isImg,
              type,
              whoBad,
              point,
              status,
            },
          },
        })
        .then(() => {
          if (status) {
            const payloadData = {
              message: `✔️ ${this.me.name} ได้ทำการตวจสอบ ${content} ของ ${user.name} แล้ว`,
              stickerPackageId: "",
              stickerId: "",
            }
            this.notify(payloadData)
          }

          this.fetchNotes()
          this.resetUpdateNoteForm()
          this.createNoteIsLoading = false
        })
        .catch((error) => {
          this.errNoteMessage = error.message.split(":")[1]
        })
      this.createNoteIsLoading = false
    },
    resetUpdateNoteForm() {
      this.$refs.updateForm.resetValidation(true)
      this.noteUpdate = { ...this.noteDataDefault }
      this.errNoteMessage = ""
      this.dialogUpdate = false
    },
    updateItem(item) {
      this.noteUpdate = Object.assign({}, item)
      this.dialogUpdate = true
    },
    deleteNote(id) {
      this.$apollo
        .mutate({
          mutation: DELETE_NOTE_MUTATION,
          variables: {
            id: id,
          },
        })
        .then(({ data }) => {
          this.fetchNotes()
          this.setMessage({
            title: "ลบเรียบร้อย",
            type: "ดำเนินการ",
            color: "green",
          })
        })
        .catch((error) => {
          console.error(error)
          this.setMessage({
            title: "ลบไม่สำเร็จ",
            type: "ดำเนินการ",
            color: "red",
          })
        })
    },
    createNote() {
      this.createNoteIsLoading = true
      const { content, isImg, type, whoBad } = this.noteData
      this.$apollo
        .mutate({
          mutation: CREATE_NOTE_MUTATION,
          variables: {
            record: {
              content: content,
              isImg: isImg,
              type: type,
              whoBad: whoBad,
              create: {
                by: this.me.userId,
              },
            },
          },
        })
        .then(({ data }) => {
          this.createNoteIsLoading = false
          const payloadData = {
            message: `✏️ ${this.me.name} ${
              type === "good"
                ? "บันทึกความดี"
                : "รายงานความชั่ว" + (whoBad === "ongsaztx1@gmail.com" ? "องศา" : "น้องอัญ")
            } ว่า ${content}`,
            stickerPackageId: "",
            stickerId: "",
          }
          this.notify(payloadData)
          this.closeCreate()
          this.fetchNotes()
          this.setMessage({
            title: "บันทึกเรียบร้อย",
            type: "ดำเนินการ",
            color: "green",
          })
        })
        .catch((error) => {
          this.createNoteIsLoading = false
          console.error(error)
          this.errNoteMessage = error.message.split(":")[1]
        })
    },
    openDialogCreate() {
      this.noteData = { ...this.noteDataDefault }
      this.dialogCreate = true
    },
    closeCreate() {
      this.$refs.createForm.resetValidation()
      this.errCreateCouponMessage = ""
      this.dialogCreate = false
    },
    // Confirm Dialog
    openConfirmDialog(value) {
      if (value.confirmType === "delete") {
        this.confirmTitle = `ต้องการลบรายการ บันทึก`
        this.confirmName = `${value.content}`
        this.confirmColor = "red"
      }
      this.toStatus = value.confirmType
      this.confirmId = value._id
      this.dialogConfirm = true
    },
    async submitConfirm(status, confirmId) {
      if (status === "delete") {
        await this.deleteNote(confirmId)
        this.closeConfirm()
      }
    },
    closeConfirm() {
      this.dialogConfirm = false
    },
  },
}
</script>
