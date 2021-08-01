import { reactive } from '@nuxtjs/composition-api'
import Todo from '@/types/Todo'
// import EditedTodo from '@/types/EditedTodo'
import { API, graphqlOperation } from 'aws-amplify'
import {
  createTodo as createTodoMutation,
  deleteTodo as deleteTodoMutaition,
  updateTodo as updateTodoMutaition,
} from '@/src/graphql/mutations'
import {
  getTodo as getTodoQuery,
  listTodos as listTodosQuery,
} from '@/src/graphql/queries'

const useTodo = () => {
  const state = reactive({
    todos: null,
  })

  const setTodos = (payload) => {
    state.todos = payload
  }

  const addTodo = async (newTodo: Todo) => {
    try {
      await API.graphql(
        graphqlOperation(createTodoMutation, { input: newTodo })
      )
      getTodosData()
    } catch (error) {
      console.error('addTodo', error)
    }
  }

  const getTodo = async (id) => {
    return await API.graphql(graphqlOperation(getTodoQuery), { id })
  }

  const getTodosData = async () => {
    const todosData = await API.graphql(graphqlOperation(listTodosQuery))
    setTodos(todosData.data.listTodos.items)
  }
  const deleteTodo = async (todoDetails) => {
    await API.graphql(
      graphqlOperation(deleteTodoMutaition, { input: todoDetails })
    )
  }
  const updateTodo = async (todoDetails) => {
    await API.graphql(
      graphqlOperation(updateTodoMutaition, { input: todoDetails })
    )
    getTodosData()
  }

  return {
    state,
    addTodo,
    getTodo,
    getTodosData,
    deleteTodo,
    updateTodo,
  }
}

export type TodoStore = ReturnType<typeof useTodo>
export default useTodo
