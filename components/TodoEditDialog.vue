<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template #activator="{ on, attrs }">
      <v-btn color="primary" v-bind="attrs" v-on="on"> TODOを編集 </v-btn>
    </template>
    <v-card>
      <v-container>
        <v-card-title>
          <v-row>
            <span class="text-h5">編集</span>
            <v-spacer></v-spacer>
            <v-btn icon @click="closeDialog"><v-icon>close</v-icon></v-btn>
          </v-row>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="editTodo.name"
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
                v-model="editTodo.description"
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
            @click="handleUpdate"
            :disabled="!isValid"
          >
            Edit
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
  PropType,
  reactive,
  ref,
} from '@nuxtjs/composition-api'
import { TodoStore } from '@/composables/useTodo'
import TodoKey from '@/composables/useTodoKey'
import Todo from '@/types/Todo'
import EditedTodo from '@/types/EditedTodo'

export default defineComponent({
  props: {
    todo: {
      type: Promise as PropType<Todo>,
      required: true,
    },
  },
  setup(props, context) {
    const dialog = ref(false)
    const isMenuOpen = ref(false)
    const editTodo: EditedTodo = reactive({
      id: props.todo.id,
      name: props.todo.name,
      description: props.todo.description,
      dueDate: props.todo.dueDate,
    })
    const beforeEditTodo: EditedTodo = reactive({
      id: props.todo.id,
      name: props.todo.name,
      description: props.todo.description,
      dueDate: props.todo.dueDate,
    })

    const date = ref(editTodo.dueDate)

    const dateFormattedDayjs = computed(() => {
      if (date.value) {
        return context.root.$dayjs(date.value).locale('ja').format('MMMMDD日')
      }
      return ''
    })

    const isValid = ref(true)
    const validateForm = () => {
      if (!editTodo.name) {
        isValid.value = false
      } else {
        isValid.value = true
      }
    }

    const { updateTodo } = inject(TodoKey) as TodoStore
    const handleUpdate = () => {
      editTodo.dueDate = date.value
      if (!editTodo.name) {
        return
      }
      updateTodo(editTodo)
      dialog.value = false
    }

    const closeDialog = () => {
      dialog.value = false
      editTodo.name = beforeEditTodo.name
      editTodo.description = beforeEditTodo.description
      editTodo.dueDate = beforeEditTodo.dueDate
    }

    return {
      dialog,
      isMenuOpen,
      date,
      dateFormattedDayjs,
      editTodo,
      isValid,
      validateForm,
      handleUpdate,
      closeDialog,
    }
  },
})
</script>
