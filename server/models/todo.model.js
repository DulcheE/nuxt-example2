import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import postgresStore from '../postgres-store'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const todosFile = path.join(__dirname, '../data/todos.json')

export default class Todo {
  /** @type {Number} */
  id;
  /** @type {String} */
  description;
  /** @type {Boolean} */
  finished;

  /**
   * @param {any} todo
   */
  constructor (todo) {
    this.id = todo.id
    this.description = todo.description
    this.finished = todo.finished === true
  }

  static async generateTable () {
    await postgresStore.client.query(`
      CREATE TABLE todo (
        id INT,
        descrition VARCHAR,
        finished BOOL
      )`
    )
  }

  /**
   * @returns {Promise<Todo[]>}
   */
  static async getAll () {
    const todos = await readFile(todosFile, 'utf8')

    return JSON.parse(todos)
  }

  /**
   * @param {String} description
   * @param {Boolean} [finished=false]
   * @returns {Promise<Todo>}
   */
  static async add (description, finished = false) {
    const todos = await this.getAll()
    const lastTodo = todos[todos.length - 1]
    const newId = lastTodo.id + 1

    const todo = new Todo({ id: newId, description, finished })

    todos.push(todo)
    await writeFile(todosFile, JSON.stringify(todos, null, 4))

    return todos[todos.length - 1]
  }

  /**
   * @param {number} id
   * @param {Todo} todo
   * @returns {Promise<Todo>}
   */
  static async update (id, todo) {
    const todos = await this.getAll()

    if (!todos.find(_ => _.id === id)) {
      throw new Error('No todo for this id found !')
    }

    todo.id = id

    const todoIndex = todos.findIndex(_ => _.id === id)
    todos[todoIndex] = todo

    await writeFile(todosFile, JSON.stringify(todos, null, 4))

    return todos[todoIndex]
  }

  /**
   * @param {number} id
   * @returns {Promise<Boolean>}
   */
  static async remove (id) {
    const todos = await this.getAll()

    if (!todos.find(_ => _.id === id)) {
      throw new Error('No todo for this id found !')
    }

    const newTodos = todos.filter(_ => _.id !== id)

    await writeFile(todosFile, JSON.stringify(newTodos, null, 4))

    return true
  }
}
