import { Router } from 'express'
import getTodos from '../controllers/get.todos.js'
import postTodo from '../controllers/post.todo.js'
import putTodo from '../controllers/put.todo.js'
import deleteTodo from '../controllers/delete.todo.js'

const router = Router()

router.get('/todos', getTodos)
router.post('/todo', postTodo)
router.put('/todo/:todoId', putTodo)
router.delete('/todo/:todoId', deleteTodo)

export default router
