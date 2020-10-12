import { Router } from 'express'
import todoRouter from './todo.js'

const router = Router()
// after the import from express
router.use('/', todoRouter) // before the export default

export default router
