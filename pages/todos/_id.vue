<template>
  <v-container>
    <div v-if="!todo">no task</div>
    <!-- todoを削除した時にエラーが表示されないようにする -->
    <div v-else>
      <nuxt-link to="/"
        ><v-btn icon
          ><v-icon color="primary">navigate_before</v-icon>一覧に戻る</v-btn
        ></nuxt-link
      >
      <v-row justify="center" class="pt-16 pb-8">
        <div class="text-h3 primary--text">TODO</div>
      </v-row>
      <v-row justify="end" class="pb-8">
        <v-col cols="3">
          <TodoEditDialog :todo="todo" />
        </v-col>
        <v-col cols="3">
          <TodoDeleteDialog :id="todoId" />
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="12" class="pa-0">
          <v-card>
            <v-list>
              <v-list-item>
                <v-list-item-icon
                  ><v-checkbox
                    :input-value="todo.isDone"
                    @change="toggle"
                  ></v-checkbox
                ></v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ todo.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    $dayjs(todo.dueDate).locale('ja').format('MMMMDD日')
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-card-text>
              {{ todo.description }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row justify="end"
        ><div class="text-caption">
          {{ $dayjs(todo.createdAt).format('YYYY-MM-DD h:mm') }}
        </div></v-row
      >
    </div>
  </v-container>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  onMounted,
  useRoute,
  computed,
} from '@nuxtjs/composition-api'

import TodoEditDialog from '@/components/TodoEditDialog.vue'
import TodoDeleteDialog from '@/components/TodoDeleteDialog.vue'

import { TodoStore } from '@/composables/useTodo'
import TodoKey from '@/composables/useTodoKey'

export default defineComponent({
  components: { TodoEditDialog, TodoDeleteDialog },
  setup() {
    const { getTodosData, state, updateTodo } = inject(TodoKey) as TodoStore
    onMounted(async () => {
      await getTodosData()
    })
    const route = useRoute()
    const todoId = route.value.params.id

    const todo = computed(() => {
      if (!state.todos) {
        return
      }
      return state.todos.find((single) => {
        return single.id === todoId
      })
    })

    // const todo = getTodo(id)

    const toggle = () => {
      const todoDetails = {
        id: todoId,
        isDone: !todo.isDone,
      }
      updateTodo(todoDetails)
    }

    return { todo, todoId, toggle }
  },
})
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
