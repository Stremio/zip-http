const getRouter = require('./getRouter')
const express = require('express')
const app = express()

app.use(getRouter())

const port = process.env.PORT || 7880

app.listen(port, () => {
  console.log(`http://127.0.0.1:${port}/stream`)
})
