<template>
  <v-container>
    <v-row justify="center" class="pt-16 pb-8">
      <div class="text-h3 primary--text">TODO</div>
    </v-row>
    <v-row justify="end" class="pb-8">
      <TodoCreateDialog />
    </v-row>
    <v-row justify="center">
      <v-col cols="12">
        <v-card>
          <v-progress-linear height="16" :value="progress"></v-progress-linear>
          <!-- <v-card-text v-if="!computedTodos">no task!</v-card-text> -->
          <v-list>
            <TodoListItem
              v-for="todo in computedTodos"
              :key="todo.id"
              :todo="todo"
            />
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  onMounted,
} from '@nuxtjs/composition-api'
import TodoCreateDialog from '@/components/TodoCreateDialog.vue'
import TodoListItem from '@/components/TodoListItem.vue'

import { TodoStore } from '@/composables/useTodo'
import TodoKey from '@/composables/useTodoKey'

export default defineComponent({
  components: { TodoCreateDialog, TodoListItem },
  setup() {
    const { state, getTodosData } = inject(TodoKey) as TodoStore
    onMounted(async () => {
      await getTodosData()
    })
    const computedTodos = computed(() => {
      return state.todos
    })
    const progress = computed(() => {
      if (!state.todos) {
        return
      }
      return (
        (state.todos.filter((todo) => todo.isDone).length /
          state.todos.length) *
        100
      )
    })
    return { computedTodos, progress }
  },
})
</script>
