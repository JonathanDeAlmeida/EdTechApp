<template>
    <div v-if="showAlert" class="alert">
      <v-alert :type="typeAlert" :text="messageAlert"></v-alert>
    </div>
  </template>
  
  <script setup>
  import { storeToRefs } from 'pinia'
  import { alertStore } from '../store/alertStore'
  const alert = alertStore()
  const { messageAlert, showAlert, typeAlert } = storeToRefs(alert)
  </script>