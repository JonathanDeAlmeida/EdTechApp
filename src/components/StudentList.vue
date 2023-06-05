<template>
  <v-dialog v-model="saveModalStudent" class="w-modal" persistent>
    <v-card>
      <v-toolbar class="bg-teal-darken-1" title="Cadastro do Aluno"></v-toolbar>
      <v-card-text>
        <v-form>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="student.name" label="Nome"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="student.email" label="E-mail"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="student.document" label="CPF" :disabled="student.id" type="number"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="student.academic_register" label="Registro Acadêmico" :disabled="student.id" type="number"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-alert v-if="alertModalStudent" :text="messageModalStudent" type="error"></v-alert>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn class="bg-grey-darken-4" @click="closeSaveModalStudent()">Cancelar</v-btn>
        <v-btn class="bg-teal-darken-1" @click.prevent="saveStudent()">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="removeModalStudent" width="auto" persistent>
    <v-card>
      <v-toolbar class="bg-teal-darken-1" title="Excluir Aluno"></v-toolbar>
      <v-card-text class="alert-text">
        Tem certeza que deseja excluir o aluno?
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn class="bg-grey-darken-4" @click="removeModalStudent = false">Cancelar</v-btn>
        <v-btn class="bg-teal-darken-1" @click.prevent="removeStudent()">Confirmar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-container class="mt-5">
    <v-row>
      <v-col cols="12">
        <h1>ALUNOS</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="6">
            <v-text-field @click:append-inner="filterStudents" v-model="filter" label="Digite sua busca" density="compact" variant="solo" append-inner-icon="mdi-magnify" single-line></v-text-field>
          </v-col>
          <v-col class="btn-save-student" cols="6">
            <v-btn class="mt-1 bg-teal-darken-1" @click="saveModalStudent = true">
            Cadastrar Aluno
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-table class="bg-teal-lighten-5 students-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>CPF</th>
              <th>Registro Acadêmico</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody v-if="students.length > 0">
            <tr v-for="(stud, index) of students" :key="index">
              <td>{{ stud.name }}</td>
              <td>{{ stud.email }}</td>
              <td>{{ stud.document }}</td>
              <td>{{ stud.academic_register }}</td>
              <td>
                <v-btn class="bg-teal-darken-1 m-5" @click.prevent="showEditModalStudent(stud)">
                  <i class="fa fa-pencil"></i>
                </v-btn>
                <v-btn class="bg-grey-darken-4" @click.prevent="showRemoveModalStudent(stud.id)">
                  <i class="fa fa-trash"></i>
                </v-btn>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr class="text-center">
              <td colspan="5">
                <p>Nenhum aluno encontrado</p>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { alertStore } from '../store/alertStore'
import { apiUrl } from '../config'

export default {
  data () {
    return {
      saveModalStudent: false,
      removeModalStudent: false,
      alertModalStudent: false,
      removedStudentId: null,
      students: [],
      messageModalStudent: '',
      filter: '',
      student: {
        id: null,
        name: '',
        email: '',
        academic_register: '',
        document: ''
      }
    }
  },
  methods: {
    // Buscando todos os alunos
    getStudents () {
      let self = this
      axios.get(apiUrl + 'get-students').then(response => {
        self.students = response.data
      }).catch(() => {
        self.showErrorAlert()
      })
    },
    // Buscando os alunos por filtro
    filterStudents () {
      let self = this
      axios.get(apiUrl + 'filter-students?filter=' + this.filter).then(response => {
        self.students = response.data
      }).catch(function () {
        self.showErrorAlert()
      })
    },
    // Salvando o aluno no cadastro ou edição
    saveStudent () {
      if (!this.checkStudent()) {
        return false
      }
      let self = this
      axios.post(apiUrl + 'save-student', this.student).then(() => {
        self.showAlert('success', 'Aluno salvo com sucesso')
        self.clearStudent()
        self.getStudents()
        self.saveModalStudent = false
      }).catch(() => {
        self.showErrorAlert()
        self.clearStudent()
        self.saveModalStudent = false
      })
    },
    // Checando se foram preenchidos corretamente os campos do formulário de cadastro do aluno
    checkStudent () {
      let alert = false
      let field = ''
      if (!this.student.name) {
        field = 'Nome'
        alert = true
      } else if (!this.student.email) {
        field = 'E-mail'
        alert = true
      } else if (!this.student.document) {
        field = 'CPF'
        alert = true
      } else if (!this.student.academic_register) {
        field = 'Registro Acadêmico'
        alert = true
      } 
      if (alert) {
        this.alertModalStudent = true
        this.messageModalStudent = 'Por favor preencha o campo ' + field
        setTimeout(() => {this.alertModalStudent = false}, 6000)
        return false
      }
      return true
    },
    // Cancelando cadastro ou edição do aluno
    closeSaveModalStudent () {
      this.clearStudent()
      this.saveModalStudent = false
    },
    // Limpando campos do formulário de cadastro ou edição do aluno
    clearStudent () {
      this.student = {
        id: null,
        name: '',
        email: '',
        academic_register: '',
        document: ''
      }
    },
    // Mostrando confirmação de ações realizadas
    showAlert (type, text) {
      let alert = alertStore()
      let message = type === 'success' ? text : alert.error
      alert.setMessageAlert(message)
      alert.setTypeAlert(type)
      alert.setShowAlert(true)
      setTimeout(() => {alert.setShowAlert(false)}, 10000)
    },
    // Função auxiliar de confirmação de ações realizadas
    showErrorAlert () {
      this.showAlert('error', '')
    },
    // Abrindo modal de edição do aluno
    showEditModalStudent (student) {
      this.student = {
        id: student.id,
        name: student.name,
        email: student.email,
        academic_register: student.academic_register,
        document: student.document
      }
      this.saveModalStudent = true
    },
    // Abrindo modal de exclusão do aluno
    showRemoveModalStudent (removedStudentId) {
      this.removedStudentId = removedStudentId
      this.removeModalStudent = true
    },
    // Excluindo o aluno
    removeStudent () {
      let self = this
      axios.delete(apiUrl + 'remove-student?id=' + this.removedStudentId).then(() => {
        self.removeModalStudent = false
        self.showAlert('success', 'Aluno excluído com sucesso')
        self.getStudents()
      }).catch(() => {
        self.showErrorAlert()
        self.removeModalStudent = false
      })
    }
  },
  created () {
    this.getStudents()
  }
}
</script> 