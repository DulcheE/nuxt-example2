import Todo from '../models/todo.model.js'

export default function putTodo (req, res) {
  const todo = new Todo(req.body)
  const todoId = parseInt(req.params.todoId)

  Todo.update(todoId, todo)
    .then((todo) => {
      res.json(todo)
    })
    .catch((err) => {
      res.status(404).send({ Error: err.message })
    })
}
