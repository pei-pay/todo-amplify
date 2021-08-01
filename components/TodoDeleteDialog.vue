<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template #activator="{ on, attrs }">
      <v-btn color="warning" v-bind="attrs" v-on="on"> TODOを削除 </v-btn>
    </template>
    <v-card>
      <v-container>
        <v-card-title>
          <v-row>
            <span class="text-h6">削除</span>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog = false"><v-icon>close</v-icon></v-btn>
          </v-row>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <div class="text-h6">本当に削除しますか？</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="handleDelete"> Delete </v-btn>
          <v-btn color="primary" text @click="dialog = false"> Cancel </v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  ref,
  useRouter,
} from '@nuxtjs/composition-api'
import { TodoStore } from '@/composables/useTodo'
import TodoKey from '@/composables/useTodoKey'

export default defineComponent({
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter()
    const dialog = ref(false)
    const { deleteTodo } = inject(TodoKey) as TodoStore
    const handleDelete = async () => {
      const todoDetails = {
        id: props.id,
      }
      await deleteTodo(todoDetails)
      dialog.value = false
      router.push('/')
    }
    return {
      dialog,
      handleDelete,
    }
  },
})
</script>
