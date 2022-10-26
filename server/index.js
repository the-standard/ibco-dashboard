const express = require('express')
const next = require('next')
const morgan = require('morgan')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev: process.env.NODE_ENV !== 'production' });

const handle = app.getRequestHandler()

const port = process.env.NODE_PORT || 8080;

app.prepare()
.then(() => {
  const server = express()

  server.use(morgan('combined'))
  
  server.get('/_health', (req, res) => {
    res.sendStatus(200)
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
