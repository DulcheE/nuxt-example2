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
    }
  ]
  await writeFile(todosFile, JSON.stringify(content))
}

describe('PUT /api/todo/:todoId', () => {
  beforeEach(() => resetJSON())
  const newVals = {
    description: 'new desc',
    finished: false
  }

  it('should forbid to modify a todo that does not exit', () => {
    const agent = createExpress()
    return agent
      .put('/api/todo/3')
      .send(newVals)
      .expect('Content-Type', /json/)
      .expect(404)
  })

  it('should modify the `description` and `finished` fields', async () => {
    const agent = createExpress()
    await agent
      .put('/api/todo/2')
      .send(newVals)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body)
          .to.be.an('object')
        expect(response.body.description).to.equal(newVals.description)
        expect(response.body.finished).to.equal(newVals.finished)
      })

    return agent
      .get('/api/todos')
      .expect(200)
      .then((response) => {
        expect(response.body)
          .to.be.an('array')
          .of.length(2)
        expect(response.body[1].description).to.equal(newVals.description)
        expect(response.body[1].finished).to.equal(newVals.finished)
      })
  })
})
