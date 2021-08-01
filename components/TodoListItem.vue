<template>
  <v-list-item>
    <v-list-item-icon
      ><v-checkbox :input-value="todo.isDone" @change="toggle"></v-checkbox
    ></v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title>{{ todo.name }}</v-list-item-title>
      <v-list-item-subtitle>{{
        $dayjs(todo.dueDate).locale('ja').format('MMMMDD日')
      }}</v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
      <nuxt-link :to="{ name: 'todos-id', params: { id: todo.id } }">
        <v-btn icon><v-icon color="primary" large>navigate_next</v-icon></v-btn>
      </nuxt-link>
    </v-list-item-action>
  </v-list-item>
</template>

<script lang="ts">
import { defineComponent, inject, PropType } from '@nuxtjs/composition-api'
import Todo from '@/types/Todo'
import { TodoStore } from '@/composables/useTodo'
import TodoKey from '@/composables/useTodoKey'

export default defineComponent({
  props: {
    todo: {
      required: true,
      type: Object as PropType<Todo>,
    },
  },
  setup(props) {
    const { updateTodo } = inject(TodoKey) as TodoStore
    const toggle = () => {
      const todoDetails = {
        id: props.todo.id,
        isDone: !props.todo.isDone,
      }
      updateTodo(todoDetails)
    }
    return { toggle }
  },
})
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
