import Todo from '../models/todo.model.js'

export default function postTodo (req, res) {
  const { description, finished } = req.body

  Todo.add(description, finished === 'true')
    .then((todo) => {
      res.status(201).json(todo)
    })
    .catch((err) => {
      res.status(404).send({ Error: err.message })
    })
}
