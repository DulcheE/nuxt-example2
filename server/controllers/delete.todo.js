import Todo from '../models/todo.model.js'

export default function deleteTodo (req, res) {
  const todoId = parseInt(req.params.todoId)

  Todo.remove(todoId)
    .then(() => {
      res.sendStatus(200)
    })
    .catch((err) => {
      res.status(404).send({ Error: err.message })
    })
}
