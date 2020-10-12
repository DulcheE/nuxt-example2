import Todo from '../models/todo.model.js'

export default function getTodos (req, res) {
  Todo.getAll()
    .then((todos) => {
      res.json(todos)
    })
    .catch((err) => {
      res.status(404).send({ Error: err.message })
    })
}
