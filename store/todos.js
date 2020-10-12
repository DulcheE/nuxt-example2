const state = () => ({
  todos: []
})

const getters = {
}

const mutations = {
  addTodo (state, todo) {
    const curr = state.todos.find(t => t.id === todo.id)
    if (!curr) {
      state.todos.push(todo)
    } else {
      curr.description = todo.description
      curr.finished = todo.finished
    }
  },

  removeTodo (state, id) {
    const index = state.todos.findIndex(t => t.id === id)
    if (index !== -1) {
      state.todos.splice(index, 1)
    }
  }
}

const actions = {
  async fetchAllTodos ({ commit }) {
    const todos = await this.$axios.$get('/api/todos')
    todos.forEach(t => commit('addTodo', t))
  },

  async createTodo ({ commit }, { description }) {
    const todo = await this.$axios.$post('/api/todo', {
      description,
      finished: false
    })
    commit('addTodo', todo)
  },
  async updateTodo ({ commit }, todo) {
    const newTodo = await this.$axios.$put('/api/todo/' + todo.id, todo)

    commit('addTodo', newTodo)
  },
  async deleteTodo ({ commit }, id) {
    await this.$axios.$delete('/api/todo/' + id)

    commit('removeTodo', id)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
