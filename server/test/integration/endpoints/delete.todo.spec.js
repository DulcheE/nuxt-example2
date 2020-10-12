/* eslint-disable no-unused-expressions */
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { expect } from 'chai'
import request from 'supertest'
import express from 'express'
import session from 'express-session'
import apiRouter from '../../../routes/routes.js'
const writeFile = promisify(fs.writeFile)
const todosFile = path.join(__dirname, '../../../data/todos.json')

/**
 * We recreate the express app with our apiRouter to isolate any unwanted middleware
 * Then, we can use a session secret that doesn't need the real server configuration
 */
function createExpress () {
  const app = express()
  app.use(session({
    secret: 'whatever',
    resave: false,
    saveUninitialized: false
  }))
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use('/api/', apiRouter)

  const agent = request.agent(app)
  return agent
}

async function resetJSON () {
  const content = [
    {
      id: 1,
      description: 'Do the exercise 1',
      finished: true
    },
    {
      id: 2,
      description: 'Do the exercise 2',
      finished: true
    },
    {
      id: 3,
      description: 'Do the exercise 3',
      finished: true
    }
  ]
  await writeFile(todosFile, JSON.stringify(content))
}

describe('DELETE /api/todo/:todoId', () => {
  beforeEach(() => resetJSON())

  it('should forbid to remove a todo that does not exit', () => {
    const agent = createExpress()
    return agent
      .delete('/api/todo/4')
      .expect('Content-Type', /json/)
      .expect(404)
  })

  it('should remove the todo for a existing given `id` param', async () => {
    const agent = createExpress()
    await agent
      .delete('/api/todo/2')
      .expect('Content-Type', /plain/)
      .expect(200)
      .then((response) => {
        expect(response.text)
          .to.be.a('string')
          .to.equal('OK')
      })

    return agent
      .get('/api/todos')
      .expect(200)
      .then((response) => {
        expect(response.body)
          .to.be.an('array')
          .of.length(2)
      })
  })
})
