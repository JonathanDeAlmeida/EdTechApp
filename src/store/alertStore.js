import { defineStore } from 'pinia'

export const alertStore = defineStore('alert', {
  state: () => ({
    showAlert: false,
    messageAlert: '',
    typeAlert: '',
    error: 'Ops, tivemos um erro, por favor tente novamente mais tarde'
  }),
  actions: {
    setShowAlert(showAlert) {
      this.showAlert = showAlert
    },
    setMessageAlert(messageAlert) {
      this.messageAlert = messageAlert
    },
    setTypeAlert(typeAlert) {
      this.typeAlert = typeAlert
    }
  }
})