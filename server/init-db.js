import postgresStore from './postgres-store.js'
import Todo from './models/todo.model.js'

let existingConf
try {
  existingConf = require('./server.config.js')
} catch (err) {
  existingConf = {}
}

postgresStore.init(existingConf.postgres)
Todo.generateTable()
