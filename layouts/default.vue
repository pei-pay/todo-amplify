<template>
  <v-app>
    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, provide } from '@nuxtjs/composition-api'
import useTodo from '@/composables/useTodo'
import TodoKey from '@/composables/useTodoKey'

export default defineComponent({
  setup() {
    provide(TodoKey, useTodo())
  },
})
</script>

<style scoped>
.v-application {
  background: #e0e0e0;
}
.container {
  width: 600px;
}
</style>
