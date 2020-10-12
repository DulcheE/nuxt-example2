<template>
  <div>
    <div>
      <v-form>
        <v-card>
          <v-card-text>
            <v-text-field
              v-model="newItem.description"
              placeholder="What do you need to do ?"
              required
            />
          </v-card-text>
          <v-card-actions>
            <v-btn @click="addItem">
              Submit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </div>
    <div v-for="todo in todos" :key="todo.id">
      <v-card elevation="8" style="margin: 10px">
        <v-row>
          <v-col cols="1">
            <div class="d-flex justify-center">
              <v-checkbox
                :input-value="todo.finished"
                @change="
                  updateTodo({
                    ...todo,
                    finished: !todo.finished
                  })
                "
              />
            </div>
          </v-col>
          <v-col cols="11" md="9">
            <div class="d-flex align-center">
              <h2>{{ todo.description }}</h2>
            </div>
          </v-col>
          <v-col cols="12" md="2">
            <div class="d-flex justify-center">
              <v-btn
                color="red"
                @click="deleteTodo(todo.id)"
              >
                Delete
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data: () => ({
    newItem: {
      description: ''
    }
  }),
  computed: {
    ...mapState('todos', ['todos'])
  },
  async created () {
    await this.fetchAllTodos()
  },
  methods: {
    ...mapActions('todos', ['fetchAllTodos', 'createTodo', 'updateTodo', 'deleteTodo']),

    async addItem () {
      await this.createTodo({
        description: this.newItem.description
      })

      this.newItem.description = ''
    }

  }
}
</script>
