<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template #activator="{ on, attrs }">
      <v-btn color="primary" v-bind="attrs" v-on="on"> TODOを作成 </v-btn>
    </template>
    <v-card>
      <v-container>
        <v-card-title>
          <v-row>
            <span class="text-h5">作成</span>
            <v-spacer></v-spacer>
            <v-btn icon @click="closeDialog"><v-icon>close</v-icon></v-btn>
          </v-row>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="newTodo.name"
                label="タイトル"
                outlined
                required
                @blur="validateForm"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-menu
                ref="menu"
                v-model="isMenuOpen"
                :close-on-content-click="false"
                :return-value.sync="date"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template #activator="{ on, attrs }">
                  <v-select
                    v-model="dateFormattedDayjs"
                    :items="[dateFormattedDayjs]"
                    label="期限"
                    outlined
                    v-bind="attrs"
                    v-on="on"
                  ></v-select>
                </template>
                <v-date-picker
                  v-model="date"
                  no-title
                  scrollable
                  locale="jp-ja"
                  :day-format="(date) => new Date(date).getDate()"
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="isMenuOpen = false">
                    Cancel
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.menu.save(date)">
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col>
              <v-textarea
                v-model="newTodo.description"
                label="コメント"
                outlined
                rows="4"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            :disabled="!isValid"
            @click="handleCreate"
          >
            Create
          </v-btn>
          <v-btn color="primary" text @click="closeDialog"> Cancel </v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  reactive,
  ref,
} from '@nuxtjs/composition-api'
import { TodoStore } from '@/composables/useTodo'
import TodoKey from '@/composables/useTodoKey'

export default defineComponent({
  setup(_, context) {
    const dialog = ref(false)
    const isMenuOpen = ref(false)
    const date = ref(
      new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10)
    )

    const dateFormattedDayjs = computed(() => {
      if (date.value) {
        return context.root.$dayjs(date.value).locale('ja').format('MMMMDD日')
      }
      return ''
    })

    const newTodo = reactive({
      name: '',
      description: '',
    })

    const { addTodo } = inject(TodoKey) as TodoStore
    const isValid = ref(false)
    const validateForm = () => {
      if (!newTodo.name) {
        isValid.value = false
      } else {
        isValid.value = true
      }
    }

    const handleCreate = () => {
      if (!newTodo.name) {
        return
      }
      addTodo({
        name: newTodo.name,
        description: newTodo.description,
        dueDate: date.value,
        isDone: false,
      })
      closeDialog()
    }

    const closeDialog = () => {
      dialog.value = false
      newTodo.name = ''
      newTodo.description = ''
      date.value = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10)
    }

    return {
      dialog,
      isMenuOpen,
      date,
      dateFormattedDayjs,
      validateForm,
      isValid,
      newTodo,
      handleCreate,
      closeDialog,
    }
  },
})
</script>
